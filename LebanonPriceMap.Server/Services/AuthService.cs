using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace LebanonPriceMap.Server.Services;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly EmailService _email;

    public AuthService(AppDbContext db, IConfiguration config, EmailService email)
    {
        _db = db;
        _config = config;
        _email = email;
    }

    public async Task<AuthResponse?> Register(RegisterRequest request, bool adminCreating = false)
    {
        var emailClean = request.Email.ToLower().Trim();
        var nameClean = request.Name.Trim();

        // Only admins can create retailer/admin accounts
        var roleNormalized = (request.Role ?? "shopper").ToLower().Trim();
        if (!adminCreating && roleNormalized != "shopper")
            roleNormalized = "shopper";

        // Check if email already exists
        var exists = await _db.Users.AnyAsync(u => u.Email == emailClean);
        if (exists) return null;

        // Create initials from name (robustly)
        string initials;
        if (string.IsNullOrWhiteSpace(nameClean))
        {
            initials = "??";
        }
        else
        {
            var parts = nameClean.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            initials = parts.Length >= 2
                ? $"{parts[0][0]}{parts[^1][0]}"
                : nameClean.Length >= 2 ? nameClean[..2] : nameClean;
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = emailClean,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Name = nameClean,
            AvatarInitials = initials.ToUpper(),
            City = request.City,
            Role = roleNormalized,
            TrustScore = 50,
            TrustLevel = "medium",
            JoinedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Token = GenerateToken(user),
            Id = user.Id.ToString(),
            Email = user.Email,
            Name = user.Name ?? "",
            Role = user.Role,
            AvatarInitials = user.AvatarInitials,
            TrustScore = user.TrustScore,
            TrustLevel = user.TrustLevel
        };
    }

    public async Task<AuthResponse?> Login(LoginRequest request)
    {
        // Find user by email
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower().Trim());
        if (user == null) return null;

        // Check password
        var valid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!valid) return null;

        // Reject suspended/banned accounts
        if (user.Status != "active") return null;

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Token = GenerateToken(user),
            Id = user.Id.ToString(),
            Email = user.Email,
            Name = user.Name ?? "",
            Role = user.Role,
            AvatarInitials = user.AvatarInitials,
            TrustScore = user.TrustScore,
            TrustLevel = user.TrustLevel
        };
    }

    /// <summary>
    /// Returns the current user's profile from their JWT-extracted ID.
    /// Used by GET /api/auth/me.
    /// </summary>
    public async Task<AuthResponse?> GetCurrentUserAsync(Guid userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return null;

        return new AuthResponse
        {
            Token = "", // Not re-issued on /me
            Id = user.Id.ToString(),
            Email = user.Email,
            Name = user.Name ?? "",
            Role = user.Role,
            AvatarInitials = user.AvatarInitials,
            TrustScore = user.TrustScore,
            TrustLevel = user.TrustLevel
        };
    }

    /// <summary>
    /// Initiates a password reset. Always returns true (no enumeration).
    /// If the email exists, generates a token and emails a reset link.
    /// </summary>
    public async Task<bool> RequestPasswordResetAsync(string email, string baseUrl)
    {
        var emailClean = email.ToLower().Trim();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailClean);
        if (user == null) return true; // Silent success

        // Generate token (random 32 bytes → URL-safe base64)
        var rawBytes = RandomNumberGenerator.GetBytes(32);
        var rawToken = Convert.ToBase64String(rawBytes).Replace("+", "-").Replace("/", "_").TrimEnd('=');
        var hash = HashToken(rawToken);

        // Invalidate previous unused tokens
        var existing = await _db.PasswordResetTokens
            .Where(t => t.UserId == user.Id && t.UsedAt == null)
            .ToListAsync();
        foreach (var t in existing) t.UsedAt = DateTime.UtcNow;

        _db.PasswordResetTokens.Add(new PasswordResetToken
        {
            UserId = user.Id,
            TokenHash = hash,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
        });
        await _db.SaveChangesAsync();

        var resetLink = $"{baseUrl.TrimEnd('/')}/reset-password?token={rawToken}";
        var html = $@"
            <p>Hi {user.Name},</p>
            <p>We received a request to reset your WenArkhass password.</p>
            <p><a href=""{resetLink}"">Click here to reset your password</a> (link expires in 1 hour).</p>
            <p>If you didn't request this, you can safely ignore this email.</p>";

        await _email.SendAsync(user.Email, "Reset your WenArkhass password", html);
        return true;
    }

    /// <summary>
    /// Completes a password reset using a valid token.
    /// </summary>
    public async Task<bool> ResetPasswordAsync(string rawToken, string newPassword)
    {
        if (string.IsNullOrWhiteSpace(rawToken) || newPassword.Length < 6) return false;

        var hash = HashToken(rawToken);
        var token = await _db.PasswordResetTokens.FirstOrDefaultAsync(t => t.TokenHash == hash);
        if (token == null) return false;
        if (token.UsedAt != null) return false;
        if (token.ExpiresAt < DateTime.UtcNow) return false;

        var user = await _db.Users.FindAsync(token.UserId);
        if (user == null) return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.UpdatedAt = DateTime.UtcNow;
        token.UsedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Soft-deletes a user account (sets status='deleted' and anonymizes email).
    /// </summary>
    public async Task<bool> DeleteAccountAsync(Guid userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return false;

        user.Status = "deleted";
        user.Email = $"deleted_{user.Id:N}@deleted.local";
        user.Name = "Deleted User";
        user.PasswordHash = "DELETED";
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    private static string HashToken(string raw)
    {
        var bytes = Encoding.UTF8.GetBytes(raw);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash);
    }

    private string GenerateToken(User user)
    {
        var secret = _config["Jwt:Secret"]!;
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("name", user.Name ?? ""),
            new Claim("trustLevel", user.TrustLevel)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(double.Parse(_config["Jwt:ExpiryHours"]!)),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}