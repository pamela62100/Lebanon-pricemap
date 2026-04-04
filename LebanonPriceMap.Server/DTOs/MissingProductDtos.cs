namespace LebanonPriceMap.Server.DTOs;

/// <summary>
/// Request to report a missing product at a store.
/// </summary>
public class MissingProductSubmitRequest
{
    public Guid StoreId { get; set; }
    public Guid? ProductId { get; set; }
    public string? ProductNameFreetext { get; set; }
    public string? Note { get; set; }
}

/// <summary>
/// Admin resolution of a missing product request.
/// </summary>
public class MissingProductResolveRequest
{
    public string? ReviewNote { get; set; }
}

/// <summary>
/// Response DTO for a missing product request.
/// </summary>
public class MissingProductResponse
{
    public string Id { get; set; } = string.Empty;
    public string StoreId { get; set; } = string.Empty;
    public string? StoreName { get; set; }
    public string? ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? ProductNameFreetext { get; set; }
    public string? RequestedBy { get; set; }
    public short? RequesterTrustScore { get; set; }
    public string? Note { get; set; }
    public string Status { get; set; } = "pending";
    public string? ReviewNote { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}
