using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

/// <summary>
/// Controller for price feedback (verify / report on a price entry).
/// </summary>
[ApiController]
[Route("api/feedback")]
public class FeedbackController : ControllerBase
{
    private readonly FeedbackService _service;

    public FeedbackController(FeedbackService service)
    {
        _service = service;
    }

    /// <summary>
    /// POST /api/feedback — Submit feedback on a price entry.
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Submit([FromBody] FeedbackSubmitRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var result = await _service.SubmitAsync(request, userId.Value);
        return Ok(new { success = true, data = result });
    }

    /// <summary>
    /// GET /api/feedback?status=open — List feedback entries.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var results = await _service.GetAllAsync(status);
        return Ok(new { success = true, data = results });
    }

    /// <summary>
    /// PATCH /api/feedback/{id}/resolve — Resolve a feedback entry.
    /// </summary>
    [HttpPatch("{id}/resolve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Resolve(Guid id)
    {
        var success = await _service.ResolveAsync(id);
        if (!success) return NotFound(new { success = false, message = "Feedback not found" });
        return Ok(new { success = true });
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim.Value) : null;
    }
}
