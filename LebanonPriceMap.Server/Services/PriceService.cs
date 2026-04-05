using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

/// <summary>
/// This service handles all the logic for Prices.
/// It talks to the Context (Database) and maps the results to DTOs for the UI.
/// </summary>
public class PriceService
{
    private readonly AppDbContext _db;

    public PriceService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// This is the main logic for searching prices.
    /// It looks into the CurrentStoreProductPrices table and joins it with Product and Store.
    /// </summary>
    public async Task<List<PriceEntryResponse>> SearchAsync(PriceSearchRequest request)
    {
        // 1. We start with the queryable list of current prices
        var query = _db.CurrentStoreProductPrices.AsQueryable();

        // 2. Filter by Search Query (Product Name or Store Name)
        if (!string.IsNullOrEmpty(request.Query))
        {
            var search = request.Query.ToLower();
            query = query.Where(p => 
                p.Product.Name.ToLower().Contains(search) || 
                p.Store.Name.ToLower().Contains(search));
        }

        // 3. Filter by Category
        if (!string.IsNullOrEmpty(request.Category) && request.Category != "All")
        {
            query = query.Where(p => p.Product.Category.Name == request.Category);
        }

        // 4. Filter by City
        if (!string.IsNullOrEmpty(request.City))
        {
            query = query.Where(p => p.Store.City == request.City);
        }

        // 5. Filter Only Verified (if requested)
        if (request.VerifiedOnly == true)
        {
            query = query.Where(p => p.IsVerified);
        }

        // 5b. Filter by Submitter (BUG-05) - We need to check if we should join PriceSubmissions here
        // Actually, CurrentStoreProductPrice doesn't store 'SubmittedBy' directly, it's in PriceSubmission.
        // If filtering by Submitter, we might need to query PriceSubmissions instead or join them.
        // For simplicity and accuracy in "Active" prices, if SubmittedBy is provided, we'll filter CurrentStoreProductPrices
        // that have a corresponding latest submission by this user.
        // However, the most direct interpretation is filtering the active catalog.
        // But the spec says "Add submittedBy filtering to PriceService.SearchAsync".
        // Let's assume it means filtering PriceSubmissions that are latest or just filtering the result set.
        // Re-reading: CurrentStoreProductPrice represents the current BEST or LATEST price.
        if (request.SubmittedBy.HasValue)
        {
            // This is a bit tricky with the current schema if we want purely current prices.
            // But let's follow the requirement:
            query = query.Where(p => _db.PriceSubmissions
                .Any(ps => ps.ProductId == p.ProductId && ps.StoreId == p.StoreId && ps.SubmittedBy == request.SubmittedBy));
        }

        // 6. Apply Sorting
        if (request.Sort == "price")
        {
            query = query.OrderBy(p => p.CurrentPriceLbp);
        }
        else
        {
            query = query.OrderByDescending(p => p.UpdatedAt);
        }

        // 7. Execute the query and map to the response DTO
        var results = await query
            .Include(p => p.Product)
            .Include(p => p.Store)
            .Select(p => new PriceEntryResponse
            {
                Id = p.Id.ToString(),
                ProductId = p.ProductId.ToString(),
                StoreId = p.StoreId.ToString(),
                PriceLbp = p.CurrentPriceLbp,
                Status = p.IsVerified ? "verified" : "pending",
                Source = p.Source,
                CreatedAt = p.UpdatedAt,
                
                Product = p.Product == null ? null : new ProductDto {
                    Name = p.Product.Name,
                    Category = p.Product.Category != null ? p.Product.Category.Name : "General",
                    Unit = p.Product.Unit
                },
                
                Store = p.Store == null ? null : new StoreDto {
                    Name = p.Store.Name,
                    City = p.Store.City,
                    Latitude = p.Store.Latitude,
                    Longitude = p.Store.Longitude
                }
            })
            .ToListAsync();

        return results;
    }

