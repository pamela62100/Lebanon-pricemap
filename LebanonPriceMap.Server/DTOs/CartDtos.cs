namespace LebanonPriceMap.Server.DTOs;

/// <summary>
/// Response for GET /api/cart — the user's saved cart with items.
/// </summary>
public class CartResponse
{
    public string Id { get; set; } = string.Empty;
    public List<CartItemResponse> Items { get; set; } = new();
    public DateTime UpdatedAt { get; set; }
}

public class CartItemResponse
{
    public string Id { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string? ProductNameAr { get; set; }
    public string? StoreId { get; set; }
    public string? StoreName { get; set; }
    public int Quantity { get; set; }
}

/// <summary>
/// Request for POST /api/cart/items — add an item to the shopping list.
/// </summary>
public class AddCartItemRequest
{
    public Guid ProductId { get; set; }
    public Guid? StoreId { get; set; }
    public int Quantity { get; set; } = 1;
}

/// <summary>
/// Response for GET /api/cart/optimize — cheapest store breakdown.
/// </summary>
public class CartOptimizationResult
{
    public int TotalItemCount { get; set; }
    public List<StoreBasketCost> Stores { get; set; } = new();

    // Cheapest store that has every item, or null if none do
    public string? BestCompleteStoreId { get; set; }

    // Cheapest store overall, even if it's missing items
    public string? CheapestPartialStoreId { get; set; }
}

public class UpdateCartItemRequest
{
    public int Quantity { get; set; }
}

public class StoreBasketCost
{
    public string StoreId { get; set; } = string.Empty;
    public string StoreName { get; set; } = string.Empty;
    public long TotalLbp { get; set; }
    public int FoundCount { get; set; }
    public int TotalCount { get; set; }
    public bool IsComplete => FoundCount == TotalCount && TotalCount > 0;
    public List<BasketItem> FoundItems { get; set; } = new();
    public List<BasketItem> MissingItems { get; set; } = new();
}

public class BasketItem
{
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public long? UnitPriceLbp { get; set; }
}
