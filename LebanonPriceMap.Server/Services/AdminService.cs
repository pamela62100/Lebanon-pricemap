using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

public class AdminService
{
    private readonly AppDbContext _db;

    public AdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AdminStatsResponse> GetStatsAsync()
    {
        var totalUsers = await _db.Users.CountAsync();
        var totalUploads = await _db.PriceSubmissions.CountAsync();
        var flaggedEntries = await _db.PriceSubmissions.CountAsync(p => p.SubmissionStatus == "flagged");
        var activeStores = await _db.Stores.CountAsync(s => s.Status == "active");

        return new AdminStatsResponse
        {
            TotalUsers = totalUsers,
            TotalUploads = totalUploads,
            FlaggedEntries = flaggedEntries,
            ActiveStores = activeStores
        };
    }

    public async Task<List<AdminUserResponse>> GetAllUsersAsync(string? search, string? role)
    {
        var query = _db.Users.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            var s = search.ToLower();
            query = query.Where(u => u.Name!.ToLower().Contains(s) || u.Email.ToLower().Contains(s));
        }

        if (!string.IsNullOrEmpty(role) && role != "all")
            query = query.Where(u => u.Role == role);

        return await query
            .OrderByDescending(u => u.JoinedAt)
            .Select(u => new AdminUserResponse
            {
                Id = u.Id.ToString(),
                Name = u.Name ?? "",
                Email = u.Email,
                Role = u.Role,
                Status = u.Status,
                City = u.City,
                AvatarInitials = u.AvatarInitials,
                TrustScore = u.TrustScore,
                TrustLevel = u.TrustLevel,
                UploadCount = u.UploadCount,
                VerifiedCount = u.VerifiedCount,
                JoinedAt = u.JoinedAt
            })
            .ToListAsync();
    }

    public async Task<List<AdminAuditLogResponse>> GetAuditLogsAsync()
    {
        return await _db.AdminAuditLogs
            .Include(l => l.PerformedByUser)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new AdminAuditLogResponse
            {
                Id = l.Id.ToString(),
                Action = l.Action,
                PerformedByName = l.PerformedByUser != null ? l.PerformedByUser.Name : "System",
                TargetUserId = l.TargetUserId.HasValue ? l.TargetUserId.Value.ToString() : null,
                TargetProductId = l.TargetProductId.HasValue ? l.TargetProductId.Value.ToString() : null,
                TargetPriceEntryId = l.TargetPriceEntryId.HasValue ? l.TargetPriceEntryId.Value.ToString() : null,
                Note = l.Note,
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<List<AnomalyResponse>> GetAnomaliesAsync(string? status)
    {
        var query = _db.PriceAnomalies
            .Include(a => a.Store)
            .Include(a => a.Product)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(a => a.Status == status);

        return await query
            .OrderByDescending(a => a.DetectedAt)
            .Select(a => new AnomalyResponse
            {
                Id = a.Id.ToString(),
                StoreId = a.StoreId.ToString(),
                StoreName = a.Store != null ? a.Store.Name : "",
                ProductId = a.ProductId.ToString(),
                ProductName = a.Product != null ? a.Product.Name : "",
                OldPriceLbp = a.OldPriceLbp,
                NewPriceLbp = a.NewPriceLbp,
                ChangePercent = a.ChangePercent,
                Severity = a.Severity,
                Status = a.Status,
                DetectedAt = a.DetectedAt
            })
            .ToListAsync();
    }

    public async Task<List<OnboardingApplicationResponse>> GetOnboardingApplicationsAsync(string? status)
    {
        var query = _db.RetailerOnboardingApplications.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(a => a.Status == status);

        return await query
            .OrderByDescending(a => a.AppliedAt)
            .Select(a => new OnboardingApplicationResponse
            {
                Id = a.Id.ToString(),
                ContactName = a.ContactName,
                Email = a.Email,
                Phone = a.Phone,
                ProposedStoreName = a.ProposedStoreName,
                City = a.City,
                District = a.District,
                CurrentStep = a.CurrentStep,
                TotalSteps = a.TotalSteps,
                Status = a.Status,
                AdminNotes = a.AdminNotes,
                AppliedAt = a.AppliedAt,
                ReviewedAt = a.ReviewedAt
            })
            .ToListAsync();
    }

    public async Task<bool> UpdateOnboardingStepAsync(Guid id, UpdateOnboardingStepRequest request, Guid adminId)
    {
        var app = await _db.RetailerOnboardingApplications.FindAsync(id);
        if (app == null) return false;

        app.CurrentStep = request.Step;
        if (request.AdminNotes != null) app.AdminNotes = request.AdminNotes;
        if (request.Status != null) app.Status = request.Status;
        app.ReviewedAt = DateTime.UtcNow;
        app.ReviewedBy = adminId;
        app.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }
}
