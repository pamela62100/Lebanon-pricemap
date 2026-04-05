namespace LebanonPriceMap.Server.DTOs;

/// <summary>
/// Response for GET /api/fuel — current fuel prices.
/// </summary>
public class FuelPriceResponse
{
    public string Id { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public decimal OfficialPriceLbp { get; set; }
    public decimal? ReportedPriceLbp { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }
    public string? Source { get; set; }
}

/// <summary>
/// Response for GET /api/fuel/stations — station info with latest report.
/// </summary>
public class StationResponse
{
    public string StoreId { get; set; } = string.Empty;
    public string StoreName { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? District { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? PowerStatus { get; set; }

    // Latest report info (null if never reported)
    public bool? IsOpen { get; set; }
    public bool? HasStock { get; set; }
    public int? QueueMinutes { get; set; }
    public int? QueueDepth { get; set; }
    public bool? IsRationed { get; set; }
    public DateTime? LastReportedAt { get; set; }
}

/// <summary>
/// Request for POST /api/fuel/stations/{id}/report — shopper reports station status.
/// </summary>
public class StationReportRequest
{
    public string FuelType { get; set; } = "gasoline_95";
    public bool IsOpen { get; set; } = true;
    public bool HasStock { get; set; } = true;
    public int QueueMinutes { get; set; } = 0;
    public int QueueDepth { get; set; } = 0;
    public bool IsRationed { get; set; } = false;
    public decimal? LimitAmountLbp { get; set; }
}
