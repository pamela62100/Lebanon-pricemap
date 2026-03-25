using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

public class AlertService
{
    private readonly AppDbContext _db;

    public AlertService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AlertResponse> CreateAlertAsync(CreateAlertRequest request, Guid userId)
    {
        var alert = new Alert
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ProductId = request.ProductId,
            TargetPriceLbp = request.TargetPriceLbp,
            VerifiedOnly = true,
            Status = AlertStatus.active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Alerts.Add(alert);
        await _db.SaveChangesAsync();

        var product = await _db.Products.FindAsync(request.ProductId);

        return MapToResponse(alert, product?.Name);
    }

    public async Task<List<AlertResponse>> GetUserAlertsAsync(Guid userId)
    {
        return await _db.Alerts
            .Where(a => a.UserId == userId && a.Status == AlertStatus.active)
            .Include(a => a.Product)
            .Select(a => MapToResponse(a, a.Product != null ? a.Product.Name : null))
            .ToListAsync();
    }

    public async Task<bool> DeleteAlertAsync(Guid alertId, Guid userId)
    {
        var alert = await _db.Alerts.FirstOrDefaultAsync(a => a.Id == alertId && a.UserId == userId);
        if (alert == null) return false;

        alert.Status = AlertStatus.deleted;
        alert.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    private static AlertResponse MapToResponse(Alert alert, string? productName) => new()
    {
        Id = alert.Id,
        ProductId = alert.ProductId,
        ProductName = productName,
        TargetPriceLbp = alert.TargetPriceLbp,
        IsActive = alert.Status == AlertStatus.active,
        CreatedAt = alert.CreatedAt
    };
}