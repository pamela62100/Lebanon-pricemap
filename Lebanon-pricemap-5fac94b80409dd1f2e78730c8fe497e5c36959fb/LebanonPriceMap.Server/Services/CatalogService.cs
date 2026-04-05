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

        public CatalogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CatalogItemDto>> GetByStoreIdAsync(Guid storeId)
        {
            return await _context.StoreCatalogItems
                .Where(c => c.StoreId == storeId)
                .Include(c => c.Product)
                .Include(c => c.Store)
                .Select(c => MapToDto(c))
                .ToListAsync();
        }

        public async Task<CatalogItemDto?> GetByIdAsync(Guid id)
        {
            var item = await _context.StoreCatalogItems
                .Include(c => c.Product)
                .Include(c => c.Store)
                .FirstOrDefaultAsync(c => c.Id == id);

            return item != null ? MapToDto(item) : null;
        }

        public async Task<CatalogItemDto> CreateAsync(CreateCatalogItemDto dto, Guid? userId)
        {
            var item = new StoreCatalogItem
            {
                Id = Guid.NewGuid(),
                StoreId = dto.StoreId,
                ProductId = dto.ProductId,
                OfficialPriceLbp = dto.OfficialPriceLbp,
                PromoPriceLbp = dto.PromoPriceLbp,
                PromoEndsAt = dto.PromoEndsAt,
                IsInStock = dto.IsInStock,
                IsPromotion = dto.IsPromotion,
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
            return MapToDto(item);
        }

        public async Task<CatalogItemDto?> UpdateAsync(Guid id, UpdateCatalogItemDto dto, Guid? userId)
        {
            var item = await _context.StoreCatalogItems
                .Include(c => c.Product)
                .Include(c => c.Store)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (item == null) return null;

            var previousPrice = item.IsPromotion ? item.PromoPriceLbp : item.OfficialPriceLbp;

            item.OfficialPriceLbp = dto.OfficialPriceLbp;
            item.PromoPriceLbp = dto.PromoPriceLbp;
            item.PromoEndsAt = dto.PromoEndsAt;
            item.IsInStock = dto.IsInStock;
            item.IsPromotion = dto.IsPromotion;
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
            return MapToDto(item);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var item = await _context.StoreCatalogItems.FindAsync(id);
            if (item == null) return false;

            _context.StoreCatalogItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
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
                    ChangedByName = a.ChangedByUser != null ? a.ChangedByUser.Name : "System",
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
                            Reason = "owner_update",
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
                            Reason = "owner_update",
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
                ProductBrand = item.Product?.Brand,
                ProductUnit = item.Product?.Unit,
                OfficialPriceLbp = item.OfficialPriceLbp,
                PromoPriceLbp = item.PromoPriceLbp,
                PromoEndsAt = item.PromoEndsAt,
                IsInStock = item.IsInStock,
                IsPromotion = item.IsPromotion,
                LastUpdatedAt = item.LastUpdatedAt
            };
        }
    }
}
