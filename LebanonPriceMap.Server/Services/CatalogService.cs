using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Services
{
    public class CatalogService
    {
        private readonly AppDbContext _context;
        private readonly AlertService _alertService;
        private readonly LiveBroadcaster _live;

        public CatalogService(AppDbContext context, AlertService alertService, LiveBroadcaster live)
        {
            _context = context;
            _alertService = alertService;
            _live = live;
        }

        public async Task<IEnumerable<CatalogItemDto>> GetByStoreIdAsync(Guid storeId)
        {
            var items = await _context.StoreCatalogItems
                .Where(c => c.StoreId == storeId)
                .Include(c => c.Product)
                    .ThenInclude(p => p.Category)
                .Include(c => c.Store)
                .ToListAsync();

            return items.Select(c => MapToDto(c));
        }

        public async Task<object> GetMasterProductsAsync()
        {
            return await _context.Products
                .Select(p => new { p.Id, p.Name, p.Barcode })
                .Take(20)
                .ToListAsync();
        }

        public async Task<List<MarketInsightDto>> GetMarketInsightsAsync(Guid storeId)
        {
            // 1. Get the retailer's catalog
            var myItems = await _context.StoreCatalogItems
                .Where(c => c.StoreId == storeId)
                .Include(c => c.Product)
                .ThenInclude(p => p.Category)
                .ToListAsync();

            var results = new List<MarketInsightDto>();

            foreach (var item in myItems)
            {
                if (item.Product == null) continue;

                // 2. Calculate market average for this product (from other stores)
                // We'll look at official catalog prices from all stores except this one
                var marketPrices = await _context.StoreCatalogItems
                    .Where(c => c.ProductId == item.ProductId && c.StoreId != storeId && c.OfficialPriceLbp > 0)
                    .Select(c => c.OfficialPriceLbp)
                    .ToListAsync();

                decimal average = 0;
                if (marketPrices.Any())
                {
                    average = marketPrices.Average() ?? 0;
                }

                decimal yourPrice = item.IsPromotion ? (item.PromoPriceLbp ?? item.OfficialPriceLbp ?? 0) : (item.OfficialPriceLbp ?? 0);

                string position = "fair";
                if (average > 0)
                {
                    var diff = (yourPrice - average) / average;
                    if (diff > 0.05m) position = "higher";
                    else if (diff < -0.05m) position = "lower";
                }

                results.Add(new MarketInsightDto
                {
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    Category = item.Product.Category?.Name ?? "General",
                    Unit = item.Product.Unit,
                    YourPrice = yourPrice,
                    MarketAverage = average,
                    CompetitorCount = marketPrices.Count,
                    PricePosition = position
                });
            }

            return results;
        }

        public async Task<CatalogItemDto?> GetByIdAsync(Guid id)
        {
            var item = await _context.StoreCatalogItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.Category)
                .Include(c => c.Store)
                .FirstOrDefaultAsync(c => c.Id == id);

            return item != null ? MapToDto(item) : null;
        }

        public async Task<CatalogItemDto> CreateAsync(CreateCatalogItemDto dto, Guid? userId)
        {
            await EnsureUserOwnsStoreAsync(dto.StoreId, userId);

            var item = new StoreCatalogItem
            {
                Id = Guid.NewGuid(),
                StoreId = dto.StoreId,
                ProductId = dto.ProductId,
                OfficialPriceLbp = dto.OfficialPriceLbp,
                PromoPriceLbp = dto.PromoPriceLbp,
                PromoEndsAt = dto.PromoEndsAt,
                IsInStock = dto.IsInStock,
                IsPromotion = dto.IsPromotion && dto.PromoPriceLbp.HasValue && dto.PromoPriceLbp < (dto.OfficialPriceLbp ?? decimal.MaxValue),
                LastUpdatedBy = userId,
                LastUpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.StoreCatalogItems.Add(item);
            
            // Log audit
            _context.CatalogAuditEntries.Add(new CatalogAuditEntry
            {
                Id = Guid.NewGuid(),
                CatalogItemId = item.Id,
                StoreId = item.StoreId,
                ProductId = item.ProductId,
                ChangedBy = userId,
                Reason = dto.Reason,
                NewPriceLbp = item.IsPromotion ? item.PromoPriceLbp : item.OfficialPriceLbp,
                Note = dto.Note,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            // Sync with StorePromotion table for historical tracking
            if (item.IsPromotion && item.PromoPriceLbp.HasValue)
            {
                await CreateHistoricalPromotion(item, userId);
            }

            // Reload item with related data for DTO mapping
            var savedItem = await _context.StoreCatalogItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.Category)
                .Include(c => c.Store)
                .FirstOrDefaultAsync(c => c.Id == item.Id);

            var dtoOut = MapToDto(savedItem!);
            await _live.CatalogChanged(item.StoreId, item.ProductId, new { action = "created", item = dtoOut });
            return dtoOut;
        }

        public async Task<CatalogItemDto?> UpdateAsync(Guid id, UpdateCatalogItemDto dto, Guid? userId)
        {
            var item = await _context.StoreCatalogItems
                .Include(c => c.Product)
                .Include(c => c.Store)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (item == null) return null;
            await EnsureUserOwnsStoreAsync(item.StoreId, userId);

            var previousPrice = item.IsPromotion ? item.PromoPriceLbp : item.OfficialPriceLbp;

            item.OfficialPriceLbp = dto.OfficialPriceLbp;
            item.PromoPriceLbp = dto.PromoPriceLbp;
            item.PromoEndsAt = dto.PromoEndsAt;
            item.IsInStock = dto.IsInStock;
            item.IsPromotion = dto.IsPromotion && dto.PromoPriceLbp.HasValue && dto.PromoPriceLbp < (dto.OfficialPriceLbp ?? decimal.MaxValue);
            item.LastUpdatedBy = userId;
            item.LastUpdatedAt = DateTime.UtcNow;

            var newPrice = item.IsPromotion ? item.PromoPriceLbp : item.OfficialPriceLbp;

            // Log audit
            _context.CatalogAuditEntries.Add(new CatalogAuditEntry
            {
                Id = Guid.NewGuid(),
                CatalogItemId = item.Id,
                StoreId = item.StoreId,
                ProductId = item.ProductId,
                ChangedBy = userId,
                Reason = dto.Reason,
                PreviousPriceLbp = previousPrice,
                NewPriceLbp = newPrice,
                Note = dto.Note,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            // Fire price alerts (skip if there's no concrete price set)
            var effectivePrice = item.IsPromotion && item.PromoPriceLbp.HasValue
                ? item.PromoPriceLbp
                : item.OfficialPriceLbp;
            if (effectivePrice.HasValue)
            {
                await _alertService.CheckAlertsForPriceDropAsync(item.ProductId, effectivePrice.Value, item.StoreId);
            }

            // Sync with StorePromotion table
            if (item.IsPromotion && item.PromoPriceLbp.HasValue)
            {
                await CreateHistoricalPromotion(item, userId);
            }
            else
            {
                var activePromos = await _context.StorePromotions
                    .Where(p => p.StoreId == item.StoreId && p.ProductId == item.ProductId && p.Status == "active")
                    .ToListAsync();
                foreach (var p in activePromos)
                {
                    p.Status = "ended";
                    p.UpdatedAt = DateTime.UtcNow;
                }
                await _context.SaveChangesAsync();
            }

            var dtoOut = MapToDto(item);
            await _live.CatalogChanged(item.StoreId, item.ProductId, new { action = "updated", item = dtoOut });
            await _live.PriceChanged(item.ProductId, new {
                storeId = item.StoreId,
                productId = item.ProductId,
                priceLbp = effectivePrice,
                isPromotion = item.IsPromotion,
                isInStock = item.IsInStock
            });
            return dtoOut;
        }

        public async Task<bool> DeleteAsync(Guid id, Guid? userId = null)
        {
            var item = await _context.StoreCatalogItems.FindAsync(id);
            if (item == null) return false;
            await EnsureUserOwnsStoreAsync(item.StoreId, userId);

            var storeId = item.StoreId;
            var productId = item.ProductId;

            _context.StoreCatalogItems.Remove(item);
            await _context.SaveChangesAsync();

            await _live.CatalogChanged(storeId, productId, new { action = "deleted", id });
            return true;
        }

        // Throws UnauthorizedAccessException if the user doesn't own the store.
        // userId can be null for admin contexts where ownership isn't applicable.
        private async Task EnsureUserOwnsStoreAsync(Guid storeId, Guid? userId)
        {
            if (!userId.HasValue) return;
            var owns = await _context.Stores
                .AnyAsync(s => s.Id == storeId && s.OwnerUserId == userId.Value);
            if (!owns)
                throw new UnauthorizedAccessException("You don't own this store.");
        }

        public async Task<IEnumerable<CatalogAuditDto>> GetAuditTrailAsync(Guid catalogItemId)
        {
            return await _context.CatalogAuditEntries
                .Where(a => a.CatalogItemId == catalogItemId)
                .Include(a => a.ChangedByUser)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new CatalogAuditDto
                {
                    Id = a.Id,
                    CatalogItemId = a.CatalogItemId,
                    ChangedBy = a.ChangedBy,
                    ChangedByName = a.ChangedByUser == null ? "System" : a.ChangedByUser.Name,
                    Reason = a.Reason,
                    PreviousPriceLbp = a.PreviousPriceLbp,
                    NewPriceLbp = a.NewPriceLbp,
                    Note = a.Note,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<object> BulkUploadAsync(Guid storeId, Stream csvStream, Guid? userId)
        {
            using var reader = new StreamReader(csvStream);
            var line = await reader.ReadLineAsync(); // Header
            
            int processed = 0;
            int failed = 0;

            while ((line = await reader.ReadLineAsync()) != null)
            {
                var parts = line.Split(',');
                if (parts.Length < 2) { failed++; continue; }

                // Format: ProductId, OfficialPrice, IsInStock
                if (Guid.TryParse(parts[0], out Guid productId) && decimal.TryParse(parts[1], out decimal price))
                {
                    bool isInStock = parts.Length > 2 ? bool.Parse(parts[2]) : true;

                    var existing = await _context.StoreCatalogItems
                        .FirstOrDefaultAsync(c => c.StoreId == storeId && c.ProductId == productId);

                    if (existing != null)
                    {
                        var prevPrice = existing.IsPromotion ? existing.PromoPriceLbp : existing.OfficialPriceLbp;
                        existing.OfficialPriceLbp = price;
                        existing.IsInStock = isInStock;
                        existing.LastUpdatedBy = userId;
                        existing.LastUpdatedAt = DateTime.UtcNow;

                        _context.CatalogAuditEntries.Add(new CatalogAuditEntry
                        {
                            Id = Guid.NewGuid(),
                            CatalogItemId = existing.Id,
                            StoreId = storeId,
                            ProductId = productId,
                            ChangedBy = userId,
                            Reason = CatalogChangeReason.owner_update,
                            PreviousPriceLbp = prevPrice,
                            NewPriceLbp = price,
                            Note = "Bulk CSV update",
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                    else
                    {
                        var newItem = new StoreCatalogItem
                        {
                            Id = Guid.NewGuid(),
                            StoreId = storeId,
                            ProductId = productId,
                            OfficialPriceLbp = price,
                            IsInStock = isInStock,
                            LastUpdatedBy = userId,
                            LastUpdatedAt = DateTime.UtcNow
                        };
                        _context.StoreCatalogItems.Add(newItem);
                        
                        _context.CatalogAuditEntries.Add(new CatalogAuditEntry
                        {
                            Id = Guid.NewGuid(),
                            CatalogItemId = newItem.Id,
                            StoreId = storeId,
                            ProductId = productId,
                            ChangedBy = userId,
                            Reason = CatalogChangeReason.owner_update,
                            NewPriceLbp = price,
                            Note = "Bulk CSV addition",
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                    processed++;
                }
                else
                {
                    failed++;
                }
            }

            await _context.SaveChangesAsync();
            return new { success = true, processed, failed };
        }

        private static CatalogItemDto MapToDto(StoreCatalogItem item)
        {
            return new CatalogItemDto
            {
                Id = item.Id,
                StoreId = item.StoreId,
                StoreName = item.Store?.Name ?? "Unknown Store",
                ProductId = item.ProductId,
                ProductName = item.Product?.Name ?? "Unknown Product",
                ProductBrand = item.Product?.Brand ?? string.Empty,
                ProductUnit = item.Product?.Unit ?? string.Empty,
                OfficialPriceLbp = item.OfficialPriceLbp,
                PromoPriceLbp = item.PromoPriceLbp,
                PromoEndsAt = item.PromoEndsAt,
                IsInStock = item.IsInStock,
                IsPromotion = item.IsPromotion,
                DiscountPercent = (item.IsPromotion && item.PromoPriceLbp.HasValue && item.OfficialPriceLbp.HasValue && item.OfficialPriceLbp > 0) 
                    ? Math.Round((1 - (item.PromoPriceLbp.Value / item.OfficialPriceLbp.Value)) * 100, 0) 
                    : null,
                LastUpdatedAt = item.LastUpdatedAt,
                Product = new ProductDetailsDto
                {
                    Name = item.Product?.Name ?? "Unknown Product",
                    Category = item.Product?.Category?.Name ?? "General",
                    Unit = item.Product?.Unit ?? "",
                    Barcode = item.Product?.Barcode ?? ""
                }
            };
        }

        public async Task<Store?> GetStoreByOwnerAsync(Guid ownerId)
        {
            return await _context.Stores.FirstOrDefaultAsync(s => s.OwnerUserId == ownerId);
        }

        private async Task CreateHistoricalPromotion(StoreCatalogItem item, Guid? userId)
        {
            // Reload item to ensure Product is available
            var fullItem = await _context.StoreCatalogItems
                .Include(c => c.Product)
                .FirstOrDefaultAsync(c => c.Id == item.Id);

            if (fullItem == null) return;

            // Close any existing active promos for this product in this store
            var existing = await _context.StorePromotions
                .Where(p => p.StoreId == fullItem.StoreId && p.ProductId == fullItem.ProductId && p.Status == "active")
                .ToListAsync();

            foreach (var e in existing)
            {
                e.Status = "superseded";
                e.UpdatedAt = DateTime.UtcNow;
            }

            var promo = new StorePromotion
            {
                Id = Guid.NewGuid(),
                StoreId = fullItem.StoreId,
                ProductId = fullItem.ProductId,
                Title = $"Promo: {fullItem.Product?.Name ?? "Product"}",
                OriginalPriceLbp = fullItem.OfficialPriceLbp,
                PromoPriceLbp = fullItem.PromoPriceLbp ?? 0,
                StartsAt = DateTime.UtcNow,
                EndsAt = fullItem.PromoEndsAt,
                Status = "active",
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Calculate discount percent if possible
            if (fullItem.OfficialPriceLbp.HasValue && fullItem.OfficialPriceLbp.Value > 0)
            {
                if (fullItem.PromoPriceLbp.HasValue)
                {
                    promo.DiscountPercent = Math.Round((1 - (fullItem.PromoPriceLbp.Value / fullItem.OfficialPriceLbp.Value)) * 100, 2);
                }
            }

            _context.StorePromotions.Add(promo);
            await _context.SaveChangesAsync();

            if (fullItem.PromoPriceLbp.HasValue)
            {
                await _alertService.CheckAlertsForPriceDropAsync(fullItem.ProductId, fullItem.PromoPriceLbp.Value, fullItem.StoreId);
            }
        }

        /// <summary>
        /// Scans the catalog for expired promotions and reverts them to official prices.
        /// Should be called by a background job or periodic trigger.
        /// </summary>
        public async Task<int> AutoExpirePromotionsAsync()
        {
            var expiredItems = await _context.StoreCatalogItems
                .Where(c => c.IsPromotion && c.PromoEndsAt != null && c.PromoEndsAt < DateTime.UtcNow)
                .ToListAsync();

            if (!expiredItems.Any()) return 0;

            foreach (var item in expiredItems)
            {
                item.IsPromotion = false;
                // We keep PromoPriceLbp/EndsAt values as history in the catalog item 
                // until the next update, but IsPromotion = false makes the system ignore them.
                
                // Update historical table
                var activePromos = await _context.StorePromotions
                    .Where(p => p.StoreId == item.StoreId && p.ProductId == item.ProductId && p.Status == "active")
                    .ToListAsync();

                foreach (var p in activePromos)
                {
                    p.Status = "expired";
                    p.UpdatedAt = DateTime.UtcNow;
                }

                _context.CatalogAuditEntries.Add(new CatalogAuditEntry
                {
                    Id = Guid.NewGuid(),
                    CatalogItemId = item.Id,
                    StoreId = item.StoreId,
                    ProductId = item.ProductId,
                    Reason = CatalogChangeReason.promo_ended,
                    PreviousPriceLbp = item.PromoPriceLbp,
                    NewPriceLbp = item.OfficialPriceLbp,
                    Note = "Promotion automatically expired by system",
                    CreatedAt = DateTime.UtcNow
                });
            }

            return await _context.SaveChangesAsync();
        }
    }
}
