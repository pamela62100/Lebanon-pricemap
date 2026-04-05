using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

/// <summary>
/// Controller for Fuel Tracking endpoints.
/// Base URL: /api/fuel
/// </summary>
[ApiController]
[Route("api/fuel")]
public class FuelController : ControllerBase
{
    private readonly FuelService _fuelService;

    public FuelController(FuelService fuelService)
    {
        _fuelService = fuelService;
    }

    /// <summary>
    /// GET /api/fuel
    /// Get current official nationwide fuel prices.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetPrices()
    {
        var prices = await _fuelService.GetCurrentPricesAsync();
        return Ok(new { success = true, data = prices });
    }

    /// <summary>
    /// GET /api/fuel/stations?city=Beirut
    /// Get physical gas stations and their live availability.
    /// </summary>
    [HttpGet("stations")]
    public async Task<IActionResult> GetStations([FromQuery] string? city)
    {
        var stations = await _fuelService.GetStationsAsync(city);
        return Ok(new { success = true, data = stations });
    }

    /// <summary>
    /// POST /api/fuel/stations/{id}/report
    /// Report a station's queue length or if it's out of fuel.
    /// </summary>
    [HttpPost("stations/{id}/report")]
    [Authorize]
    public async Task<IActionResult> ReportStation(Guid id, [FromBody] StationReportRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim.Value);
        var result = await _fuelService.ReportStationAsync(id, request, userId);
        return Ok(new { success = true, data = result });
    }
}
