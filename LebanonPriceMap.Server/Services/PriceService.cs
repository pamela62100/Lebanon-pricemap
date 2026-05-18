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
    private readonly LiveBroadcaster _live;

    public PriceService(AppDbContext db, LiveBroadcaster live)
    {
        _db = db;
        _live = live;
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

        // 5b. Filter In Stock Only (if requested)
        if (request.InStockOnly == true)
        {
            query = query.Where(p => p.IsInStock);
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

        // 7. Execute the query with pagination and map to the response DTO
        var limit = Math.Clamp(request.Limit, 1, 200);
        var offset = Math.Max(0, request.Offset);

        var results = await query
            .Include(p => p.Product)
            .Include(p => p.Store)
            .Skip(offset)
            .Take(limit)
            .Select(p => new PriceEntryResponse
            {
                Id = p.Id.ToString(),
                ProductId = p.ProductId.ToString(),
                StoreId = p.StoreId.ToString(),
                PriceLbp = p.CurrentPriceLbp,
                Status = p.IsVerified ? "verified" : "pending",
                Source = p.Source.ToString(),
                CreatedAt = p.UpdatedAt, // Using UpdatedAt as the active price date
                Upvotes = p.ConfirmationCount,
                
                // MAP NESTED PRODUCT
                Product = p.Product == null ? null : new ProductDto {
                    Name = p.Product.Name,
                    Category = p.Product.Category != null ? p.Product.Category.Name : "General",
                    Unit = p.Product.Unit
                },
                
                IsInStock = p.IsInStock,

                // MAP NESTED STORE
                Store = p.Store == null ? null : new StoreDto {
                    Name = p.Store.Name,
                    City = p.Store.City,
                    District = p.Store.District,
                    Latitude = p.Store.Latitude,
                    Longitude = p.Store.Longitude,
                    PowerStatus = p.Store.PowerStatus,
                    IsVerifiedRetailer = p.Store.IsVerifiedRetailer
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
    /// Processes a bulk CSV import for the logged-in store owner.
    /// Each row is validated, saved as a submission, and recorded as a sync run.
    /// </summary>
    public async Task<BulkPriceSubmissionResult> SubmitBulkPricesAsync(BulkPriceSubmissionRequest request, Guid userId)
    {
        var store = await _db.Stores.FirstOrDefaultAsync(s => s.OwnerUserId == userId);
        if (store == null) throw new InvalidOperationException("Store not found for current user.");

        var run = new StoreSyncRun
        {
            Id = Guid.NewGuid(),
            StoreId = store.Id,
            Method = Enum.TryParse<SyncMethod>(request.Method, true, out var m) ? m : SyncMethod.csv,
            Status = SyncStatus.running,
            RecordsReceived = request.Rows.Count,
            StartedAt = DateTime.UtcNow,
            CreatedBy = userId
        };
        _db.StoreSyncRuns.Add(run);
        await _db.SaveChangesAsync();

        var processed = 0;
        var failed = 0;

        foreach (var row in request.Rows)
        {
            var price = row.PriceLbp;
            var barcode = row.Barcode?.Trim();
            var name = row.ProductName?.Trim();
            var unit = row.Unit?.Trim();

            var item = new StoreSyncItem
            {
                Id = Guid.NewGuid(),
                SyncRunId = run.Id,
                RawName = name,
                RawBarcode = barcode,
                RawPrice = price,
                Status = "failed",
                FailReason = string.Empty
            };

            if (price == null || price <= 0)
            {
                item.FailReason = "Invalid price";
                failed++;
                _db.StoreSyncItems.Add(item);
                continue;
            }

            Product? product = null;
            if (!string.IsNullOrWhiteSpace(barcode))
            {
                var normalizedBarcode = barcode;
                product = await _db.Products
                    .Include(p => p.Aliases)
                    .FirstOrDefaultAsync(p => p.Barcode == normalizedBarcode || p.Aliases.Any(a => a.Alias == normalizedBarcode));
            }

            if (product == null && !string.IsNullOrWhiteSpace(name))
            {
                var normalizedName = name.ToLower();
                product = await _db.Products
                    .Include(p => p.Aliases)
                    .FirstOrDefaultAsync(p => p.Name.ToLower() == normalizedName || p.Aliases.Any(a => a.Alias.ToLower() == normalizedName));
            }

            if (product == null)
            {
                item.FailReason = "Product not found; use barcode or exact name";
                failed++;
                _db.StoreSyncItems.Add(item);
                continue;
            }

            item.ProductId = product.Id;
            item.Status = "processed";

            var submission = new PriceSubmission
            {
                Id = Guid.NewGuid(),
                ProductId = product.Id,
                StoreId = store.Id,
                PriceLbp = price.Value,
                SubmittedBy = userId,
                IsPromotion = false,
                PromoEndsAt = null,
                CreatedAt = DateTime.UtcNow,
                SubmissionStatus = SubmissionStatus.verified,
                Source = SubmissionSource.csv,
                OcrBarcode = barcode,
                Note = name
            };
            _db.PriceSubmissions.Add(submission);

            var existing = await _db.CurrentStoreProductPrices
                .FirstOrDefaultAsync(c => c.StoreId == store.Id && c.ProductId == product.Id);

            if (existing != null)
            {
                existing.CurrentPriceLbp = submission.PriceLbp;
                existing.Source = SubmissionSource.csv;
                existing.IsVerified = true;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                _db.CurrentStoreProductPrices.Add(new CurrentStoreProductPrice
                {
                    Id = Guid.NewGuid(),
                    StoreId = store.Id,
                    ProductId = product.Id,
                    CurrentPriceLbp = submission.PriceLbp,
                    Source = SubmissionSource.csv,
                    IsVerified = true,
                    IsInStock = true,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            // --- ALSO UPDATE THE OFFICIAL STORE CATALOG ---
            var catalogItem = await _db.StoreCatalogItems
                .FirstOrDefaultAsync(c => c.StoreId == store.Id && c.ProductId == product.Id);

            if (catalogItem != null)
            {
                catalogItem.OfficialPriceLbp = submission.PriceLbp;
                catalogItem.LastUpdatedAt = DateTime.UtcNow;
                catalogItem.LastUpdatedBy = userId;
                catalogItem.IsInStock = true;
            }
            else
            {
                _db.StoreCatalogItems.Add(new StoreCatalogItem
                {
                    Id = Guid.NewGuid(),
                    StoreId = store.Id,
                    ProductId = product.Id,
                    OfficialPriceLbp = submission.PriceLbp,
                    IsInStock = true,
                    LastUpdatedAt = DateTime.UtcNow,
                    LastUpdatedBy = userId,
                    CreatedAt = DateTime.UtcNow
                });
            }

            processed++;
            _db.StoreSyncItems.Add(item);
        }

        run.RecordsProcessed = processed;
        run.RecordsFailed = failed;
        run.Status = failed == 0 ? SyncStatus.ok : processed == 0 ? SyncStatus.fail : SyncStatus.partial;
        run.Message = failed == 0 ? "All rows imported successfully." : $"Imported {processed} rows, {failed} failed.";
        run.FinishedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        await _live.SyncRunUpdated(store.Id, new {
            id = run.Id,
            storeId = store.Id,
            method = run.Method.ToString(),
            status = run.Status.ToString(),
            recordsReceived = run.RecordsReceived,
            recordsProcessed = run.RecordsProcessed,
            recordsFailed = run.RecordsFailed,
            message = run.Message,
            startedAt = run.StartedAt,
            finishedAt = run.FinishedAt
        });

        return new BulkPriceSubmissionResult
        {
            RecordsReceived = request.Rows.Count,
            RecordsProcessed = processed,
            RecordsFailed = failed,
            Status = run.Status.ToString(),
            Message = run.Message
        };
    }

    public async Task<BulkPriceSubmissionResult> SubmitBulkPricesByStoreAsync(BulkPriceSubmissionRequest request, Guid storeId)
    {
        var store = await _db.Stores.FindAsync(storeId);
        if (store == null) throw new InvalidOperationException("Store not found");

        var run = new StoreSyncRun
        {
            Id = Guid.NewGuid(),
            StoreId = storeId,
            Method = SyncMethod.api,
            Status = SyncStatus.running,
            StartedAt = DateTime.UtcNow
        };
        _db.StoreSyncRuns.Add(run);
        await _db.SaveChangesAsync();

        int processed = 0;
        int failed = 0;

        foreach (var row in request.Rows)
        {
            var barcode = row.Barcode;
            var price = row.PriceLbp;
            var name = row.ProductName;

            var item = new StoreSyncItem
            {
                Id = Guid.NewGuid(),
                SyncRunId = run.Id,
                RawBarcode = barcode,
                RawPrice = price,
                RawName = name,
                Status = "pending"
            };

            if (price == null || price <= 0)
            {
                item.FailReason = "Invalid price";
                failed++;
                _db.StoreSyncItems.Add(item);
                continue;
            }

            Product? product = null;
            if (!string.IsNullOrWhiteSpace(barcode))
            {
                product = await _db.Products
                    .Include(p => p.Aliases)
                    .FirstOrDefaultAsync(p => p.Barcode == barcode || p.Aliases.Any(a => a.Alias == barcode));
            }

            if (product == null && !string.IsNullOrWhiteSpace(name))
            {
                var normalizedName = name.ToLower();
                product = await _db.Products
                    .Include(p => p.Aliases)
                    .FirstOrDefaultAsync(p => p.Name.ToLower() == normalizedName || p.Aliases.Any(a => a.Alias.ToLower() == normalizedName));
            }

            if (product == null)
            {
                // Smart Sync: Auto-create the product in the master catalog
                if (string.IsNullOrWhiteSpace(name))
                {
                    item.FailReason = "Product not found and no name provided to create one";
                    failed++;
                    _db.StoreSyncItems.Add(item);
                    continue;
                }

                product = new Product
                {
                    Id = Guid.NewGuid(),
                    Name = name.Trim(),
                    Unit = row.Unit ?? "unit",
                    Barcode = barcode,
                    UploadCount = 1,
                    IsArchived = false,
                    CreatedBy = store.OwnerUserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.Products.Add(product);

                // Also add the name as an alias for future fuzzy matching
                _db.ProductAliases.Add(new ProductAlias
                {
                    ProductId = product.Id,
                    Alias = name.Trim()
                });
            }

            item.ProductId = product.Id;
            item.Status = "processed";

            // Verified submission
            var submission = new PriceSubmission
            {
                Id = Guid.NewGuid(),
                ProductId = product.Id,
                StoreId = storeId,
                PriceLbp = price.Value,
                IsPromotion = false,
                CreatedAt = DateTime.UtcNow,
                SubmissionStatus = SubmissionStatus.verified,
                Source = SubmissionSource.api,
                OcrBarcode = barcode,
                Note = "Sync via API"
            };
            _db.PriceSubmissions.Add(submission);

            // Current price
            var existingPrice = await _db.CurrentStoreProductPrices
                .FirstOrDefaultAsync(c => c.StoreId == storeId && c.ProductId == product.Id);

            if (existingPrice != null)
            {
                existingPrice.CurrentPriceLbp = submission.PriceLbp;
                existingPrice.Source = SubmissionSource.api;
                existingPrice.IsVerified = true;
                existingPrice.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                _db.CurrentStoreProductPrices.Add(new CurrentStoreProductPrice
                {
                    Id = Guid.NewGuid(),
                    StoreId = storeId,
                    ProductId = product.Id,
                    CurrentPriceLbp = submission.PriceLbp,
                    Source = SubmissionSource.api,
                    IsVerified = true,
                    IsInStock = true,
                    UpdatedAt = DateTime.UtcNow
                });
            }

            // Catalog
            var catalogItem = await _db.StoreCatalogItems
                .FirstOrDefaultAsync(c => c.StoreId == storeId && c.ProductId == product.Id);

            if (catalogItem != null)
            {
                catalogItem.OfficialPriceLbp = submission.PriceLbp;
                catalogItem.LastUpdatedAt = DateTime.UtcNow;
                catalogItem.IsInStock = true;
            }
            else
            {
                _db.StoreCatalogItems.Add(new StoreCatalogItem
                {
                    Id = Guid.NewGuid(),
                    StoreId = storeId,
                    ProductId = product.Id,
                    OfficialPriceLbp = submission.PriceLbp,
                    IsInStock = true,
                    LastUpdatedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                });
            }

            processed++;
            _db.StoreSyncItems.Add(item);
        }

        run.RecordsProcessed = processed;
        run.RecordsFailed = failed;
         run.Status = failed == 0 ? SyncStatus.ok : processed == 0 ? SyncStatus.fail : SyncStatus.partial;
         run.Message = processed > 0 && failed == 0
             ? $"All {processed} rows imported successfully."
             : $"Imported {processed} rows, {failed} failed.";
         run.FinishedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        await _live.SyncRunUpdated(storeId, new {
            id = run.Id,
            storeId = storeId,
            method = run.Method.ToString(),
            status = run.Status.ToString(),
            recordsReceived = run.RecordsReceived,
            recordsProcessed = run.RecordsProcessed,
            recordsFailed = run.RecordsFailed,
            message = run.Message,
            startedAt = run.StartedAt,
            finishedAt = run.FinishedAt
        });

        return new BulkPriceSubmissionResult
        {
            RecordsReceived = request.Rows.Count,
            RecordsProcessed = processed,
            RecordsFailed = failed,
            Status = run.Status.ToString(),
            Message = run.Message
        };
    }

    /// <summary>
    /// Records a per-user verification on a price entry.
    /// Returns "ok", "already_verified", or "not_found".
    /// </summary>
    public async Task<string> VoteAsync(string id, int value, Guid userId)
    {
        if (!Guid.TryParse(id, out var guid)) return "not_found";

        var entry = await _db.CurrentStoreProductPrices.FindAsync(guid);
        if (entry == null) return "not_found";

        if (value > 0)
        {
            var alreadyVerified = await _db.PriceConfirmations
                .AnyAsync(c => c.PriceSubmissionId == guid && c.UserId == userId);
            if (alreadyVerified) return "already_verified";

            _db.PriceConfirmations.Add(new PriceConfirmation
            {
                Id = Guid.NewGuid(),
                PriceSubmissionId = guid,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            });
            entry.ConfirmationCount++;
            var voter = await _db.Users.FindAsync(userId);
            if (voter != null) { voter.VerifiedCount++; voter.UploadCount++; }
        }
        entry.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        await _live.PriceVoted(entry.ProductId, new {
            priceEntryId = entry.Id,
            productId = entry.ProductId,
            storeId = entry.StoreId,
            confirmationCount = entry.ConfirmationCount
        });
        return "ok";
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
            Source = p.Source.ToString(),
            CreatedAt = p.UpdatedAt,
            Upvotes = p.ConfirmationCount,
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