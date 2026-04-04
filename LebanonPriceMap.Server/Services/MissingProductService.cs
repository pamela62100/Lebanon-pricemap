using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

/// <summary>
/// Service for missing-product requests.
/// Shoppers report products they cannot find in a store's catalog.
/// </summary>
public class MissingProductService
{
    private readonly AppDbContext _db;

    public MissingProductService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Submit a new missing-product request.
    /// </summary>
    public async Task<MissingProductResponse> SubmitAsync(MissingProductSubmitRequest request, Guid userId)
    {
        var user = await _db.Users.FindAsync(userId);

        var entity = new MissingProductRequest
        {
            Id = Guid.NewGuid(),
            StoreId = request.StoreId,
            ProductId = request.ProductId,
            ProductNameFreetext = request.ProductNameFreetext,
            RequestedBy = userId,
            RequesterTrustScore = (short?)user?.TrustScore,
            Note = request.Note,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        _db.MissingProductRequests.Add(entity);
        await _db.SaveChangesAsync();

        // Reload with navigation props
        var saved = await _db.MissingProductRequests
            .Include(m => m.Store)
            .Include(m => m.Product)
            .FirstAsync(m => m.Id == entity.Id);

        return MapToResponse(saved);
    }

    /// <summary>
    /// Get all pending requests (admin view).
    /// </summary>
    public async Task<List<MissingProductResponse>> GetPendingAsync()
    {
        return await _db.MissingProductRequests
            .Include(m => m.Store)
            .Include(m => m.Product)
            .Where(m => m.Status == "pending")
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => MapToResponse(m))
            .ToListAsync();
    }

    /// <summary>
    /// Get requests submitted by a specific user.
    /// </summary>
    public async Task<List<MissingProductResponse>> GetByUserAsync(Guid userId)
    {
        return await _db.MissingProductRequests
            .Include(m => m.Store)
            .Include(m => m.Product)
            .Where(m => m.RequestedBy == userId)
            .OrderByDescending(m => m.CreatedAt)
            .Select(m => MapToResponse(m))
            .ToListAsync();
    }

    /// <summary>
    /// Approve a missing product request (admin).
    /// </summary>
    public async Task<bool> ApproveAsync(Guid requestId, Guid adminId, string? reviewNote)
    {
        var entity = await _db.MissingProductRequests.FindAsync(requestId);
        if (entity == null) return false;

        entity.Status = "approved";
        entity.ReviewedBy = adminId;
        entity.ReviewNote = reviewNote;
        entity.ResolvedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Reject a missing product request (admin).
    /// </summary>
    public async Task<bool> RejectAsync(Guid requestId, Guid adminId, string? reviewNote)
    {
        var entity = await _db.MissingProductRequests.FindAsync(requestId);
        if (entity == null) return false;

        entity.Status = "rejected";
        entity.ReviewedBy = adminId;
        entity.ReviewNote = reviewNote;
        entity.ResolvedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    private static MissingProductResponse MapToResponse(MissingProductRequest m) => new()
    {
        Id = m.Id.ToString(),
        StoreId = m.StoreId.ToString(),
        StoreName = m.Store?.Name,
        ProductId = m.ProductId?.ToString(),
        ProductName = m.Product?.Name,
        ProductNameFreetext = m.ProductNameFreetext,
        RequestedBy = m.RequestedBy?.ToString(),
        RequesterTrustScore = m.RequesterTrustScore,
        Note = m.Note,
        Status = m.Status,
        ReviewNote = m.ReviewNote,
        CreatedAt = m.CreatedAt,
        ResolvedAt = m.ResolvedAt
    };
}
