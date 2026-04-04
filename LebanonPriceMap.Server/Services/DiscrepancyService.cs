using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

public class DiscrepancyService
{
    private readonly AppDbContext _context;

    public DiscrepancyService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Submit a discrepancy report with 500m geo-validation.
    /// AR-05: Users must be physically near the store to report.
    /// </summary>
    public async Task<CatalogDiscrepancyReport> SubmitReportAsync(DiscrepancySubmissionRequest request, Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);

        // AR-05: Geo-validation — reporter must be within 500m of the store
        if (request.ReporterLatitude.HasValue && request.ReporterLongitude.HasValue)
        {
            var store = await _context.Stores.FindAsync(request.StoreId);
            if (store?.Latitude != null && store?.Longitude != null)
            {
                var distance = CalculateHaversineDistance(
                    (double)request.ReporterLatitude.Value,
                    (double)request.ReporterLongitude.Value,
                    (double)store.Latitude.Value,
                    (double)store.Longitude.Value
                );

                if (distance > 500)
                {
                    throw new InvalidOperationException(
                        $"You must be within 500 meters of the store to submit a report. Current distance: {distance:F0}m."
                    );
                }
            }
        }

        var report = new CatalogDiscrepancyReport
        {
            Id = Guid.NewGuid(),
            CatalogItemId = request.CatalogItemId,
            StoreId = request.StoreId,
            ProductId = request.ProductId,
            ReportedBy = userId,
            ReporterTrustScore = (short?)user?.TrustScore,
            ReportType = request.ReportType,
            ObservedPriceLbp = request.ObservedPriceLbp,
            Note = request.Note,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.CatalogDiscrepancyReports.Add(report);
        await _context.SaveChangesAsync();

        return report;
    }

    public async Task<List<CatalogDiscrepancyReport>> GetPendingReportsAsync()
    {
        return await _context.CatalogDiscrepancyReports
            .Include(r => r.Product)
            .Include(r => r.Store)
            .Where(r => r.Status == "pending")
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<CatalogDiscrepancyReport>> GetReportsByStoreAsync(Guid storeId)
    {
        return await _context.CatalogDiscrepancyReports
            .Include(r => r.Product)
            .Where(r => r.StoreId == storeId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Approve a discrepancy report.
    /// BUG-01 Fix: Capture previousPriceLbp BEFORE updating the catalog item.
    /// BUG-03 Fix: Standardize Reason string to "discrepancy_approved".
    /// </summary>
    public async Task<bool> ApproveReportAsync(Guid reportId, Guid adminId, decimal? approvedPrice, string reviewNote)
    {
        var report = await _context.CatalogDiscrepancyReports.FindAsync(reportId);
        if (report == null) return false;

        report.Status = "approved";
        report.ResolvedAt = DateTime.UtcNow;
        report.ReviewedBy = adminId;
        report.ReviewNote = reviewNote;
        report.ApprovedNewPriceLbp = approvedPrice;

        // Update the catalog item price if a new price is approved
        if (approvedPrice.HasValue)
        {
            var catalogItem = await _context.StoreCatalogItems.FindAsync(report.CatalogItemId);
            if (catalogItem != null)
            {
                // BUG-01 FIX: Capture the OLD price BEFORE updating
                var previousPrice = catalogItem.OfficialPriceLbp;

                catalogItem.OfficialPriceLbp = approvedPrice.Value;
                catalogItem.LastUpdatedAt = DateTime.UtcNow;
                catalogItem.LastUpdatedBy = adminId;

                // Also update the current_store_product_prices materialized view
                var currentPrice = await _context.CurrentStoreProductPrices
                    .FirstOrDefaultAsync(p => p.StoreId == catalogItem.StoreId && p.ProductId == catalogItem.ProductId);
                if (currentPrice != null)
                {
                    currentPrice.CurrentPriceLbp = approvedPrice.Value;
                    currentPrice.IsVerified = true;
                    currentPrice.UpdatedAt = DateTime.UtcNow;
                }

                // Add to audit trail with correct previous price and standardized reason
                _context.CatalogAuditEntries.Add(new CatalogAuditEntry
                {
                    Id = Guid.NewGuid(),
                    CatalogItemId = catalogItem.Id,
                    StoreId = catalogItem.StoreId,
                    ProductId = catalogItem.ProductId,
                    ChangedBy = adminId,
                    Reason = "discrepancy_approved", // BUG-03 FIX: Standardized reason
                    RelatedReportId = report.Id,
                    PreviousPriceLbp = previousPrice, // BUG-01 FIX: Uses captured old price
                    NewPriceLbp = approvedPrice.Value,
                    Note = reviewNote,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        // Reward the reporter
        if (report.ReportedBy.HasValue)
        {
            var reporter = await _context.Users.FindAsync(report.ReportedBy.Value);
            if (reporter != null)
            {
                reporter.TrustScore = (short)Math.Min(100, reporter.TrustScore + 5);
                reporter.VerifiedCount++;
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RejectReportAsync(Guid reportId, Guid adminId, string reviewNote)
    {
        var report = await _context.CatalogDiscrepancyReports.FindAsync(reportId);
        if (report == null) return false;

        report.Status = "rejected";
        report.ResolvedAt = DateTime.UtcNow;
        report.ReviewedBy = adminId;
        report.ReviewNote = reviewNote;

        // Penalize the reporter
        if (report.ReportedBy.HasValue)
        {
            var reporter = await _context.Users.FindAsync(report.ReportedBy.Value);
            if (reporter != null)
            {
                reporter.TrustScore = (short)Math.Max(0, reporter.TrustScore - 10);
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Calculates the distance in meters between two GPS coordinates using the Haversine formula.
    /// </summary>
    private static double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371000; // Earth's radius in meters
        var dLat = DegreesToRadians(lat2 - lat1);
        var dLon = DegreesToRadians(lon2 - lon1);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }

    private static double DegreesToRadians(double degrees) => degrees * Math.PI / 180.0;
}
