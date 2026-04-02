namespace LebanonPriceMap.Server.DTOs;

public class AdminStatsResponse
{
    public int TotalUsers { get; set; }
    public int TotalUploads { get; set; }
    public int FlaggedEntries { get; set; }
    public int ActiveStores { get; set; }
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

public class AnomalyResponse
{
    public string Id { get; set; } = string.Empty;
    public string StoreId { get; set; } = string.Empty;
    public string StoreName { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal OldPriceLbp { get; set; }
    public decimal NewPriceLbp { get; set; }
    public decimal ChangePercent { get; set; }
    public string Severity { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime DetectedAt { get; set; }
}

public class OnboardingApplicationResponse
{
    public string Id { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string ProposedStoreName { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? District { get; set; }
    public short CurrentStep { get; set; }
    public short TotalSteps { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? AdminNotes { get; set; }
    public DateTime AppliedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
}

public class UpdateOnboardingStepRequest
{
    public short Step { get; set; }
    public string? AdminNotes { get; set; }
    public string? Status { get; set; }
}
