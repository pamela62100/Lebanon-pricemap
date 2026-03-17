using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Services;

public class ProductService
{
    private readonly AppDbContext _db;

    public ProductService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<ProductResponse>> GetAllAsync(string? query, string? category)
    {
        var q = _db.Products
            .Include(p => p.Category)
            .Include(p => p.Aliases)
            .AsQueryable();

        if (!string.IsNullOrEmpty(query))
        {
            var search = query.ToLower();
            q = q.Where(p =>
                p.Name.ToLower().Contains(search) ||
                (p.NameAr != null && p.NameAr.ToLower().Contains(search)) ||
                p.Aliases.Any(a => a.Alias.ToLower().Contains(search)));
        }

        if (!string.IsNullOrEmpty(category) && category != "All")
        {
            q = q.Where(p => p.Category != null && p.Category.Name == category);
        }

        q = q.Where(p => !p.IsArchived).OrderBy(p => p.Name);

        return await q.Select(p => new ProductResponse
        {
            Id = p.Id.ToString(),
            Name = p.Name,
            NameAr = p.NameAr,
            Category = p.Category != null ? p.Category.Name : null,
            Unit = p.Unit,
            Brand = p.Brand,
            Barcode = p.Barcode,
            UploadCount = p.UploadCount,
            IsArchived = p.IsArchived,
            Aliases = p.Aliases.Select(a => a.Alias).ToList()
        }).ToListAsync();
    }

    public async Task<ProductResponse?> GetByIdAsync(string id)
    {
        if (!Guid.TryParse(id, out var guid)) return null;

        var p = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.Aliases)
            .FirstOrDefaultAsync(p => p.Id == guid);

        if (p == null) return null;

        return new ProductResponse
        {
            Id = p.Id.ToString(),
            Name = p.Name,
            NameAr = p.NameAr,
            Category = p.Category != null ? p.Category.Name : null,
            Unit = p.Unit,
            Brand = p.Brand,
            Barcode = p.Barcode,
            UploadCount = p.UploadCount,
            IsArchived = p.IsArchived,
            Aliases = p.Aliases.Select(a => a.Alias).ToList()
        };
    }

    public async Task<ProductResponse?> GetByBarcodeAsync(string barcode)
    {
        var p = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.Aliases)
            .FirstOrDefaultAsync(p => p.Barcode == barcode);

        if (p == null) return null;

        return new ProductResponse
        {
            Id = p.Id.ToString(),
            Name = p.Name,
            NameAr = p.NameAr,
            Category = p.Category != null ? p.Category.Name : null,
            Unit = p.Unit,
            Brand = p.Brand,
            Barcode = p.Barcode,
            UploadCount = p.UploadCount,
            IsArchived = p.IsArchived,
            Aliases = p.Aliases.Select(a => a.Alias).ToList()
        };
    }
}