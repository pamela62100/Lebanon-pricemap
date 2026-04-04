namespace LebanonPriceMap.Server.DTOs;

/// <summary>
/// This class handles the incoming search filters from the frontend.
/// When you type in the search bar or select a category, these are the params sent to the API.
/// </summary>
public class PriceSearchRequest
{
    public string? Query { get; set; }      // e.g., "Milk"
    public string? Category { get; set; }   // e.g., "Dairy"
    public string? City { get; set; }       // e.g., "Beirut"
    public string? Sort { get; set; }       // e.g., "price" or "date"
    public bool? VerifiedOnly { get; set; } // To filter only confirmed prices
    public Guid? SubmittedBy { get; set; }  // To filter by submitter (BUG-05)
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
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
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
    
    // Nested objects that the UI needs to display names and locations
    public ProductDto? Product { get; set; }
    public StoreDto? Store { get; set; }
}

/// <summary>
/// Data required when a shopper submits a new price.
/// </summary>
public class PriceSubmissionRequest
{
    public string ProductId { get; set; } = string.Empty;
    public string StoreId { get; set; } = string.Empty;
    public decimal PriceLbp { get; set; }
    public bool IsPromotion { get; set; }
    public DateTime? PromoEndsAt { get; set; }
    public string? ReceiptImageUrl { get; set; }
    public string? Note { get; set; }
}

/// <summary>
/// Data required to vote on a price entry.
/// </summary>
public class VoteRequest
{
    public int Value { get; set; } // 1 for upvote, -1 for downvote
}

/// <summary>
/// A single point on the price history chart.
/// </summary>
public class PriceHistoryPoint
{
    public string Date { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Source { get; set; } = "community";
}

