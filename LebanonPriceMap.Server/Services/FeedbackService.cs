using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

public class FeedbackService
{
    private readonly AppDbContext _db;

    public FeedbackService(AppDbContext db)
    {
        _db = db;
    }

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
        {
            Id = Guid.NewGuid(),
            PriceEntryId = request.PriceEntryId,
            SubmittedBy = userId,
            Type = request.Type,
            Note = request.Note,
            Status = "open",
            CreatedAt = DateTime.UtcNow
        };

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
}
