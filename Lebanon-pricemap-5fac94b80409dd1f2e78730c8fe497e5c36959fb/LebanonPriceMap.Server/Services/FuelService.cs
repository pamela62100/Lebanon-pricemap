using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

/// <summary>
/// Service layer for Fuel Tracking endpoints.
/// Handles current fuel prices and gas-station reports.
/// </summary>
public class FuelService
{
    private readonly AppDbContext _db;

    public FuelService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Returns the current official nationwide fuel prices.
    /// "Current" = EffectiveTo is null or in the future.
    /// </summary>
    public async Task<List<FuelPriceResponse>> GetCurrentPricesAsync()
    {
        var now = DateTime.UtcNow;

        return await _db.FuelPrices
            .Where(fp => fp.EffectiveTo == null || fp.EffectiveTo > now)
            .OrderBy(fp => fp.FuelType)
            .Select(fp => new FuelPriceResponse
            {
                Id = fp.Id.ToString(),
                FuelType = fp.FuelType,
                OfficialPriceLbp = fp.OfficialPriceLbp,
                ReportedPriceLbp = fp.ReportedPriceLbp,
                EffectiveFrom = fp.EffectiveFrom,
                EffectiveTo = fp.EffectiveTo,
                Source = fp.Source
            })
            .ToListAsync();
    }

    /// <summary>
    /// Returns gas stations (stores of the "fuel" chain) with their latest report.
    /// Optionally filtered by city.
    /// </summary>
    public async Task<List<StationResponse>> GetStationsAsync(string? city)
    {
        // We treat any store as a potential fuel station.
        // Only include stores that have at least one station report.
        var query = _db.StationReports
            .Include(sr => sr.Store)
            .AsQueryable();

        if (!string.IsNullOrEmpty(city))
        {
            query = query.Where(sr => sr.Store.City == city);
        }

        // Get the latest report per store
        var latestReports = await query
            .GroupBy(sr => sr.StoreId)
            .Select(g => g.OrderByDescending(sr => sr.CreatedAt).First())
            .ToListAsync();

        return latestReports.Select(sr => new StationResponse
        {
            StoreId = sr.StoreId.ToString(),
            StoreName = sr.Store?.Name ?? "",
            City = sr.Store?.City,
            District = sr.Store?.District,
            Latitude = sr.Store?.Latitude,
            Longitude = sr.Store?.Longitude,
            PowerStatus = sr.Store?.PowerStatus,
            IsOpen = sr.IsOpen,
            HasStock = sr.HasStock,
            QueueMinutes = sr.QueueMinutes,
            QueueDepth = sr.QueueDepth,
            IsRationed = sr.IsRationed,
            LastReportedAt = sr.CreatedAt
        }).ToList();
    }

    /// <summary>
    /// Creates a new station report (queue length, stock, etc.) for a store.
    /// </summary>
    public async Task<StationResponse> ReportStationAsync(Guid storeId, StationReportRequest request, Guid userId)
    {
        var store = await _db.Stores.FindAsync(storeId);

        var report = new StationReport
        {
            Id = Guid.NewGuid(),
            StoreId = storeId,
            FuelType = request.FuelType,
            IsOpen = request.IsOpen,
            HasStock = request.HasStock,
            QueueMinutes = request.QueueMinutes,
            QueueDepth = request.QueueDepth,
            IsRationed = request.IsRationed,
            LimitAmountLbp = request.LimitAmountLbp,
            ReportedBy = userId,
            CreatedAt = DateTime.UtcNow
        };

        _db.StationReports.Add(report);
        await _db.SaveChangesAsync();

        return new StationResponse
        {
            StoreId = storeId.ToString(),
            StoreName = store?.Name ?? "",
            City = store?.City,
            District = store?.District,
            Latitude = store?.Latitude,
            Longitude = store?.Longitude,
            PowerStatus = store?.PowerStatus,
            IsOpen = report.IsOpen,
            HasStock = report.HasStock,
            QueueMinutes = report.QueueMinutes,
            QueueDepth = report.QueueDepth,
            IsRationed = report.IsRationed,
            LastReportedAt = report.CreatedAt
        };
    }
}
