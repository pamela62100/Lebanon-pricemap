namespace LebanonPriceMap.Server.DTOs;

/// <summary>
/// Response DTO for a user's public profile.
/// Returned by GET /api/users/{id}.
/// Contains profile info, trust data, and contribution stats.
/// </summary>
public class UserProfileResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? AvatarInitials { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "shopper";
    public string Status { get; set; } = "active";
    public string? City { get; set; }

    // Trust & contribution stats
    public int TrustScore { get; set; }
    public string TrustLevel { get; set; } = "medium";
    public int UploadCount { get; set; }
    public int VerifiedCount { get; set; }

    // Timestamps
    public DateTime JoinedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}

/// <summary>
/// Request DTO for PUT /api/users/{id}.
/// Only allows updating personal details – role, trust, and status
/// are managed through separate admin endpoints.
/// </summary>
public class UserUpdateRequest
{
    public string? Name { get; set; }
    public string? AvatarInitials { get; set; }
    public string? City { get; set; }
}

/// <summary>
/// Request DTO for PATCH /api/users/{id}/status (Admin only).
/// Allows an admin to ban, warn, or suspend a user.
/// </summary>
public class UserStatusUpdateRequest
{
    /// <summary>
    /// New status value: 'active', 'warned', 'suspended', 'banned'.
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Optional reason for the status change (stored in admin audit log).
    /// </summary>
    public string? Reason { get; set; }
}

/// <summary>
/// Response DTO for a single notification.
/// Returned by GET /api/users/{id}/notifications.
/// </summary>
public class NotificationResponse
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = "system";
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime CreatedAt { get; set; }

    // Related entity IDs (nullable – only populated when relevant)
    public string? RelatedPriceEntryId { get; set; }
    public string? RelatedStoreId { get; set; }
    public string? RelatedProductId { get; set; }
    public string? RelatedAlertId { get; set; }
}
