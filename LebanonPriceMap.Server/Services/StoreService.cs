using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
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
    public async Task<List<StoreResponse>> GetAllAsync(string? city, bool includeAll = false)
    {
        // 1. Start with all stores
        var query = _db.Stores.AsQueryable();

        // 2. Filter by city if provided (e.g., ?city=Beirut)
        if (!string.IsNullOrEmpty(city))
        {
            query = query.Where(s => s.City == city);
        }

        // 3. Only return active/verified stores (not pending or suspended) — UNLESS includeAll
        if (!includeAll)
        {
            query = query.Where(s => s.Status == "active" || s.Status == "verified");
        }

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

    /// <summary>
    /// Returns the store owned by the specified user.
    /// </summary>
    public async Task<StoreResponse?> GetByOwnerAsync(Guid ownerId)
    {
        var store = await _db.Stores.FirstOrDefaultAsync(s => s.OwnerUserId == ownerId);
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

    public async Task<StoreResponse> CreateForOwnerAsync(Guid ownerId, CreateMyStoreRequest request)
    {
        var store = new Store
        {
            Id = Guid.NewGuid(),
            OwnerUserId = ownerId,
            Name = request.Name.Trim(),
            Chain = string.IsNullOrWhiteSpace(request.Chain) ? null : request.Chain.Trim(),
            City = request.City.Trim(),
            District = request.District?.Trim(),
            Region = request.Region?.Trim(),
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Status = "pending",  // admin must approve
            TrustScore = 50,
            IsVerifiedRetailer = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Stores.Add(store);
        await _db.SaveChangesAsync();

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
            OwnerId = ownerId.ToString(),
            TrustScore = store.TrustScore,
            Status = store.Status,
            PowerStatus = store.PowerStatus
        };
    }

    public async Task<bool> UpdateStoreAsync(Guid id, StoreUpdateRequest request)
    {
        var store = await _db.Stores.FindAsync(id);
        if (store == null) return false;

        store.Name = request.Name;
        store.Chain = request.Chain;
        store.City = request.City;
        store.District = request.District;
        store.Region = request.Region;
        store.Latitude = request.Latitude;
        store.Longitude = request.Longitude;
        store.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdatePowerStatusAsync(Guid id, string powerStatus)
    {
        var store = await _db.Stores.FindAsync(id);
        if (store == null) return false;

        store.PowerStatus = powerStatus;
        store.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateStoreStatusAsync(Guid id, string status)
    {
        var store = await _db.Stores.FindAsync(id);
        if (store == null) return false;

        store.Status = status;
        store.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<ApiKeyResponse>> GetApiKeysAsync(Guid ownerId)
    {
        var store = await _db.Stores.FirstOrDefaultAsync(s => s.OwnerUserId == ownerId);
        if (store == null) return new List<ApiKeyResponse>();

        return await _db.StoreApiKeys
            .Where(k => k.StoreId == store.Id && k.IsActive)
            .OrderByDescending(k => k.CreatedAt)
            .Select(k => new ApiKeyResponse
            {
                Id = k.Id.ToString(),
                KeyLabel = k.KeyLabel ?? "Default",
                IsActive = k.IsActive,
                CreatedAt = k.CreatedAt,
                LastUsedAt = k.LastUsedAt,
                RevokedAt = k.RevokedAt
            })
            .ToListAsync();
    }

    public async Task<ApiKeyResponse> CreateApiKeyAsync(Guid ownerId, string label)
    {
        var store = await _db.Stores.FirstOrDefaultAsync(s => s.OwnerUserId == ownerId);
        if (store == null) throw new InvalidOperationException("Store not found");

        // Generate a secure random key
        var rawBytes = new byte[32];
        System.Security.Cryptography.RandomNumberGenerator.Fill(rawBytes);
        var plainKey = "rk_live_" + Convert.ToBase64String(rawBytes).Replace("+", "").Replace("/", "").Replace("=", "")[..32];
        var keyHash = Convert.ToBase64String(
            System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(plainKey)));

        var apiKey = new StoreApiKey
        {
            Id = Guid.NewGuid(),
            StoreId = store.Id,
            ApiKeyHash = keyHash,
            KeyLabel = label,
            IsActive = true,
            CreatedBy = ownerId,
            CreatedAt = DateTime.UtcNow
        };

        _db.StoreApiKeys.Add(apiKey);
        await _db.SaveChangesAsync();

        return new ApiKeyResponse
        {
            Id = apiKey.Id.ToString(),
            KeyLabel = apiKey.KeyLabel ?? "Default",
            IsActive = true,
            CreatedAt = apiKey.CreatedAt,
            PlainKey = plainKey  // returned once only
        };
    }

    public async Task<bool> RevokeApiKeyAsync(Guid keyId, Guid ownerId)
    {
        var store = await _db.Stores.FirstOrDefaultAsync(s => s.OwnerUserId == ownerId);
        if (store == null) return false;

        var key = await _db.StoreApiKeys.FirstOrDefaultAsync(k => k.Id == keyId && k.StoreId == store.Id);
        if (key == null) return false;

        key.IsActive = false;
        key.RevokedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<SyncRunResponse>> GetSyncRunsAsync(Guid ownerId)
    {
        var store = await _db.Stores.FirstOrDefaultAsync(s => s.OwnerUserId == ownerId);
        if (store == null) return new List<SyncRunResponse>();

        return await _db.StoreSyncRuns
            .Where(r => r.StoreId == store.Id)
            .OrderByDescending(r => r.StartedAt)
            .Take(20)
            .Select(r => new SyncRunResponse
            {
                Id = r.Id.ToString(),
                Method = r.Method,
                Status = r.Status,
                RecordsReceived = r.RecordsReceived,
                RecordsProcessed = r.RecordsProcessed,
                RecordsFailed = r.RecordsFailed,
                Message = r.Message,
                StartedAt = r.StartedAt,
                FinishedAt = r.FinishedAt
            })
            .ToListAsync();
    }
}