    /// <summary>
    /// BUG-05 FIX: Get price submissions by a specific user ("My Submissions" in profile).
    /// </summary>
    public async Task<List<PriceEntryResponse>> GetByUserAsync(Guid userId)
    {
        return await _db.PriceSubmissions
            .Where(ps => ps.SubmittedBy == userId)
            .Include(ps => ps.Product)
            .Include(ps => ps.Store)
            .OrderByDescending(ps => ps.CreatedAt)
            .Select(ps => new PriceEntryResponse
            {
                Id = ps.Id.ToString(),
                ProductId = ps.ProductId.ToString(),
                StoreId = ps.StoreId.ToString(),
                PriceLbp = ps.PriceLbp,
                Status = ps.SubmissionStatus ?? "pending",
                Source = ps.Source ?? "community",
                IsPromotion = ps.IsPromotion,
                PromoEndsAt = ps.PromoEndsAt,
                CreatedAt = ps.CreatedAt,
                Product = ps.Product == null ? null : new ProductDto {
                    Name = ps.Product.Name,
                    Category = ps.Product.Category != null ? ps.Product.Category.Name : "General",
                    Unit = ps.Product.Unit
                },
                Store = ps.Store == null ? null : new StoreDto {
                    Name = ps.Store.Name,
                    City = ps.Store.City,
                    Latitude = ps.Store.Latitude,
                    Longitude = ps.Store.Longitude
                }
            })
            .ToListAsync();
    }

    /// <summary>
    /// Returns the price history for a product at a specific store (for the PriceHistoryChart).
    /// Falls back to all stores if storeId is not specified.
    /// </summary>
    public async Task<List<PriceHistoryPoint>> GetProductHistoryAsync(string productId, string? storeId)
    {
        if (!Guid.TryParse(productId, out var productGuid)) return new List<PriceHistoryPoint>();

        var query = _db.PriceSubmissions
            .Where(ps => ps.ProductId == productGuid);

        if (!string.IsNullOrEmpty(storeId) && Guid.TryParse(storeId, out var storeGuid))
        {
            query = query.Where(ps => ps.StoreId == storeGuid);
        }

        return await query
            .OrderBy(ps => ps.CreatedAt)
            .Select(ps => new PriceHistoryPoint
            {
                Date = ps.CreatedAt.ToString("MMM dd"),
                Price = ps.PriceLbp,
                Source = ps.Source ?? "community"
            })
            .ToListAsync();
    }

    /// <summary>
    /// Gets all price entries for a specific product across all stores.
    /// Useful for the "Price History" or "Compare Stores" view.
    /// </summary>
    public async Task<List<PriceEntryResponse>> GetByProductAsync(string productId)
    {
        if (!Guid.TryParse(productId, out var productGuid)) return new List<PriceEntryResponse>();

        return await _db.CurrentStoreProductPrices
            .Include(p => p.Product)
            .Include(p => p.Store)
            .Where(p => p.ProductId == productGuid)
            .Select(p => MapToResponse(p))
            .ToListAsync();
    }

    /// <summary>
    /// Gets the details of a single price entry.
    /// </summary>
    public async Task<PriceEntryResponse?> GetByIdAsync(string id)
    {
        if (!Guid.TryParse(id, out var guid)) return null;

        var entry = await _db.CurrentStoreProductPrices
            .Include(p => p.Product)
            .Include(p => p.Store)
            .FirstOrDefaultAsync(p => p.Id == guid);

        return entry == null ? null : MapToResponse(entry);
    }

    /// <summary>
    /// Handles a user submitting a new price they found at a store.
    /// </summary>
    public async Task<PriceEntryResponse> SubmitPriceAsync(PriceSubmissionRequest request, Guid userId)
    {
        var productId = Guid.Parse(request.ProductId);
        var storeId = Guid.Parse(request.StoreId);

        var submission = new PriceSubmission
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            StoreId = storeId,
            PriceLbp = request.PriceLbp,
            SubmittedBy = userId,
            IsPromotion = request.IsPromotion,
            PromoEndsAt = request.PromoEndsAt,
            CreatedAt = DateTime.UtcNow,
            SubmissionStatus = "pending",
            Source = "community"
        };

        _db.PriceSubmissions.Add(submission);

<<<<<<< HEAD
        // BUG-02 FIX: Upsert the current_store_product_prices table
        var currentPrice = await _db.CurrentStoreProductPrices
            .FirstOrDefaultAsync(p => p.StoreId == storeId && p.ProductId == productId);

