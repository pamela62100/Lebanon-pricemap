using LebanonPriceMap.Server.Services;
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
}
