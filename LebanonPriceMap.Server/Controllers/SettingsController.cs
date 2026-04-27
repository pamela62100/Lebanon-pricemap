using LebanonPriceMap.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
[Route("api/settings")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SettingsController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/settings/exchange-rate
    /// Returns the LBP/USD exchange rate stored in system_settings.
    /// Falls back to 89500 if the row doesn't exist yet.
    /// </summary>
    [HttpGet("exchange-rate")]
    public async Task<IActionResult> GetExchangeRate()
    {
        var setting = await _db.SystemSettings
            .FirstOrDefaultAsync(s => s.Key == "exchange_rate_lbp_usd");

        var rate = decimal.TryParse(setting?.Value, out var parsed) ? parsed : 89500m;

        return Ok(new
        {
            success = true,
            data = new
            {
                rate,
                source = setting != null ? "database" : "default",
                updatedAt = setting?.UpdatedAt
            }
        });
    }

    /// <summary>
    /// PUT /api/settings/exchange-rate
    /// Admin can update the stored exchange rate.
    /// </summary>
    [HttpPut("exchange-rate")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "admin")]
    public async Task<IActionResult> SetExchangeRate([FromBody] SetExchangeRateRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        var adminId = Guid.Parse(userIdClaim.Value);

        var setting = await _db.SystemSettings
            .FirstOrDefaultAsync(s => s.Key == "exchange_rate_lbp_usd");

        if (setting == null)
        {
            _db.SystemSettings.Add(new Models.SystemSetting
            {
                Id = Guid.NewGuid(),
                Key = "exchange_rate_lbp_usd",
                Value = request.Rate.ToString(),
                Description = "LBP per 1 USD exchange rate",
                UpdatedBy = adminId,
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            });
        }
        else
        {
            setting.Value = request.Rate.ToString();
            setting.UpdatedBy = adminId;
            setting.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }
}

public class SetExchangeRateRequest
{
    public decimal Rate { get; set; }
}
