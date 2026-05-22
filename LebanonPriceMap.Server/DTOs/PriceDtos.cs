namespace LebanonPriceMap.Server.DTOs;

/// <summary>
/// This class handles the incoming search filters from the frontend.
/// When you type in the search bar or select a category, these are the params sent to the API.
/// </summary>
public class PriceSearchRequest
{
    public string? Query { get; set; }
    public string? Category { get; set; }
    public string? City { get; set; }
    public string? Sort { get; set; }
    public bool? VerifiedOnly { get; set; }
    public bool? InStockOnly { get; set; }
    public int Limit { get; set; } = 50;
    public int Offset { get; set; } = 0;
}

/// <summary>
/// Mini-object for Product details inside the search result.
/// </summary>
public class ProductDto {
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
}

/// <summary>
/// Mini-object for Store details inside the search result.
/// </summary>
public class StoreDto {
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? District { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string PowerStatus { get; set; } = "stable";
    public bool IsVerifiedRetailer { get; set; }
}

/// <summary>
/// This is the "Contract" for a single search result.
/// It must match the 'PriceEntry' interface in the React frontend.
/// </summary>
public class PriceEntryResponse {
    public string Id { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public string StoreId { get; set; } = string.Empty;
    public decimal PriceLbp { get; set; }
    public string Status { get; set; } = "pending";
    public string Source { get; set; } = "community";
    public bool IsPromotion { get; set; }
    public DateTime? PromoEndsAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Upvotes { get; set; }
    public bool IsInStock { get; set; } = true;

    // Nested objects that the UI needs to display names and locations
    public ProductDto? Product { get; set; }
    public StoreDto? Store { get; set; }
}


public class BulkPriceSubmissionRow
{
    public string? ProductName { get; set; }
    public string? Barcode { get; set; }
    public decimal? PriceLbp { get; set; }
    public string? Unit { get; set; }
}

public class BulkPriceSubmissionRequest
{
    public List<BulkPriceSubmissionRow> Rows { get; set; } = new();
    public string Method { get; set; } = "csv";
}

public class BulkPriceSubmissionResult
{
    public int RecordsReceived { get; set; }
    public int RecordsProcessed { get; set; }
    public int RecordsFailed { get; set; }
    public string Status { get; set; } = "pending";
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// Data required to vote on a price entry.
/// </summary>
public class VoteRequest
{
    public int Value { get; set; } // 1 for upvote, -1 for downvote
}

/// <summary>
/// A single data point in a product's price history chart.
/// </summary>
public class PriceHistoryPoint
{
    public string Date { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string StoreName { get; set; } = string.Empty;
}