        if (currentPrice != null)
        {
            currentPrice.CurrentPriceLbp = request.PriceLbp;
            currentPrice.Source = "community";
            currentPrice.IsVerified = false;
            currentPrice.UpdatedAt = DateTime.UtcNow;
=======
        // Upsert into CurrentStoreProductPrices so searches immediately reflect new prices
        var existing = await _db.CurrentStoreProductPrices
            .FirstOrDefaultAsync(c => c.StoreId == submission.StoreId && c.ProductId == submission.ProductId);

        if (existing != null)
        {
            existing.CurrentPriceLbp = submission.PriceLbp;
            existing.Source = "community";
            existing.IsVerified = false;
            existing.UpdatedAt = DateTime.UtcNow;
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
        }
        else
        {
            _db.CurrentStoreProductPrices.Add(new CurrentStoreProductPrice
            {
                Id = Guid.NewGuid(),
<<<<<<< HEAD
                StoreId = storeId,
                ProductId = productId,
                CurrentPriceLbp = request.PriceLbp,
=======
                StoreId = submission.StoreId,
                ProductId = submission.ProductId,
                CurrentPriceLbp = submission.PriceLbp,
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
                Source = "community",
                IsVerified = false,
                IsInStock = true,
                UpdatedAt = DateTime.UtcNow
            });
        }

<<<<<<< HEAD
        // Increment user upload count
        var user = await _db.Users.FindAsync(userId);
        if (user != null) user.UploadCount++;

        await _db.SaveChangesAsync();
        
=======
        await _db.SaveChangesAsync();

>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
        return new PriceEntryResponse
        {
            Id = submission.Id.ToString(),
            ProductId = submission.ProductId.ToString(),
            StoreId = submission.StoreId.ToString(),
            PriceLbp = submission.PriceLbp,
            Status = "pending",
            Source = "community",
            CreatedAt = submission.CreatedAt
        };
    }

    /// <summary>
    /// Gets all price submissions made by a specific user.
    /// </summary>
    public async Task<List<PriceEntryResponse>> GetByUserAsync(Guid userId)
    {
        return await _db.PriceSubmissions
            .Include(p => p.Product)
            .Include(p => p.Store)
            .Where(p => p.SubmittedBy == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PriceEntryResponse
            {
                Id = p.Id.ToString(),
                ProductId = p.ProductId.ToString(),
                StoreId = p.StoreId.ToString(),
                PriceLbp = p.PriceLbp,
                Status = p.SubmissionStatus,
                Source = p.Source,
                CreatedAt = p.CreatedAt,
                Product = p.Product == null ? null : new ProductDto {
                    Name = p.Product.Name,
                    Category = p.Product.Category != null ? p.Product.Category.Name : "General",
                    Unit = p.Product.Unit
                },
                Store = p.Store == null ? null : new StoreDto {
                    Name = p.Store.Name,
                    City = p.Store.City,
                    Latitude = p.Store.Latitude,
                    Longitude = p.Store.Longitude
                }
            })
            .ToListAsync();
    }

    /// <summary>
    /// Upvotes or Downvotes a price entry to help the community build trust.
    /// </summary>
    public async Task<bool> VoteAsync(string id, int value)
    {
        if (!Guid.TryParse(id, out var guid)) return false;

        var entry = await _db.PriceSubmissions.FindAsync(guid);
        if (entry == null) return false;

        if (value > 0) entry.Upvotes++;
        else entry.Downvotes++;

        await _db.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Returns historical price submissions for a product to power the price chart.
    /// </summary>
    public async Task<List<PriceHistoryPoint>> GetHistoryByProductAsync(string productId)
    {
        if (!Guid.TryParse(productId, out var productGuid)) return new List<PriceHistoryPoint>();

        return await _db.PriceSubmissions
            .Include(p => p.Store)
            .Where(p => p.ProductId == productGuid)
            .OrderBy(p => p.CreatedAt)
            .Take(30)
            .Select(p => new PriceHistoryPoint
            {
                Date = p.CreatedAt.ToString("MMM dd"),
                Price = p.PriceLbp,
                StoreName = p.Store != null ? p.Store.Name : ""
            })
            .ToListAsync();
    }

    // Helper method to avoid repeating the "Mapping" code
    private static PriceEntryResponse MapToResponse(CurrentStoreProductPrice p)
    {
        return new PriceEntryResponse
        {
            Id = p.Id.ToString(),
            ProductId = p.ProductId.ToString(),
            StoreId = p.StoreId.ToString(),
            PriceLbp = p.CurrentPriceLbp,
            Status = p.IsVerified ? "verified" : "pending",
            Source = p.Source,
            CreatedAt = p.UpdatedAt,
            Product = p.Product == null ? null : new ProductDto {
                Name = p.Product.Name,
                Category = p.Product.Category?.Name ?? "General",
                Unit = p.Product.Unit
            },
            Store = p.Store == null ? null : new StoreDto {
                Name = p.Store.Name,
                City = p.Store.City,
                Latitude = p.Store.Latitude,
                Longitude = p.Store.Longitude
            }
        };
    }
}