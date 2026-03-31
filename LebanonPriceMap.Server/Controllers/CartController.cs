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
