using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

/// <summary>
/// Controller for User Management & Profiles.
/// Base URL: /api/users
///
/// Endpoints:
///   GET    /api/users/{id}               – Admin or Self: get profile
///   PUT    /api/users/{id}               – Self: update personal details
///   GET    /api/users/{id}/notifications  – Self: paginated notifications
///   PATCH  /api/users/{id}/status         – Admin: warn / suspend / reactivate
/// </summary>
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    // ───────────────────────────────────────────────
    // GET /api/users/{id}
    // ───────────────────────────────────────────────

    /// <summary>
    /// Get a user's public profile, stats, and trust score.
    /// Accessible by Admin (any user) or the user themselves.
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetProfile(Guid id)
    {
        // Authorization: only the user themselves or an Admin can view
        var callerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (callerIdClaim == null) return Unauthorized();

        var callerId = Guid.Parse(callerIdClaim.Value);
        var callerRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";

        // If the caller is not an admin and is not requesting their own profile → deny
        if (callerRole != "Admin" && callerId != id)
            return Forbid();

        var profile = await _userService.GetProfileAsync(id);
        if (profile == null)
            return NotFound(new { success = false, message = "User not found" });

        return Ok(new { success = true, data = profile });
    }

    // ───────────────────────────────────────────────
    // PUT /api/users/{id}
    // ───────────────────────────────────────────────

    /// <summary>
    /// Update personal details (Name, avatar, default city).
    /// Only the user themselves can update their own profile.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile(Guid id, [FromBody] UserUpdateRequest request)
    {
        // Authorization: only Self can update their own profile
        var callerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (callerIdClaim == null) return Unauthorized();

        var callerId = Guid.Parse(callerIdClaim.Value);
        if (callerId != id)
            return Forbid();

        var success = await _userService.UpdateProfileAsync(id, request);
        if (!success)
            return NotFound(new { success = false, message = "User not found" });

        return Ok(new { success = true });
    }

    // ───────────────────────────────────────────────
    // GET /api/users/{id}/notifications?page=1&pageSize=20
    // ───────────────────────────────────────────────

    /// <summary>
    /// Get paginated notifications for the user.
    /// Only the user themselves can view their notifications.
    /// </summary>
    [HttpGet("{id}/notifications")]
    [Authorize]
    public async Task<IActionResult> GetNotifications(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        // Authorization: Self only
        var callerIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (callerIdClaim == null) return Unauthorized();

        var callerId = Guid.Parse(callerIdClaim.Value);
        if (callerId != id)
            return Forbid();

        // Clamp page and pageSize to reasonable bounds
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 1;
        if (pageSize > 100) pageSize = 100;

        var (items, totalCount) = await _userService.GetNotificationsAsync(id, page, pageSize);

        return Ok(new
        {
            success = true,
            data = items,
            pagination = new
            {
                page,
                pageSize,
                totalCount,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            }
        });
    }

    // ───────────────────────────────────────────────
    // PATCH /api/users/{id}/status
    // ───────────────────────────────────────────────

    /// <summary>
    /// Warn, suspend, or reactivate a user. Admin only.
    /// Valid status values: 'active', 'warned', 'suspended'.
    /// </summary>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UserStatusUpdateRequest request)
    {
        var success = await _userService.UpdateUserStatusAsync(id, request.Status);
        if (!success)
            return NotFound(new { success = false, message = "User not found" });

        return Ok(new { success = true });
    }
}
