using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LebanonPriceMap.Server.Services;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<AuthResponse?> Register(RegisterRequest request)
    {
        // Check if email already exists
        var exists = await _db.Users.AnyAsync(u => u.Email == request.Email);
        if (exists) return null;

        // Create initials from name
        var parts = request.Name.Trim().Split(' ');
        var initials = parts.Length >= 2
            ? $"{parts[0][0]}{parts[^1][0]}"
            : request.Name[..1];

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Name = request.Name,
            AvatarInitials = initials.ToUpper(),
            City = request.City,
            Role = request.Role,
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