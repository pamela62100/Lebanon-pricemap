using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

/// <summary>
/// Service that handles all User Management business logic.
/// Covers profile retrieval, self-update, notifications, and admin status changes.
/// </summary>
public class UserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db)
    {
        _db = db;
    }

    // ───────────────────────────────────────────────
    // GET /api/users/{id}  –  Admin or Self
    // ───────────────────────────────────────────────

    /// <summary>
    /// Returns a user's public profile, stats, and trust score.
    /// </summary>
    public async Task<UserProfileResponse?> GetProfileAsync(Guid id)
    {
        // Find the user by primary key
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

        // Map entity → response DTO
        return new UserProfileResponse
        {
            Id = user.Id.ToString(),
            Name = user.Name ?? "",
            AvatarInitials = user.AvatarInitials,
            Email = user.Email,
            Role = user.Role,
            Status = user.Status,
            City = user.City,
            TrustScore = user.TrustScore,
            TrustLevel = user.TrustLevel,
            UploadCount = user.UploadCount,
            VerifiedCount = user.VerifiedCount,
            JoinedAt = user.JoinedAt,
            LastLoginAt = user.LastLoginAt
        };
    }

    // ───────────────────────────────────────────────
    // PUT /api/users/{id}  –  Self only
    // ───────────────────────────────────────────────

    /// <summary>
    /// Update personal details (Name, avatar initials, default city).
    /// Only the user themselves should call this (enforced in the controller).
    /// </summary>
    public async Task<bool> UpdateProfileAsync(Guid id, UserUpdateRequest request)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return false;

        // Only overwrite fields that were actually provided
        if (request.Name != null)
            user.Name = request.Name;

        if (request.AvatarInitials != null)
            user.AvatarInitials = request.AvatarInitials;

        if (request.City != null)
            user.City = request.City;

        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    // ───────────────────────────────────────────────
    // GET /api/users/{id}/notifications  –  Self only
    // ───────────────────────────────────────────────

    /// <summary>
    /// Returns paginated notifications for a user, newest first.
    /// Supports ?page=1&pageSize=20 query parameters.
    /// </summary>
    public async Task<(List<NotificationResponse> Items, int TotalCount)> GetNotificationsAsync(
        Guid userId, int page, int pageSize)
    {
        // 1. Base query – only this user's notifications
        var query = _db.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt);

        // 2. Get total count (for frontend pagination controls)
        var totalCount = await query.CountAsync();

        // 3. Apply pagination (skip/take)
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(n => new NotificationResponse
            {
                Id = n.Id.ToString(),
                Type = n.Type,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                ReadAt = n.ReadAt,
                CreatedAt = n.CreatedAt,
                RelatedPriceEntryId = n.RelatedPriceEntryId.HasValue ? n.RelatedPriceEntryId.Value.ToString() : null,
                RelatedStoreId = n.RelatedStoreId.HasValue ? n.RelatedStoreId.Value.ToString() : null,
                RelatedProductId = n.RelatedProductId.HasValue ? n.RelatedProductId.Value.ToString() : null,
                RelatedAlertId = n.RelatedAlertId.HasValue ? n.RelatedAlertId.Value.ToString() : null
            })
            .ToListAsync();

        return (items, totalCount);
    }

    // ───────────────────────────────────────────────
    // PATCH /api/users/{id}/status  –  Admin only
    // ───────────────────────────────────────────────

    /// <summary>
    /// Allows an admin to change a user's status (ban, warn, suspend, or re-activate).
    /// Valid values: 'active', 'warned', 'suspended', 'banned'.
    /// </summary>
    public async Task<bool> UpdateUserStatusAsync(Guid id, string newStatus)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return false;

        user.Status = newStatus;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }
}
