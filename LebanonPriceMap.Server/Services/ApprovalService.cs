using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

public class ApprovalService
{
    private readonly AppDbContext _db;

    public ApprovalService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<ApprovalRequestResponse>> GetAllAsync(string? status)
    {
        var query = _db.ApprovalRequests.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(r => r.Status == status);

        return await query
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ApprovalRequestResponse
            {
                Id = r.Id.ToString(),
                RequestedBy = r.RequestedBy.ToString(),
                ReviewedBy = r.ReviewedBy.HasValue ? r.ReviewedBy.Value.ToString() : null,
                Action = r.Action,
                Label = r.Label,
                Payload = r.Payload,
                Status = r.Status,
                ReviewNote = r.ReviewNote,
                CreatedAt = r.CreatedAt,
                ResolvedAt = r.ResolvedAt
            })
            .ToListAsync();
    }

    public async Task<ApprovalRequestResponse> CreateAsync(CreateApprovalRequest request, Guid requestedBy)
    {
        var approval = new ApprovalRequest
        {
            Id = Guid.NewGuid(),
            RequestedBy = requestedBy,
            Action = request.Action,
            Label = request.Label,
            Payload = request.Payload,
            Status = "pending",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.ApprovalRequests.Add(approval);
        await _db.SaveChangesAsync();

        return new ApprovalRequestResponse
        {
            Id = approval.Id.ToString(),
            RequestedBy = approval.RequestedBy.ToString(),
            Action = approval.Action,
            Label = approval.Label,
            Payload = approval.Payload,
            Status = approval.Status,
            CreatedAt = approval.CreatedAt
        };
    }

    public async Task<bool> ApproveAsync(Guid id, Guid adminId, string? note)
    {
        var approval = await _db.ApprovalRequests.FindAsync(id);
        if (approval == null) return false;

        approval.Status = "approved";
        approval.ReviewedBy = adminId;
        approval.ReviewNote = note;
        approval.ResolvedAt = DateTime.UtcNow;
        approval.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RejectAsync(Guid id, Guid adminId, string? note)
    {
        var approval = await _db.ApprovalRequests.FindAsync(id);
        if (approval == null) return false;

        approval.Status = "rejected";
        approval.ReviewedBy = adminId;
        approval.ReviewNote = note;
        approval.ResolvedAt = DateTime.UtcNow;
        approval.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<int> GetPendingCountAsync()
    {
        return await _db.ApprovalRequests.CountAsync(r => r.Status == "pending");
    }
}
