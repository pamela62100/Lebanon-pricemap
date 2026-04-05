using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

/// <summary>
/// Controller for the Smart Cart feature.
/// Base URL: /api/cart
/// </summary>
[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly CartService _cartService;

    public CartController(CartService cartService)
    {
        _cartService = cartService;
    }

    /// <summary>
    /// GET /api/cart
    /// Retrieve the shopper's saved cart items.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var cart = await _cartService.GetCartAsync(userId.Value);
        return Ok(new { success = true, data = cart });
    }

    /// <summary>
    /// POST /api/cart/items
    /// Add an item to the shopping list.
    /// </summary>
    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddCartItemRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var cart = await _cartService.AddItemAsync(userId.Value, request);
        return Ok(new { success = true, data = cart });
    }

    /// <summary>
    /// DELETE /api/cart/items/{id}
<<<<<<< HEAD
    /// Remove a single item from the shopping list.
=======
    /// Remove a specific item from the cart.
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
    /// </summary>
    [HttpDelete("items/{id}")]
    public async Task<IActionResult> RemoveItem(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var success = await _cartService.RemoveItemAsync(userId.Value, id);
        if (!success) return NotFound(new { success = false, message = "Cart item not found" });
<<<<<<< HEAD

=======
        return Ok(new { success = true });
    }

    /// <summary>
    /// PATCH /api/cart/items/{id}
    /// Update the quantity of a cart item.
    /// </summary>
    [HttpPatch("items/{id}")]
    public async Task<IActionResult> UpdateItemQuantity(Guid id, [FromBody] UpdateCartItemRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var cart = await _cartService.UpdateQuantityAsync(userId.Value, id, request.Quantity);
        if (cart == null) return NotFound(new { success = false, message = "Cart item not found" });
        return Ok(new { success = true, data = cart });
    }

    /// <summary>
    /// DELETE /api/cart
    /// Clear all items from the cart.
    /// </summary>
    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await _cartService.ClearCartAsync(userId.Value);
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
        return Ok(new { success = true });
    }

    /// <summary>
    /// GET /api/cart/optimize
    /// Run the algorithm to figure out which nearby store has the cheapest total basket.
    /// </summary>
    [HttpGet("optimize")]
    public async Task<IActionResult> Optimize()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var result = await _cartService.OptimizeCartAsync(userId.Value);
        return Ok(new { success = true, data = result });
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim.Value) : null;
    }
}
