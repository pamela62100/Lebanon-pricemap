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
            // EF Core will translate this into SQL: products.name LIKE %search% OR stores.name LIKE %search%
            query = query.Where(p => 
                p.Product.Name.ToLower().Contains(search) || 
                p.Store.Name.ToLower().Contains(search));
        }

        // 3. Filter by Category
        if (!string.IsNullOrEmpty(request.Category) && request.Category != "All")
        {
            // We follow the relationship from Price -> Product -> Category
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

        // 6. Apply Sorting
        if (request.Sort == "price")
        {
            query = query.OrderBy(p => p.CurrentPriceLbp);
        }
        else
        {
            // Default to newest
            query = query.OrderByDescending(p => p.UpdatedAt);
        }

        // 7. Execute the query and map to the response DTO
        // We use .Include to "JOIN" the tables, otherwise Product and Store would be NULL.
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
                CreatedAt = p.UpdatedAt, // Using UpdatedAt as the active price date
                
                // MAP NESTED PRODUCT
                Product = p.Product == null ? null : new ProductDto {
                    Name = p.Product.Name,
                    Category = p.Product.Category != null ? p.Product.Category.Name : "General",
                    Unit = p.Product.Unit
                },
                
                // MAP NESTED STORE
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
        var submission = new PriceSubmission
        {
            Id = Guid.NewGuid(),
            ProductId = Guid.Parse(request.ProductId),
            StoreId = Guid.Parse(request.StoreId),
            PriceLbp = request.PriceLbp,
            SubmittedBy = userId,
            IsPromotion = request.IsPromotion,
            PromoEndsAt = request.PromoEndsAt,
            CreatedAt = DateTime.UtcNow,
            SubmissionStatus = "pending",
            Source = "community"
        };

        _db.PriceSubmissions.Add(submission);
        await _db.SaveChangesAsync();

        // Upsert into CurrentStoreProductPrices so searches immediately reflect new prices
        var existing = await _db.CurrentStoreProductPrices
            .FirstOrDefaultAsync(c => c.StoreId == submission.StoreId && c.ProductId == submission.ProductId);

        if (existing != null)
        {
            existing.CurrentPriceLbp = submission.PriceLbp;
            existing.Source = "community";
            existing.IsVerified = false;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            _db.CurrentStoreProductPrices.Add(new CurrentStoreProductPrice
            {
                Id = Guid.NewGuid(),
                StoreId = submission.StoreId,
                ProductId = submission.ProductId,
                CurrentPriceLbp = submission.PriceLbp,
                Source = "community",
                IsVerified = false,
                IsInStock = true,
                UpdatedAt = DateTime.UtcNow
            });
        }

        await _db.SaveChangesAsync();

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