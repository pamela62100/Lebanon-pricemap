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

    public async Task<CatalogDiscrepancyReport> SubmitReportAsync(DiscrepancySubmissionRequest request, Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        
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
                var previousPrice = catalogItem.OfficialPriceLbp;

                catalogItem.OfficialPriceLbp = approvedPrice.Value;
                catalogItem.LastUpdatedAt = DateTime.UtcNow;
                catalogItem.LastUpdatedBy = adminId;

                _context.CatalogAuditEntries.Add(new CatalogAuditEntry
                {
                    Id = Guid.NewGuid(),
                    CatalogItemId = catalogItem.Id,
                    StoreId = catalogItem.StoreId,
                    ProductId = catalogItem.ProductId,
                    ChangedBy = adminId,
                    Reason = "discrepancy_report",
                    RelatedReportId = report.Id,
                    PreviousPriceLbp = previousPrice,
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
}
