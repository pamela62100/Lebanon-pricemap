using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

public class AlertService
{
    private readonly AppDbContext _db;
    private readonly LiveBroadcaster _live;

    public AlertService(AppDbContext db, LiveBroadcaster live)
    {
        _db = db;
        _live = live;
    }

    public async Task<AlertResponse> CreateAlertAsync(CreateAlertRequest request, Guid userId)
    {
        var alert = new Alert
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ProductId = request.ProductId,
            TargetPriceLbp = request.TargetPriceLbp,
            VerifiedOnly = request.VerifiedOnly,
            Status = AlertStatus.active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Alerts.Add(alert);
        await _db.SaveChangesAsync();

        var product = await _db.Products.FindAsync(request.ProductId);

        // Check if the price is already below the threshold right now
        var currentBestPrice = await _db.CurrentStoreProductPrices
            .Where(p => p.ProductId == request.ProductId && (!request.VerifiedOnly || p.IsVerified))
            .MinAsync(p => (decimal?)p.CurrentPriceLbp);

        var response = MapToResponse(alert, product?.Name);
        response.AlreadyBelowThreshold = currentBestPrice.HasValue && currentBestPrice.Value <= request.TargetPriceLbp;
        response.CurrentBestPriceLbp = currentBestPrice;
        return response;
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

    public async Task<int> CheckAlertsForPriceDropAsync(Guid productId, decimal newPrice, Guid storeId)
    {
        var triggeredAlerts = await _db.Alerts
            .Where(a => a.ProductId == productId && a.Status == AlertStatus.active && newPrice <= a.TargetPriceLbp)
            .Include(a => a.Product)
            .ToListAsync();

        if (!triggeredAlerts.Any()) return 0;

        var store = await _db.Stores.FindAsync(storeId);

        var pushPayloads = new List<(Guid userId, object payload)>();
        foreach (var alert in triggeredAlerts)
        {
            var productName = alert.Product?.Name ?? "a product";
            var storeName = store?.Name ?? "a store";

            var notif = new Notification
            {
                Id = Guid.NewGuid(),
                UserId = alert.UserId,
                Type = "price_alert",
                Title = $"Price drop: {productName}",
                Message = $"{productName} is now {newPrice:N0} LBP at {storeName} — below your alert of {alert.TargetPriceLbp:N0} LBP.",
                RelatedProductId = productId,
                RelatedStoreId = storeId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            _db.Notifications.Add(notif);

            pushPayloads.Add((alert.UserId, new {
                id = notif.Id, type = notif.Type,
                title = notif.Title, message = notif.Message,
                createdAt = notif.CreatedAt, isRead = false
            }));

            alert.Status = AlertStatus.triggered;
            alert.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        // Broadcast after the DB commit so the client sees a consistent state
        foreach (var (userId, payload) in pushPayloads)
            await _live.NotifyUser(userId, payload);

        return triggeredAlerts.Count;
    }

    private static AlertResponse MapToResponse(Alert alert, string? productName) => new()
    {
        Id = alert.Id,
        ProductId = alert.ProductId,
        ProductName = productName,
        TargetPriceLbp = alert.TargetPriceLbp,
        Active = alert.Status == AlertStatus.active,
        VerifiedOnly = alert.VerifiedOnly,
        CreatedAt = alert.CreatedAt
    };
}