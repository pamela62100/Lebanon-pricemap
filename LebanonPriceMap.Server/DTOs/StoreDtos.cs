namespace LebanonPriceMap.Server.DTOs;

/// <summary>
/// Response DTO for a Store.
/// This matches the frontend 'Store' interface in types/index.ts.
/// </summary>
public class StoreResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Chain { get; set; }
    public string City { get; set; } = string.Empty;
    public string? District { get; set; }
    public string? Region { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public bool IsVerifiedRetailer { get; set; }
    public string? OwnerId { get; set; }        // Maps to 'ownerId' in the frontend
    public int TrustScore { get; set; }
    public string Status { get; set; } = "pending";
    public decimal? InternalRateLbp { get; set; }
    public string PowerStatus { get; set; } = "stable";
    public string? LogoUrl { get; set; }
}

public class StoreUpdateRequest
{
    public string Name { get; set; }
    public string Chain { get; set; }
    public string City { get; set; }
    public string District { get; set; }
    public string Region { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
}

public class StoreStatusUpdateRequest
{
    public string Status { get; set; } // 'active', 'suspended', 'flagged'
}

public class StorePowerStatusUpdateRequest
{
    public string PowerStatus { get; set; } // 'stable', 'unstable', 'reported_warm'
}
