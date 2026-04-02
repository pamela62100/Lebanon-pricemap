using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;
    private readonly UserService _userService;

    public AdminController(AdminService adminService, UserService userService)
    {
        _adminService = adminService;
        _userService = userService;
    }

    // GET /api/admin/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _adminService.GetStatsAsync();
        return Ok(new { success = true, data = stats });
    }

    // GET /api/admin/users?search=&role=
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] string? search, [FromQuery] string? role)
    {
        var users = await _adminService.GetAllUsersAsync(search, role);
        return Ok(new { success = true, data = users });
    }

    // PATCH /api/admin/users/{id}/status
    [HttpPatch("users/{id}/status")]
    public async Task<IActionResult> UpdateUserStatus(Guid id, [FromBody] UserStatusUpdateRequest request)
    {
        var success = await _userService.UpdateUserStatusAsync(id, request.Status);
        if (!success) return NotFound(new { success = false, message = "User not found" });
        return Ok(new { success = true });
    }

    // GET /api/admin/audit-logs
    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs()
    {
        var logs = await _adminService.GetAuditLogsAsync();
        return Ok(new { success = true, data = logs });
    }

    // GET /api/admin/anomalies?status=active
    [HttpGet("anomalies")]
    public async Task<IActionResult> GetAnomalies([FromQuery] string? status)
    {
        var results = await _adminService.GetAnomaliesAsync(status);
        return Ok(new { success = true, data = results });
    }

    // GET /api/admin/onboarding?status=pending
    [HttpGet("onboarding")]
    public async Task<IActionResult> GetOnboarding([FromQuery] string? status)
    {
        var results = await _adminService.GetOnboardingApplicationsAsync(status);
        return Ok(new { success = true, data = results });
    }

    // PATCH /api/admin/onboarding/{id}/step
    [HttpPatch("onboarding/{id}/step")]
    public async Task<IActionResult> UpdateOnboardingStep(Guid id, [FromBody] UpdateOnboardingStepRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        var adminId = Guid.Parse(userIdClaim.Value);

        var success = await _adminService.UpdateOnboardingStepAsync(id, request, adminId);
        if (!success) return NotFound(new { success = false, message = "Application not found" });
        return Ok(new { success = true });
    }
}
