using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Models;
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

    /// <summary>
    /// Updates an existing product. Admin only.
    /// </summary>
    public async Task<bool> UpdateAsync(string id, UpdateProductRequest request)
    {
        if (!Guid.TryParse(id, out var guid)) return false;
        var product = await _db.Products.FindAsync(guid);
        if (product == null) return false;

        if (request.Name != null) product.Name = request.Name;
        if (request.NameAr != null) product.NameAr = request.NameAr;
        if (request.Description != null) product.Description = request.Description;
        if (request.Unit != null) product.Unit = request.Unit;
        if (request.Brand != null) product.Brand = request.Brand;
        if (request.Barcode != null) product.Barcode = request.Barcode;
        if (request.CategoryId.HasValue) product.CategoryId = request.CategoryId;
        product.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Archives (soft-deletes) a product so it no longer appears in the public catalog.
    /// </summary>
    public async Task<bool> ArchiveAsync(string id)
    {
        if (!Guid.TryParse(id, out var guid)) return false;
        var product = await _db.Products.FindAsync(guid);
        if (product == null) return false;

        product.IsArchived = true;
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// Creates a new master product in the global dictionary. Admin only.
    /// </summary>
    public async Task<ProductResponse> CreateAsync(CreateProductRequest request, Guid createdBy)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            NameAr = request.NameAr,
            Description = request.Description,
            Unit = request.Unit,
            Brand = request.Brand,
            Barcode = request.Barcode,
            CategoryId = request.CategoryId,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        // Reload with category for the response
        var loaded = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.Aliases)
            .FirstAsync(p => p.Id == product.Id);

        return new ProductResponse
        {
            Id = loaded.Id.ToString(),
            Name = loaded.Name,
            NameAr = loaded.NameAr,
            Category = loaded.Category != null ? loaded.Category.Name : null,
            Unit = loaded.Unit,
            Brand = loaded.Brand,
            Barcode = loaded.Barcode,
            UploadCount = loaded.UploadCount,
            IsArchived = loaded.IsArchived,
            Aliases = loaded.Aliases.Select(a => a.Alias).ToList()
        };
    }
}