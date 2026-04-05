namespace LebanonPriceMap.Server.Models;

public class User
{
    public Guid Id { get; set; }
    public string Role { get; set; } = "shopper";
    public string Status { get; set; } = "active";
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? AvatarInitials { get; set; }
    public string? City { get; set; }
    public int TrustScore { get; set; } = 50;
    public string TrustLevel { get; set; } = "medium";
    public int UploadCount { get; set; } = 0;
    public int VerifiedCount { get; set; } = 0;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}