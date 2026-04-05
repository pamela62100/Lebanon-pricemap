using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

<<<<<<< HEAD
/// <summary>
/// Controller for price feedback (verify / report on a price entry).
/// </summary>
=======
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
[ApiController]
[Route("api/feedback")]
public class FeedbackController : ControllerBase
{
<<<<<<< HEAD
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
=======
    private readonly FeedbackService _feedbackService;

    public FeedbackController(FeedbackService feedbackService)
    {
        _feedbackService = feedbackService;
    }

    // GET /api/feedback?status=open
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
<<<<<<< HEAD
        var results = await _service.GetAllAsync(status);
        return Ok(new { success = true, data = results });
    }

    /// <summary>
    /// PATCH /api/feedback/{id}/resolve — Resolve a feedback entry.
    /// </summary>
=======
        var feedback = await _feedbackService.GetAllAsync(status);
        return Ok(new { success = true, data = feedback });
    }

    // POST /api/feedback
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Submit([FromBody] SubmitFeedbackRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        Guid? userId = userIdClaim != null ? Guid.Parse(userIdClaim.Value) : null;

        var result = await _feedbackService.SubmitAsync(request, userId);
        return Ok(new { success = true, data = result });
    }

    // PATCH /api/feedback/{id}/resolve
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
    [HttpPatch("{id}/resolve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Resolve(Guid id)
    {
<<<<<<< HEAD
        var success = await _service.ResolveAsync(id);
        if (!success) return NotFound(new { success = false, message = "Feedback not found" });
        return Ok(new { success = true });
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim.Value) : null;
    }
=======
        var success = await _feedbackService.ResolveAsync(id);
        if (!success) return NotFound(new { success = false, message = "Feedback not found" });
        return Ok(new { success = true });
    }
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
}
