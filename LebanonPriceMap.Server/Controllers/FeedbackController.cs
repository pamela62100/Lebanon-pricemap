using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
[Route("api/feedback")]
public class FeedbackController : ControllerBase
{
    private readonly FeedbackService _feedbackService;

    public FeedbackController(FeedbackService feedbackService)
    {
        _feedbackService = feedbackService;
    }

    // GET /api/feedback?status=open
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
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
    [HttpPatch("{id}/resolve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Resolve(Guid id)
    {
        var success = await _feedbackService.ResolveAsync(id);
        if (!success) return NotFound(new { success = false, message = "Feedback not found" });
        return Ok(new { success = true });
    }
}
