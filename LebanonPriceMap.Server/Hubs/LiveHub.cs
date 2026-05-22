using Microsoft.AspNetCore.SignalR; //signalR library
using System.Security.Claims; //handles user identity , pieces of info 

namespace LebanonPriceMap.Server.Hubs;

//signalR hub, manages all websocket connections , everytime a browser opens a websocket connection to our site the hub handles it 
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
//interface, defines methods taht the server can call on the client


//Hub bqw3 class from SignalR,use their strongly typed interface
//creates  a hub where server calls client methods defined in ILiveClient
//compiler checks that we only call those methods
public class LiveHub : Hub<ILiveClient>
{
    public override async Task OnConnectedAsync() //when a browser connects and opens a websocket this method runs automatically for every new connection
    {
        var userId = Context.UserIdentifier; //Context contains info about the current connection
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
