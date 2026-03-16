using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace LebanonPriceMap.Server.Data;

/// <summary>
/// The AppDbContext is the bridge between your C# code and the PostgreSQL database.
/// Every "DbSet" here represents a table in your DB.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Registered Tables
    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Store> Stores { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<CurrentStoreProductPrice> CurrentStoreProductPrices { get; set; }
    public DbSet<PriceSubmission> PriceSubmissions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 1. Map "User" model to "users" table
       modelBuilder.Entity<User>(entity =>
{
    entity.ToTable("users");
    entity.Property(e => e.Id).HasColumnName("id");
    entity.Property(e => e.Email).HasColumnName("email");
    entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
    entity.Property(e => e.Name).HasColumnName("name");
    entity.Property(e => e.Role).HasColumnName("role");
    entity.Property(e => e.Status).HasColumnName("status");
    entity.Property(e => e.AvatarInitials).HasColumnName("avatar_initials");
    entity.Property(e => e.City).HasColumnName("city");
    entity.Property(e => e.TrustScore).HasColumnName("trust_score");
    entity.Property(e => e.TrustLevel).HasColumnName("trust_level");
    entity.Property(e => e.UploadCount).HasColumnName("upload_count");
    entity.Property(e => e.VerifiedCount).HasColumnName("verified_count");
    entity.Property(e => e.JoinedAt).HasColumnName("joined_at");
    entity.Property(e => e.LastLoginAt).HasColumnName("last_login_at");
    entity.Property(e => e.CreatedAt).HasColumnName("created_at");
    entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
});

        // 2. Map "Product" model to "products" table
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.NameAr).HasColumnName("name_ar");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Unit).HasColumnName("unit");
            entity.Property(e => e.Brand).HasColumnName("brand");
            entity.Property(e => e.Barcode).HasColumnName("barcode");
            entity.Property(e => e.IsArchived).HasColumnName("is_archived");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        // 3. Map "Store" model to "stores" table
        modelBuilder.Entity<Store>(entity =>
        {
            entity.ToTable("stores");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Chain).HasColumnName("chain");
            entity.Property(e => e.City).HasColumnName("city");
            entity.Property(e => e.District).HasColumnName("district");
            entity.Property(e => e.Region).HasColumnName("region");
            entity.Property(e => e.Latitude).HasColumnName("latitude");
            entity.Property(e => e.Longitude).HasColumnName("longitude");
            entity.Property(e => e.TrustScore).HasColumnName("trust_score");
            entity.Property(e => e.IsVerifiedRetailer).HasColumnName("is_verified_retailer");
            entity.Property(e => e.PowerStatus).HasColumnName("power_status");
            entity.Property(e => e.InternalRateLbp).HasColumnName("internal_rate_lbp");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        // 4. Map "Category" model to "categories" table
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("categories");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.SortOrder).HasColumnName("sort_order");
        });

        // 5. Map "CurrentStoreProductPrice" model to "current_store_product_prices" table
        modelBuilder.Entity<CurrentStoreProductPrice>(entity =>
        {
            entity.ToTable("current_store_product_prices");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.CurrentPriceLbp).HasColumnName("current_price_lbp");
            entity.Property(e => e.Source).HasColumnName("source");
            entity.Property(e => e.ConfidenceScore).HasColumnName("confidence_score");
            entity.Property(e => e.IsVerified).HasColumnName("is_verified");
            entity.Property(e => e.IsInStock).HasColumnName("is_in_stock");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });
        
        // 6. Map "PriceSubmission" model (the community uploads)
        modelBuilder.Entity<PriceSubmission>(entity =>
        {
            entity.ToTable("price_submissions");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PriceLbp).HasColumnName("price_lbp");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.SubmittedBy).HasColumnName("submitted_by");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });
        
    }
}