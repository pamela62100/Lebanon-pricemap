using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
[Route("api/discrepancy")]
public class DiscrepancyController : ControllerBase
{
    private readonly DiscrepancyService _discrepancyService;

    public DiscrepancyController(DiscrepancyService discrepancyService)
    {
        _discrepancyService = discrepancyService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Submit([FromBody] DiscrepancySubmissionRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        
        var userId = Guid.Parse(userIdClaim.Value);
        var report = await _discrepancyService.SubmitReportAsync(request, userId);

        return Ok(new { success = true, data = report });
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetPending()
    {
        var reports = await _discrepancyService.GetPendingReportsAsync();
        return Ok(new { success = true, data = reports });
    }

    [HttpGet("store/{id}")]
    [Authorize(Roles = "Admin,Retailer")]
    public async Task<IActionResult> GetByStore(Guid id)
    {
        var reports = await _discrepancyService.GetReportsByStoreAsync(id);
        return Ok(new { success = true, data = reports });
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Approve(Guid id, [FromBody] ResolveDiscrepancyRequest request)
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (adminIdClaim == null) return Unauthorized();
        
        var adminId = Guid.Parse(adminIdClaim.Value);
        var success = await _discrepancyService.ApproveReportAsync(id, adminId, request.ApprovedPrice, request.Note);

        if (!success) return NotFound(new { success = false, message = "Report not found" });
        return Ok(new { success = true });
    }

    [HttpPatch("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Reject(Guid id, [FromBody] ResolveDiscrepancyRequest request)
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (adminIdClaim == null) return Unauthorized();
        
        var adminId = Guid.Parse(adminIdClaim.Value);
        var success = await _discrepancyService.RejectReportAsync(id, adminId, request.Note);

        if (!success) return NotFound(new { success = false, message = "Report not found" });
        return Ok(new { success = true });
    }
}
