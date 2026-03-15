using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

/// <summary>
/// Service that handles all Store-related business logic.
/// </summary>
public class StoreService
{
    private readonly AppDbContext _db;

    public StoreService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Returns all active stores, optionally filtered by city.
    /// </summary>
    public async Task<List<StoreResponse>> GetAllAsync(string? city)
    {
        // 1. Start with all stores
        var query = _db.Stores.AsQueryable();

        // 2. Filter by city if provided (e.g., ?city=Beirut)
        if (!string.IsNullOrEmpty(city))
        {
            query = query.Where(s => s.City == city);
        }

        // 3. Only return active/verified stores (not pending or suspended)
        query = query.Where(s => s.Status == "active" || s.Status == "verified");

        // 4. Order alphabetically
        query = query.OrderBy(s => s.Name);

        // 5. Map each Store entity to a StoreResponse DTO
        var results = await query
            .Select(s => new StoreResponse
            {
                Id = s.Id.ToString(),
                Name = s.Name,
                Chain = s.Chain,
                City = s.City,
                District = s.District,
                Region = s.Region,
                Latitude = s.Latitude,
                Longitude = s.Longitude,
                IsVerifiedRetailer = s.IsVerifiedRetailer,
                OwnerId = s.OwnerUserId.HasValue ? s.OwnerUserId.Value.ToString() : null,
                TrustScore = s.TrustScore,
                Status = s.Status,
                InternalRateLbp = s.InternalRateLbp,
                PowerStatus = s.PowerStatus,
                LogoUrl = s.LogoUrl
            })
            .ToListAsync();

        return results;
    }

    /// <summary>
    /// Returns a single store by its ID.
    /// </summary>
    public async Task<StoreResponse?> GetByIdAsync(string id)
    {
        if (!Guid.TryParse(id, out var guid)) return null;

        var store = await _db.Stores.FirstOrDefaultAsync(s => s.Id == guid);
        if (store == null) return null;

        return new StoreResponse
        {
            Id = store.Id.ToString(),
            Name = store.Name,
            Chain = store.Chain,
            City = store.City,
            District = store.District,
            Region = store.Region,
            Latitude = store.Latitude,
            Longitude = store.Longitude,
            IsVerifiedRetailer = store.IsVerifiedRetailer,
            OwnerId = store.OwnerUserId?.ToString(),
            TrustScore = store.TrustScore,
            Status = store.Status,
            InternalRateLbp = store.InternalRateLbp,
            PowerStatus = store.PowerStatus,
            LogoUrl = store.LogoUrl
        };
    }
}
