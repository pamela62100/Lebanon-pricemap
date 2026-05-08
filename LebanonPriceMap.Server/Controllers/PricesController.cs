using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace LebanonPriceMap.Server.Controllers;

/// <summary>
/// This controller is the "Gateway" for all Price-related requests.
/// It receives HTTP requests from the frontend and routes them to the PriceService.
/// </summary>
[ApiController]
[Route("api/prices")] // This makes the URL: http://localhost:5000/api/prices
public class PricesController : ControllerBase
{
    private readonly PriceService _priceService;

    // We inject the PriceService here (Dependency Injection)
    public PricesController(PriceService priceService)
    {
        _priceService = priceService;
    }

    /// <summary>
    /// GET /api/prices/search?query=milk&category=Dairy
    /// This is the endpoint your frontend SearchPage will call.
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] PriceSearchRequest request)
    {
        // 1. Call the service to do the heavy lifting
        var results = await _priceService.SearchAsync(request);

        // 2. Return the data in a standard format
        // The anonymous object { success = true, data = ... } matches the 'ApiResponse' interface in React.
        return Ok(new 
        { 
            success = true, 
            data = results 
        });
    }

    /// <summary>
    /// GET /api/prices/product/{id}
    /// Returns all prices (at different stores) for a single product.
    /// </summary>
    [HttpGet("product/{id}")]
    public async Task<IActionResult> GetByProduct(string id)
    {
        var results = await _priceService.GetByProductAsync(id);
        return Ok(new { success = true, data = results });
    }

    /// <summary>
    /// GET /api/prices/product/{id}/history
    /// Returns chronological price submissions for a product (powers the history chart).
    /// </summary>
    [HttpGet("product/{id}/history")]
    public async Task<IActionResult> GetHistory(string id)
    {
        var results = await _priceService.GetHistoryByProductAsync(id);
        return Ok(new { success = true, data = results });
    }

    /// <summary>
    /// GET /api/prices/{id}
    /// Returns details for a specific price entry.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _priceService.GetByIdAsync(id);
        if (result == null) return NotFound(new { success = false, message = "Price entry not found" });
        return Ok(new { success = true, data = result });
    }

    /// <summary>
    /// POST /api/prices/bulk
    /// Upload multiple price rows in one request and record a sync run.
    /// </summary>
    [HttpPost("bulk")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "retailer,admin")]
    public async Task<IActionResult> SubmitBulk([FromBody] BulkPriceSubmissionRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        
        var userId = Guid.Parse(userIdClaim.Value);

        try
        {
            var result = await _priceService.SubmitBulkPricesAsync(request, userId);
            return Ok(new { success = true, data = result });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            var message = ex.InnerException?.Message ?? ex.Message;
            return StatusCode(500, new { success = false, message = $"Database error: {message}" });
        }
    }

    /// <summary>
    /// POST /api/prices/{id}/vote
    /// Verify a price entry. Each user may verify a given price only once.
    /// </summary>
    [HttpPost("{id}/vote")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Vote(string id, [FromBody] VoteRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        var userId = Guid.Parse(userIdClaim.Value);

        var result = await _priceService.VoteAsync(id, request.Value, userId);

        if (result == "not_found")
            return NotFound(new { success = false, message = "Price entry not found" });
        if (result == "already_verified")
            return Conflict(new { success = false, message = "You already verified this price" });

        return Ok(new { success = true });
    }
}
