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
    public List<StoreBasketCost> Stores { get; set; } = new();
    public string? RecommendedStoreId { get; set; }
    public string? RecommendedStoreName { get; set; }
    public long RecommendedTotalLbp { get; set; }
}

public class StoreBasketCost
{
    public string StoreId { get; set; } = string.Empty;
    public string StoreName { get; set; } = string.Empty;
    public long TotalLbp { get; set; }
    public int ItemsCovered { get; set; }
    public int ItemsMissing { get; set; }
}
