using LebanonPriceMap.Server.Services;
using LebanonPriceMap.Server.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace LebanonPriceMap.Server.Controllers;

/// <summary>
/// Controller for Store-related endpoints.
/// Base URL: /api/stores
/// </summary>
[ApiController]
[Route("api/stores")]
public class StoresController : ControllerBase
{
    private readonly StoreService _storeService;

    public StoresController(StoreService storeService)
    {
        _storeService = storeService;
    }

    /// <summary>
    /// GET /api/stores?city=Beirut
    /// Returns all active stores, optionally filtered by city.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? city)
    {
        var stores = await _storeService.GetAllAsync(city);
        return Ok(new { success = true, data = stores });
    }

    /// <summary>
    /// GET /api/stores/{id}
    /// Returns details for a single store.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var store = await _storeService.GetByIdAsync(id);
        if (store == null) return NotFound(new { success = false, message = "Store not found" });
        return Ok(new { success = true, data = store });
    }

    /// <summary>
    /// GET /api/stores/mine
    /// Returns the store owned by the authenticated retailer.
    /// </summary>
    [HttpGet("mine")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Retailer,Admin")]
    public async Task<IActionResult> GetMine()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized();

        var store = await _storeService.GetByOwnerAsync(userId);
        if (store == null) return NotFound(new { success = false, message = "No store found for this account" });
        return Ok(new { success = true, data = store });
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Retailer,Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] StoreUpdateRequest request)
    {
        var success = await _storeService.UpdateStoreAsync(id, request);
        if (!success) return NotFound(new { success = false, message = "Store not found" });
        return Ok(new { success = true });
    }

    [HttpPatch("{id}/power")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Retailer,Admin")]
    public async Task<IActionResult> UpdatePower(Guid id, [FromBody] StorePowerStatusUpdateRequest request)
    {
        var success = await _storeService.UpdatePowerStatusAsync(id, request.PowerStatus);
        if (!success) return NotFound(new { success = false, message = "Store not found" });
        return Ok(new { success = true });
    }

    [HttpPatch("{id}/status")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] StoreStatusUpdateRequest request)
    {
        var success = await _storeService.UpdateStoreStatusAsync(id, request.Status);
        if (!success) return NotFound(new { success = false, message = "Store not found" });
        return Ok(new { success = true });
    }

    /// <summary>
    /// GET /api/stores/mine/api-keys
    /// Returns active API keys for the authenticated retailer's store.
    /// </summary>
    [HttpGet("mine/api-keys")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Retailer,Admin")]
    public async Task<IActionResult> GetApiKeys()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized();

        var keys = await _storeService.GetApiKeysAsync(userId);
        return Ok(new { success = true, data = keys });
    }

    /// <summary>
    /// POST /api/stores/mine/api-keys
    /// Generate a new API key for the authenticated retailer's store.
    /// </summary>
    [HttpPost("mine/api-keys")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Retailer,Admin")]
    public async Task<IActionResult> CreateApiKey([FromBody] CreateApiKeyRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized();

        var result = await _storeService.CreateApiKeyAsync(userId, request.KeyLabel);
        return Ok(new { success = true, data = result });
    }

    /// <summary>
    /// DELETE /api/stores/mine/api-keys/{keyId}
    /// Revoke an API key.
    /// </summary>
    [HttpDelete("mine/api-keys/{keyId}")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Retailer,Admin")]
    public async Task<IActionResult> RevokeApiKey(Guid keyId)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized();

        var success = await _storeService.RevokeApiKeyAsync(keyId, userId);
        if (!success) return NotFound(new { success = false, message = "API key not found" });
        return Ok(new { success = true });
    }

    /// <summary>
    /// GET /api/stores/mine/sync-runs
    /// Returns the recent sync run history for the authenticated retailer's store.
    /// </summary>
    [HttpGet("mine/sync-runs")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Retailer,Admin")]
    public async Task<IActionResult> GetSyncRuns()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized();

        var runs = await _storeService.GetSyncRunsAsync(userId);
        return Ok(new { success = true, data = runs });
    }
}
