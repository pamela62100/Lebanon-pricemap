using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

public class DiscrepancyService
{
    private readonly AppDbContext _context;
    private readonly EmailService _email;
    private readonly LiveBroadcaster _live;

    public DiscrepancyService(AppDbContext context, EmailService email, LiveBroadcaster live)
    {
        _context = context;
        _email = email;
        _live = live;
    }

    private async Task NotifyReporterAsync(CatalogDiscrepancyReport report, string title, string message, string emailSubject, string emailBody)
    {
        if (!report.ReportedBy.HasValue) return;

        var notification = new Notification
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
        };
        _context.Notifications.Add(notification);

        var user = await _context.Users.FindAsync(report.ReportedBy.Value);
        if (user != null && !string.IsNullOrEmpty(user.Email))
        {
            await _email.SendAsync(user.Email, emailSubject, emailBody);
        }

        await _live.NotifyUser(report.ReportedBy.Value, new {
            id = notification.Id, type = notification.Type,
            title = notification.Title, message = notification.Message,
            createdAt = notification.CreatedAt, isRead = false
        });
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

        // Re-load with reporter info for the live payload
        var withReporter = await _context.CatalogDiscrepancyReports
            .Include(r => r.Product)
            .Include(r => r.ReportedByUser)
            .FirstAsync(r => r.Id == report.Id);

        await _live.ReportSubmitted(new {
            id = withReporter.Id,
            productId = withReporter.ProductId,
            storeId = withReporter.StoreId,
            reportType = withReporter.ReportType,
            observedPriceLbp = withReporter.ObservedPriceLbp,
            note = withReporter.Note,
            reporterTrustScore = withReporter.ReporterTrustScore,
            reportedByUser = withReporter.ReportedByUser == null ? null : new {
                id = withReporter.ReportedByUser.Id,
                name = withReporter.ReportedByUser.Name
            },
            product = withReporter.Product == null ? null : new {
                id = withReporter.Product.Id,
                name = withReporter.Product.Name
            },
            status = withReporter.Status,
            createdAt = withReporter.CreatedAt
        });

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

            var ownerNotif = new Notification
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
            };
            _context.Notifications.Add(ownerNotif);

            await _live.NotifyUser(ownerId, new {
                id = ownerNotif.Id, type = ownerNotif.Type,
                title = ownerNotif.Title, message = ownerNotif.Message,
                createdAt = ownerNotif.CreatedAt, isRead = false
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

        await _live.ReportResolved(report.StoreId, new {
            id = report.Id,
            status = "approved",
            storeId = report.StoreId,
            productId = report.ProductId
        });
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

        await _live.ReportResolved(report.StoreId, new {
            id = report.Id,
            status = "rejected",
            storeId = report.StoreId,
            productId = report.ProductId
        });
        return true;
    }
}
