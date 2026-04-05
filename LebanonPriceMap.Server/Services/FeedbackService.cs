using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

<<<<<<< HEAD
/// <summary>
/// Service for price feedback (verify/report on a price entry).
/// </summary>
=======
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
public class FeedbackService
{
    private readonly AppDbContext _db;

    public FeedbackService(AppDbContext db)
    {
        _db = db;
    }

<<<<<<< HEAD
    /// <summary>
    /// Submit feedback on a price entry.
    /// </summary>
    public async Task<FeedbackResponse> SubmitAsync(FeedbackSubmitRequest request, Guid userId)
    {
        var entity = new PriceFeedback
=======
    public async Task<List<FeedbackResponse>> GetAllAsync(string? status)
    {
        var query = _db.PriceFeedbacks.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(f => f.Status == status);

        return await query
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new FeedbackResponse
            {
                Id = f.Id.ToString(),
                PriceEntryId = f.PriceEntryId.ToString(),
                SubmittedBy = f.SubmittedBy.HasValue ? f.SubmittedBy.Value.ToString() : null,
                Type = f.Type,
                Note = f.Note,
                Status = f.Status,
                CreatedAt = f.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<FeedbackResponse> SubmitAsync(SubmitFeedbackRequest request, Guid? userId)
    {
        var feedback = new PriceFeedback
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
        {
            Id = Guid.NewGuid(),
            PriceEntryId = request.PriceEntryId,
            SubmittedBy = userId,
            Type = request.Type,
            Note = request.Note,
            Status = "open",
            CreatedAt = DateTime.UtcNow
        };

<<<<<<< HEAD
        _db.PriceFeedbacks.Add(entity);
        await _db.SaveChangesAsync();

        return MapToResponse(entity);
    }

    /// <summary>
    /// Get all feedback entries, optionally filtered by status.
    /// </summary>
    public async Task<List<FeedbackResponse>> GetAllAsync(string? status)
    {
        var query = _db.PriceFeedbacks.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(f => f.Status == status);

        return await query
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => MapToResponse(f))
            .ToListAsync();
    }

    /// <summary>
    /// Resolve (close) a feedback entry.
    /// </summary>
    public async Task<bool> ResolveAsync(Guid feedbackId)
    {
        var entity = await _db.PriceFeedbacks.FindAsync(feedbackId);
        if (entity == null) return false;

        entity.Status = "resolved";
        await _db.SaveChangesAsync();
        return true;
    }

    private static FeedbackResponse MapToResponse(PriceFeedback f) => new()
    {
        Id = f.Id.ToString(),
        PriceEntryId = f.PriceEntryId.ToString(),
        SubmittedBy = f.SubmittedBy?.ToString(),
        Type = f.Type,
        Note = f.Note,
        Status = f.Status,
        CreatedAt = f.CreatedAt
    };
=======
        _db.PriceFeedbacks.Add(feedback);
        await _db.SaveChangesAsync();

        return new FeedbackResponse
        {
            Id = feedback.Id.ToString(),
            PriceEntryId = feedback.PriceEntryId.ToString(),
            SubmittedBy = feedback.SubmittedBy?.ToString(),
            Type = feedback.Type,
            Note = feedback.Note,
            Status = feedback.Status,
            CreatedAt = feedback.CreatedAt
        };
    }

    public async Task<bool> ResolveAsync(Guid id)
    {
        var feedback = await _db.PriceFeedbacks.FindAsync(id);
        if (feedback == null) return false;

        feedback.Status = "resolved";
        await _db.SaveChangesAsync();
        return true;
    }
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
}
