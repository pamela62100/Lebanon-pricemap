using LebanonPriceMap.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
[Route("api/broadcasts")]
public class BroadcastsController : ControllerBase
{
    private readonly AppDbContext _db;

    public BroadcastsController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/broadcasts
    /// Returns active system broadcast messages for the ticker / notification bar.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetActive()
    {
        var now = DateTime.UtcNow;

        var broadcasts = await _db.SystemBroadcasts
            .Where(b => b.IsActive && b.StartsAt <= now && (b.EndsAt == null || b.EndsAt > now))
            .OrderByDescending(b => b.Priority)
            .ThenByDescending(b => b.CreatedAt)
            .Select(b => new
            {
                id = b.Id.ToString(),
                type = b.Type,
                message = b.Message,
                severity = b.Severity,
                priority = b.Priority,
                startsAt = b.StartsAt,
                endsAt = b.EndsAt
            })
            .ToListAsync();

        return Ok(new { success = true, data = broadcasts });
    }

    /// <summary>
    /// POST /api/broadcasts
    /// Admin creates a new broadcast message.
    /// </summary>
    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateBroadcastRequest request)
    {
        var broadcast = new Models.SystemBroadcast
        {
            Id = Guid.NewGuid(),
            Type = request.Type ?? "info",
            Message = request.Message,
            Severity = request.Severity ?? "medium",
            IsActive = true,
            StartsAt = request.StartsAt ?? DateTime.UtcNow,
            EndsAt = request.EndsAt,
            Priority = request.Priority,
            CreatedAt = DateTime.UtcNow
        };

        _db.SystemBroadcasts.Add(broadcast);
        await _db.SaveChangesAsync();
        return Ok(new { success = true, data = new { id = broadcast.Id.ToString() } });
    }
}

public class CreateBroadcastRequest
{
    public string? Type { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Severity { get; set; }
    public int Priority { get; set; }
    public DateTime? StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }
}
