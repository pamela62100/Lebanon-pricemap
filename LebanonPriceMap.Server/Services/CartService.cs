using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

/// <summary>
/// Service layer for the Smart Cart feature.
/// Manages the shopper's shopping list and runs the store optimizer.
/// </summary>
public class CartService
{
    private readonly AppDbContext _db;

    public CartService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Retrieves (or creates) the user's cart with all items.
    /// </summary>
    public async Task<CartResponse> GetCartAsync(Guid userId)
    {
        var cart = await _db.Carts
            .Include(c => c.Items)
                .ThenInclude(ci => ci.Product)
            .Include(c => c.Items)
                .ThenInclude(ci => ci.Store)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        // Auto-create a cart if none exists
        if (cart == null)
        {
            cart = new Cart
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Carts.Add(cart);
            await _db.SaveChangesAsync();
        }

        return MapCartToResponse(cart);
    }

    /// <summary>
    /// Adds an item to the shopper's cart. If the product already exists, increments quantity.
    /// </summary>
    public async Task<CartResponse> AddItemAsync(Guid userId, AddCartItemRequest request)
    {
        // Ensure the cart exists
        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Carts.Add(cart);
            await _db.SaveChangesAsync();
        }

        // Check if product already in cart
        var existing = cart.Items.FirstOrDefault(ci => ci.ProductId == request.ProductId);
        if (existing != null)
        {
            existing.Quantity += request.Quantity;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var item = new CartItem
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                ProductId = request.ProductId,
                StoreId = request.StoreId,
                Quantity = request.Quantity,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.CartItems.Add(item);
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        // Reload with navigation props
        var reloaded = await _db.Carts
            .Include(c => c.Items).ThenInclude(ci => ci.Product)
            .Include(c => c.Items).ThenInclude(ci => ci.Store)
            .FirstAsync(c => c.Id == cart.Id);

        return MapCartToResponse(reloaded);
    }

    /// <summary>
    /// Removes an item from the cart.
    /// </summary>
    public async Task<bool> RemoveItemAsync(Guid userId, Guid itemId)
    {
        var item = await _db.CartItems
            .Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == itemId && ci.Cart.UserId == userId);

        if (item == null) return false;

        _db.CartItems.Remove(item);

        var cart = await _db.Carts.FindAsync(item.CartId);
        if (cart != null) cart.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Updates the quantity of a cart item. Removes if quantity <= 0.
    /// </summary>
    public async Task<CartResponse?> UpdateQuantityAsync(Guid userId, Guid itemId, int quantity)
    {
        var item = await _db.CartItems
            .Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == itemId && ci.Cart.UserId == userId);

        if (item == null) return null;

        if (quantity <= 0)
        {
            _db.CartItems.Remove(item);
        }
        else
        {
            item.Quantity = quantity;
            item.UpdatedAt = DateTime.UtcNow;
        }

        var cart = await _db.Carts.FindAsync(item.CartId);
        if (cart != null) cart.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var reloaded = await _db.Carts
            .Include(c => c.Items).ThenInclude(ci => ci.Product)
            .Include(c => c.Items).ThenInclude(ci => ci.Store)
            .FirstAsync(c => c.Id == item.CartId);

        return MapCartToResponse(reloaded);
    }

    /// <summary>
    /// Clears all items from the user's cart.
    /// </summary>
    public async Task ClearCartAsync(Guid userId)
    {
        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null) return;

        _db.CartItems.RemoveRange(cart.Items);
        cart.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    /// <summary>
    /// Runs the Greedy Basket Optimizer: for each store that carries at least one cart item,
    /// calculates the total cost and returns the cheapest option.
    /// </summary>
    public async Task<CartOptimizationResult> OptimizeCartAsync(Guid userId)
    {
        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.Items.Any())
        {
            return new CartOptimizationResult();
        }

        var productIds = cart.Items.Select(i => i.ProductId).ToList();

        // Get all catalog prices for these products across all stores
        var catalogPrices = await _db.StoreCatalogItems
            .Where(sci => productIds.Contains(sci.ProductId) && sci.IsInStock)
            .Include(sci => sci.Store)
            .ToListAsync();

        // Group by store and calculate totals
        var storeGroups = catalogPrices
            .GroupBy(cp => cp.StoreId)
            .Select(g =>
            {
                var store = g.First().Store;
                long total = 0;
                int covered = 0;

                foreach (var cartItem in cart.Items)
                {
                    var catalogEntry = g.FirstOrDefault(cp => cp.ProductId == cartItem.ProductId);
                    if (catalogEntry != null)
                    {
                        // Use promo price if active, otherwise official
                        var price = (catalogEntry.IsPromotion &&
                                     catalogEntry.PromoPriceLbp.HasValue &&
                                     (catalogEntry.PromoEndsAt == null || catalogEntry.PromoEndsAt > DateTime.UtcNow))
                            ? (long)catalogEntry.PromoPriceLbp.Value
                            : (long)(catalogEntry.OfficialPriceLbp ?? 0);

                        total += price * cartItem.Quantity;
                        covered++;
                    }
                }

                return new StoreBasketCost
                {
                    StoreId = store!.Id.ToString(),
                    StoreName = store.Name,
                    TotalLbp = total,
                    ItemsCovered = covered,
                    ItemsMissing = cart.Items.Count - covered
                };
            })
            .Where(s => s.ItemsCovered > 0)
            .OrderBy(s => s.TotalLbp)
            .ToList();

        var best = storeGroups.FirstOrDefault();

        return new CartOptimizationResult
        {
            Stores = storeGroups,
            RecommendedStoreId = best?.StoreId,
            RecommendedStoreName = best?.StoreName,
            RecommendedTotalLbp = best?.TotalLbp ?? 0
        };
    }

    private static CartResponse MapCartToResponse(Cart cart)
    {
        return new CartResponse
        {
            Id = cart.Id.ToString(),
            UpdatedAt = cart.UpdatedAt,
            Items = cart.Items.Select(ci => new CartItemResponse
            {
                Id = ci.Id.ToString(),
                ProductId = ci.ProductId.ToString(),
                ProductName = ci.Product?.Name ?? "",
                ProductNameAr = ci.Product?.NameAr,
                StoreId = ci.StoreId?.ToString(),
                StoreName = ci.Store?.Name,
                Quantity = ci.Quantity
            }).ToList()
        };
    }
}
