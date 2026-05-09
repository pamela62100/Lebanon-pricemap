using LebanonPriceMap.Server.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace LebanonPriceMap.Server.Services;

/// <summary>
/// Thin wrapper over IHubContext so domain services don't depend directly on SignalR.
/// All broadcasts swallow exceptions — a failed push must never break the request that triggered it.
/// </summary>
public class LiveBroadcaster
{
    private readonly IHubContext<LiveHub, ILiveClient> _hub;
    private readonly ILogger<LiveBroadcaster> _logger;

    public LiveBroadcaster(IHubContext<LiveHub, ILiveClient> hub, ILogger<LiveBroadcaster> logger)
    {
        _hub = hub;
        _logger = logger;
    }

    private async Task SafeAsync(Func<Task> action, string label)
    {
        try { await action(); }
        catch (Exception ex) { _logger.LogWarning(ex, "Live broadcast '{Label}' failed", label); }
    }

    // ── Notifications ────────────────────────────────────────────────────────
    public Task NotifyUser(Guid userId, object notification) =>
        SafeAsync(() => _hub.Clients.Group($"user-{userId}").NotificationCreated(notification),
                  "NotifyUser");

    // ── Discrepancy reports ─────────────────────────────────────────────────
    public Task ReportSubmitted(object report) =>
        SafeAsync(() => _hub.Clients.Group("admins").DiscrepancyReportCreated(report),
                  "ReportSubmitted");

    public Task ReportResolved(Guid storeId, object payload) =>
        SafeAsync(async () => {
            await _hub.Clients.Group("admins").DiscrepancyReportResolved(payload);
            await _hub.Clients.Group($"store-{storeId}").DiscrepancyReportResolved(payload);
        }, "ReportResolved");

    // ── Catalog ─────────────────────────────────────────────────────────────
    public Task CatalogChanged(Guid storeId, Guid productId, object payload) =>
        SafeAsync(async () => {
            await _hub.Clients.Group($"store-{storeId}").CatalogItemChanged(payload);
            await _hub.Clients.Group($"product-{productId}").CatalogItemChanged(payload);
        }, "CatalogChanged");

    // ── Sync runs (replaces SyncStatusCard polling) ─────────────────────────
    public Task SyncRunUpdated(Guid storeId, object run) =>
        SafeAsync(() => _hub.Clients.Group($"store-{storeId}").SyncRunUpdated(run),
                  "SyncRunUpdated");

    // ── Price vote / change (shopper detail page) ──────────────────────────
    public Task PriceVoted(Guid productId, object payload) =>
        SafeAsync(() => _hub.Clients.Group($"product-{productId}").PriceVoted(payload),
                  "PriceVoted");

    public Task PriceChanged(Guid productId, object payload) =>
        SafeAsync(() => _hub.Clients.Group($"product-{productId}").PriceChanged(payload),
                  "PriceChanged");
}
