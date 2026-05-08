using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

public class DiscrepancyService
{
    private readonly AppDbContext _context;
    private readonly EmailService _email;

    public DiscrepancyService(AppDbContext context, EmailService email)
    {
        _context = context;
        _email = email;
    }

    private async Task NotifyReporterAsync(CatalogDiscrepancyReport report, string title, string message, string emailSubject, string emailBody)
    {
        if (!report.ReportedBy.HasValue) return;

        _context.Notifications.Add(new Notification
        {
            Id = Guid.NewGuid(),
            UserId = report.ReportedBy.Value,
            Type = "discrepancy_resolved",
            Title = title,
            Message = message,
            RelatedProductId = report.ProductId,
            RelatedStoreId = report.StoreId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        });

        var user = await _context.Users.FindAsync(report.ReportedBy.Value);
        if (user != null && !string.IsNullOrEmpty(user.Email))
        {
            await _email.SendAsync(user.Email, emailSubject, emailBody);
        }
    }

    public async Task<CatalogDiscrepancyReport?> SubmitReportAsync(DiscrepancySubmissionRequest request, Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);

        // Resolve catalog item — required FK
        var catalogItemId = request.CatalogItemId;
        if (!catalogItemId.HasValue || catalogItemId.Value == Guid.Empty)
        {
            var item = await _context.StoreCatalogItems
                .FirstOrDefaultAsync(c => c.StoreId == request.StoreId && c.ProductId == request.ProductId);
            if (item == null) return null;  // No catalog item to report against
            catalogItemId = item.Id;
        }

        var report = new CatalogDiscrepancyReport
        {
            Id = Guid.NewGuid(),
            CatalogItemId = catalogItemId.Value,
            StoreId = request.StoreId,
            ProductId = request.ProductId,
            ReportedBy = userId,
            ReporterTrustScore = (short?)user?.TrustScore,
            ReportType = request.ReportType,
            ObservedPriceLbp = request.ObservedPriceLbp,
            Note = request.Note ?? string.Empty,
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
            .Include(r => r.ReportedByUser)
            .Where(r => r.Status == "pending")
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<CatalogDiscrepancyReport>> GetReportsByStoreAsync(Guid storeId)
    {
        return await _context.CatalogDiscrepancyReports
            .Include(r => r.Product)
            .Include(r => r.ReportedByUser)
            .Where(r => r.StoreId == storeId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> ApproveReportAsync(Guid reportId, Guid adminId, decimal? approvedPrice, string reviewNote)
    {
        var report = await _context.CatalogDiscrepancyReports
            .Include(r => r.Store)
            .Include(r => r.Product)
            .FirstOrDefaultAsync(r => r.Id == reportId);
        if (report == null) return false;

        report.Status = "approved";
        report.ResolvedAt = DateTime.UtcNow;
        report.ReviewedBy = adminId;
        report.ReviewNote = reviewNote;
        report.ApprovedNewPriceLbp = approvedPrice;  // suggested price the admin recorded — retailer sees it as guidance

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

        // Notify the reporter (shopper)
        await NotifyReporterAsync(
            report,
            title: "Your report was approved",
            message: "Your discrepancy report was verified. The retailer has been asked to update their catalog. +5 trust score.",
            emailSubject: "Your WeinArkhass report was approved",
            emailBody:
                "<p>Good news!</p>" +
                "<p>Our team reviewed your discrepancy report and verified it. We've notified the retailer to update their listing. " +
                "You've earned <strong>+5 trust score</strong>.</p>" +
                "<p>Thank you for helping keep prices accurate.</p>" +
                "<p>— WeinArkhass</p>");

        // Notify the retailer who owns the store — they need to update their own catalog
        if (report.Store?.OwnerUserId.HasValue == true)
        {
            var ownerId = report.Store.OwnerUserId!.Value;
            var productName = report.Product?.Name ?? "a product";
            var observed = report.ObservedPriceLbp.HasValue
                ? $"Shopper observed: {report.ObservedPriceLbp.Value:N0} LBP. "
                : "";
            var suggested = approvedPrice.HasValue
                ? $"Admin suggested correction: {approvedPrice.Value:N0} LBP. "
                : "";

            _context.Notifications.Add(new Notification
            {
                Id = Guid.NewGuid(),
                UserId = ownerId,
                Type = "catalog_action_required",
                Title = "A discrepancy was reported on your catalog",
                Message = $"{productName}: a shopper report was verified by admin. {observed}{suggested}Please review and update your catalog.",
                RelatedProductId = report.ProductId,
                RelatedStoreId = report.StoreId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });

            var owner = await _context.Users.FindAsync(ownerId);
            if (owner != null && !string.IsNullOrEmpty(owner.Email))
            {
                await _email.SendAsync(
                    owner.Email,
                    "Action needed: discrepancy reported on your store",
                    $"<p>Hi {owner.Name},</p>" +
                    $"<p>A shopper reported a discrepancy on <strong>{productName}</strong> at your store, and our team verified the report.</p>" +
                    (string.IsNullOrEmpty(observed) ? "" : $"<p>{observed}</p>") +
                    (string.IsNullOrEmpty(suggested) ? "" : $"<p>{suggested}</p>") +
                    (string.IsNullOrWhiteSpace(reviewNote) ? "" : $"<p><em>Admin note: {reviewNote}</em></p>") +
                    "<p>Please review and update the price in your catalog if needed.</p>" +
                    "<p>— WeinArkhass</p>");
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

        var reasonNote = string.IsNullOrWhiteSpace(reviewNote) ? "" : $"<p><em>Admin note: {reviewNote}</em></p>";
        await NotifyReporterAsync(
            report,
            title: "Your report wasn't approved",
            message: "We reviewed your discrepancy report but couldn't verify it. Trust score adjusted." +
                     (string.IsNullOrWhiteSpace(reviewNote) ? "" : $" Note: {reviewNote}"),
            emailSubject: "Update on your WeinArkhass report",
            emailBody:
                "<p>Hi,</p>" +
                "<p>Our team reviewed your discrepancy report but couldn't verify the issue you reported. " +
                "Repeated unverified reports may affect your trust score.</p>" +
                reasonNote +
                "<p>If you believe this was a mistake, please feel free to submit again with more detail.</p>" +
                "<p>— WeinArkhass</p>");

        await _context.SaveChangesAsync();
        return true;
    }
}
