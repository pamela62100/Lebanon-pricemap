using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
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
        var activeStores = await _db.Stores.CountAsync(s => s.Status == "active" || s.Status == "verified");
        var pendingReports = await _db.CatalogDiscrepancyReports.CountAsync(r => r.Status == "pending");

        return new AdminStatsResponse
        {
            TotalUsers = totalUsers,
            TotalUploads = totalUploads,
            ActiveStores = activeStores,
            PendingReports = pendingReports
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

}
