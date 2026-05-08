using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;
    private readonly UserService _userService;
    private readonly AuthService _authService;

    public AdminController(AdminService adminService, UserService userService, AuthService authService)
    {
        _adminService = adminService;
        _userService = userService;
        _authService = authService;
    }

    // GET /api/admin/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _adminService.GetStatsAsync();
        return Ok(new { success = true, data = stats });
    }

    // POST /api/admin/users — create a user with a specific role (admin only)
    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] RegisterRequest request)
    {
        var result = await _authService.Register(request, adminCreating: true);
        if (result == null)
            return Conflict(new { success = false, message = "A user with that email already exists." });
        return Ok(new { success = true, data = result });
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

}
