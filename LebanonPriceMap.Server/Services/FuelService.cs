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

    private const string StationWord = "Station";
    private const string StationWordLower = "station";
    private const string FuelWord = "Fuel";
    private const string FuelWordLower = "fuel";
    private const string GasWord = "Gas";
    private const string GasWordLower = "gas";

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

        // Try active prices first; fall back to the most recent per fuel type
        var active = await _db.FuelPrices
            .Where(fp => fp.EffectiveTo == null || fp.EffectiveTo > now)
            .OrderBy(fp => fp.FuelType)
            .ToListAsync();

        var source = active.Count > 0
            ? active
            : await _db.FuelPrices
                .GroupBy(fp => fp.FuelType)
                .Select(g => g.OrderByDescending(fp => fp.EffectiveFrom).First())
                .ToListAsync();

        return source.Select(fp => new FuelPriceResponse
        {
            Id = fp.Id.ToString(),
            FuelType = fp.FuelType,
            OfficialPriceLbp = fp.OfficialPriceLbp,
            ReportedPriceLbp = fp.ReportedPriceLbp,
            EffectiveFrom = fp.EffectiveFrom,
            EffectiveTo = fp.EffectiveTo,
            Source = fp.Source
        }).ToList();
    }

    /// <summary>
    /// Returns gas stations (stores of the "fuel" chain) with their latest report.
    /// Optionally filtered by city.
    /// </summary>
    public async Task<List<StationResponse>> GetStationsAsync(string? city)
    {
        // Only include stores that are actually gas/fuel stations.
        // We filter by checking if the Chain or Name is associated with fuel stations.
        var query = _db.StationReports
            .Include(sr => sr.Store)
            .Where(sr => 
                (sr.Store.Chain != null && (
                    sr.Store.Chain.Contains(FuelWord) || sr.Store.Chain.Contains(FuelWordLower) ||
                    sr.Store.Chain.Contains(GasWord) || sr.Store.Chain.Contains(GasWordLower) ||
                    sr.Store.Chain.Contains(StationWord) || sr.Store.Chain.Contains(StationWordLower) ||
                    sr.Store.Chain.Contains("Medco") || sr.Store.Chain.Contains("medco") ||
                    sr.Store.Chain.Contains("IPT") || sr.Store.Chain.Contains("ipt") ||
                    sr.Store.Chain.Contains("Coral") || sr.Store.Chain.Contains("coral") ||
                    sr.Store.Chain.Contains("Total") || sr.Store.Chain.Contains("total") ||
                    sr.Store.Chain.Contains("Hypco") || sr.Store.Chain.Contains("hypco")
                )) ||
                sr.Store.Name.Contains(FuelWord) || sr.Store.Name.Contains(FuelWordLower) ||
                sr.Store.Name.Contains(StationWord) || sr.Store.Name.Contains(StationWordLower) ||
                sr.Store.Name.Contains(GasWord) || sr.Store.Name.Contains(GasWordLower)
            )
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
        if (store == null)
        {
            throw new KeyNotFoundException("Store not found");
        }

        // Enforce that the store is actually a fuel station to avoid rogue reports on grocery stores
        bool isFuelStation = (store.Chain != null && (
            store.Chain.Contains(FuelWord) || store.Chain.Contains(FuelWordLower) ||
            store.Chain.Contains(GasWord) || store.Chain.Contains(GasWordLower) ||
            store.Chain.Contains(StationWord) || store.Chain.Contains(StationWordLower) ||
            store.Chain.Contains("Medco") || store.Chain.Contains("medco") ||
            store.Chain.Contains("IPT") || store.Chain.Contains("ipt") ||
            store.Chain.Contains("Coral") || store.Chain.Contains("coral") ||
            store.Chain.Contains("Total") || store.Chain.Contains("total") ||
            store.Chain.Contains("Hypco") || store.Chain.Contains("hypco")
        )) || 
        store.Name.Contains(FuelWord) || store.Name.Contains(FuelWordLower) ||
        store.Name.Contains(StationWord) || store.Name.Contains(StationWordLower) ||
        store.Name.Contains(GasWord) || store.Name.Contains(GasWordLower);

        if (!isFuelStation)
        {
            throw new InvalidOperationException("Cannot submit fuel station reports for a regular retail or grocery store.");
        }

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
