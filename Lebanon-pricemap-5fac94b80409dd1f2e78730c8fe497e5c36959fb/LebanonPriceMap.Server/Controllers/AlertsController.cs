using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
[Route("api/alerts")]
[Authorize]
public class AlertsController : ControllerBase
{
    private readonly AlertService _alertService;

    public AlertsController(AlertService alertService)
    {
        _alertService = alertService;
    }

    // POST /api/alerts
    [HttpPost]
    public async Task<IActionResult> CreateAlert([FromBody] CreateAlertRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var result = await _alertService.CreateAlertAsync(request, userId.Value);
        return Ok(new { success = true, data = result });
    }

    // GET /api/alerts
    [HttpGet]
    public async Task<IActionResult> GetAlerts()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var results = await _alertService.GetUserAlertsAsync(userId.Value);
        return Ok(new { success = true, data = results });
    }

    // DELETE /api/alerts/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAlert(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var success = await _alertService.DeleteAlertAsync(id, userId.Value);
        if (!success) return NotFound(new { success = false, message = "Alert not found" });

        return Ok(new { success = true });
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? Guid.Parse(claim.Value) : null;
    }
}