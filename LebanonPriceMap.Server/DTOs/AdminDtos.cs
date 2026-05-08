namespace LebanonPriceMap.Server.DTOs;

public class AdminStatsResponse
{
    public int TotalUsers { get; set; }
    public int TotalUploads { get; set; }
    public int ActiveStores { get; set; }
    public int PendingReports { get; set; }
}

public class AdminUserResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? AvatarInitials { get; set; }
    public int TrustScore { get; set; }
    public string TrustLevel { get; set; } = string.Empty;
    public int UploadCount { get; set; }
    public int VerifiedCount { get; set; }
    public DateTime JoinedAt { get; set; }
}

public class AdminAuditLogResponse
{
    public string Id { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? PerformedByName { get; set; }
    public string? TargetUserId { get; set; }
    public string? TargetProductId { get; set; }
    public string? TargetPriceEntryId { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}

