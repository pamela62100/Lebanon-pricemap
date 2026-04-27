using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
[Route("api/approvals")]
[Authorize(Roles = "admin")]
public class ApprovalsController : ControllerBase
{
    private readonly ApprovalService _approvalService;

    public ApprovalsController(ApprovalService approvalService)
    {
        _approvalService = approvalService;
    }

    // GET /api/approvals?status=pending
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var requests = await _approvalService.GetAllAsync(status);
        return Ok(new { success = true, data = requests });
    }

    // GET /api/approvals/pending-count
    [HttpGet("pending-count")]
    public async Task<IActionResult> GetPendingCount()
    {
        var count = await _approvalService.GetPendingCountAsync();
        return Ok(new { success = true, data = count });
    }

    // POST /api/approvals
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateApprovalRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim.Value);
        var result = await _approvalService.CreateAsync(request, userId);
        return Ok(new { success = true, data = result });
    }

    // PATCH /api/approvals/{id}/approve
    [HttpPatch("{id}/approve")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Approve(Guid id, [FromBody] ResolveApprovalRequest request)
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (adminIdClaim == null) return Unauthorized();

        var adminId = Guid.Parse(adminIdClaim.Value);
        var success = await _approvalService.ApproveAsync(id, adminId, request.Note);
        if (!success) return NotFound(new { success = false, message = "Approval request not found" });
        return Ok(new { success = true });
    }

    // PATCH /api/approvals/{id}/reject
    [HttpPatch("{id}/reject")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Reject(Guid id, [FromBody] ResolveApprovalRequest request)
    {
        var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (adminIdClaim == null) return Unauthorized();

        var adminId = Guid.Parse(adminIdClaim.Value);
        var success = await _approvalService.RejectAsync(id, adminId, request.Note);
        if (!success) return NotFound(new { success = false, message = "Approval request not found" });
        return Ok(new { success = true });
    }
}
