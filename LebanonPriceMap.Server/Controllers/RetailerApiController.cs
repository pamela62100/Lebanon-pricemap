using LebanonPriceMap.Server.Attributes;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace LebanonPriceMap.Server.Controllers;

/// <summary>
/// External API for Retailer POS/Inventory systems.
/// Authentication: X-Api-Key header.
/// </summary>
[ApiController]
[Route("api/retailer/v1")]
[ApiKey]
public class RetailerApiController : ControllerBase
{
    private readonly PriceService _priceService;

    public RetailerApiController(PriceService priceService)
    {
        _priceService = priceService;
    }

    /// <summary>
    /// POST /api/retailer/v1/sync
    /// Pushes price updates from a POS system.
    /// </summary>
    [HttpPost("sync")]
    public async Task<IActionResult> SyncPrices([FromBody] BulkPriceSubmissionRequest request)
    {
        var storeId = (Guid)HttpContext.Items["StoreId"]!;
        
        // We'll use the store's owner as the 'SubmittedBy' for internal tracking
        // Or we can create a system user ID. For now, let's find the store owner.
        // Actually, PriceService.SubmitBulkPricesAsync handles everything.
        
        try
        {
            // We need a userId for the sync run record. 
            // Since this is an API call, we'll use a system-assigned owner ID or the store owner.
            // Let's get the store owner.
            var result = await _priceService.SubmitBulkPricesByStoreAsync(request, storeId);
            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}
