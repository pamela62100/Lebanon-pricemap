using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

/// <summary>
/// Controller for missing product requests.
/// Shoppers report products they cannot find in a store's catalog.
/// </summary>
[ApiController]
[Route("api/missing-products")]
public class MissingProductsController : ControllerBase
{
    private readonly MissingProductService _service;

    public MissingProductsController(MissingProductService service)
    {
        _service = service;
    }

    /// <summary>
    /// POST /api/missing-products — Submit a missing product request.
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Submit([FromBody] MissingProductSubmitRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var result = await _service.SubmitAsync(request, userId.Value);
        return Ok(new { success = true, data = result });
    }

    /// <summary>
    /// GET /api/missing-products/pending — Admin: view pending requests.
    /// </summary>
    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetPending()
    {
        var results = await _service.GetPendingAsync();
        return Ok(new { success = true, data = results });
    }

    /// <summary>
    /// GET /api/missing-products/my — Get the current user's requests.
    /// </summary>
    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMy()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var results = await _service.GetByUserAsync(userId.Value);
        return Ok(new { success = true, data = results });
    }

    /// <summary>
    /// PATCH /api/missing-products/{id}/approve — Admin: approve a request.
    /// </summary>
    [HttpPatch("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Approve(Guid id, [FromBody] MissingProductResolveRequest request)
    {
        var adminId = GetUserId();
        if (adminId == null) return Unauthorized();

        var success = await _service.ApproveAsync(id, adminId.Value, request.ReviewNote);
        if (!success) return NotFound(new { success = false, message = "Request not found" });
        return Ok(new { success = true });
    }

    /// <summary>
    /// PATCH /api/missing-products/{id}/reject — Admin: reject a request.
    /// </summary>
    [HttpPatch("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Reject(Guid id, [FromBody] MissingProductResolveRequest request)
    {
        var adminId = GetUserId();
        if (adminId == null) return Unauthorized();

        var success = await _service.RejectAsync(id, adminId.Value, request.ReviewNote);
        if (!success) return NotFound(new { success = false, message = "Request not found" });
        return Ok(new { success = true });
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim.Value) : null;
    }
}
