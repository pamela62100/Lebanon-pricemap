using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Hubs;

/// <summary>
/// Strongly-typed client interface — every method here is something the server can
/// invoke on the client. Frontend listens by name (e.g. "NotificationCreated").
/// </summary>
public interface ILiveClient
{
    Task NotificationCreated(object notification);
    Task DiscrepancyReportCreated(object report);
    Task DiscrepancyReportResolved(object payload);
    Task CatalogItemChanged(object payload);
    Task SyncRunUpdated(object run);
    Task PriceVoted(object payload);
    Task PriceChanged(object payload);
}

/// <summary>
/// SignalR hub — single endpoint for all real-time events. Allows anonymous connections;
/// authenticated users are added to personal groups on connect.
///
/// Groups:
///   user-{userId}     → personal events (notifications, alerts)
///   store-{storeId}   → store-specific events (catalog edits, incoming reports)
///   product-{prodId}  → product-specific events (price/vote changes)
///   admins            → global admin events (new discrepancy reports)
/// </summary>
public class LiveHub : Hub<ILiveClient>
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
        }

        if (role == "admin")
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "admins");
        }

        await base.OnConnectedAsync();
    }

    /// <summary>Client opts in to events for a specific store (e.g. retailer dashboard).</summary>
    public Task JoinStore(string storeId)
        => Groups.AddToGroupAsync(Context.ConnectionId, $"store-{storeId}");

    public Task LeaveStore(string storeId)
        => Groups.RemoveFromGroupAsync(Context.ConnectionId, $"store-{storeId}");

    /// <summary>Client opts in to events for a specific product (shopper viewing detail page).</summary>
    public Task JoinProduct(string productId)
        => Groups.AddToGroupAsync(Context.ConnectionId, $"product-{productId}");

    public Task LeaveProduct(string productId)
        => Groups.RemoveFromGroupAsync(Context.ConnectionId, $"product-{productId}");
}
