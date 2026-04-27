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
    public DbSet<ProductAlias> ProductAliases { get; set; }
    public DbSet<StoreCatalogItem> StoreCatalogItems { get; set; }
    public DbSet<CatalogAuditEntry> CatalogAuditEntries { get; set; }
    public DbSet<CatalogDiscrepancyReport> CatalogDiscrepancyReports { get; set; }
    public DbSet<Alert> Alerts { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<FuelPrice> FuelPrices { get; set; }
    public DbSet<StationReport> StationReports { get; set; }
    public DbSet<StationReportConfirmation> StationReportConfirmations { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<AdminAuditLog> AdminAuditLogs { get; set; }
    public DbSet<ApprovalRequest> ApprovalRequests { get; set; }
    public DbSet<MissingProductRequest> MissingProductRequests { get; set; }
    public DbSet<ModerationCase> ModerationCases { get; set; }
    public DbSet<PriceAnomaly> PriceAnomalies { get; set; }
    public DbSet<PriceConfirmation> PriceConfirmations { get; set; }
    public DbSet<PriceFeedback> PriceFeedbacks { get; set; }
    public DbSet<PriceNote> PriceNotes { get; set; }
    public DbSet<PriceReport> PriceReports { get; set; }
    public DbSet<Region> Regions { get; set; }
    public DbSet<District> Districts { get; set; }
    public DbSet<PriceAlertRegion> PriceAlertRegions { get; set; }
    public DbSet<RetailerOnboardingApplication> RetailerOnboardingApplications { get; set; }
    public DbSet<RetailerOnboardingDocument> RetailerOnboardingDocuments { get; set; }
    public DbSet<StorePromotion> StorePromotions { get; set; }
    public DbSet<StoreSyncRun> StoreSyncRuns { get; set; }
    public DbSet<StoreSyncItem> StoreSyncItems { get; set; }
    public DbSet<SystemBroadcast> SystemBroadcasts { get; set; }
    public DbSet<SystemSetting> SystemSettings { get; set; }
    public DbSet<StoreApiKey> StoreApiKeys { get; set; }
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PasswordResetToken>(entity =>
        {
            entity.ToTable("password_reset_tokens");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.TokenHash).HasColumnName("token_hash");
            entity.Property(e => e.ExpiresAt).HasColumnName("expires_at");
            entity.Property(e => e.UsedAt).HasColumnName("used_at");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(e => e.TokenHash).IsUnique();
        });

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
            entity.Property(e => e.UploadCount).HasColumnName("upload_count");
entity.Property(e => e.IsArchived).HasColumnName("is_archived");
entity.Property(e => e.CreatedBy).HasColumnName("created_by");
entity.Property(e => e.MergedIntoProductId).HasColumnName("merged_into_product_id");
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
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.OwnerUserId).HasColumnName("owner_user_id");
            entity.Property(e => e.LogoUrl).HasColumnName("logo_url");
            entity.Property(e => e.AddressLine1).HasColumnName("address_line_1");
            entity.Property(e => e.CoverImageUrl).HasColumnName("cover_image_url");
            entity.Property(e => e.SyncMethod).HasColumnName("sync_method");
            entity.Property(e => e.ApiEnabled).HasColumnName("api_enabled");
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
    entity.Property(e => e.CreatedAt).HasColumnName("created_at");
    entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
});
        // 5. Map "CurrentStoreProductPrice" model to "current_store_product_prices" table
        modelBuilder.Entity<CurrentStoreProductPrice>(entity =>
        {
            entity.ToTable("current_store_product_prices");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.LatestSubmissionId).HasColumnName("latest_submission_id");
            entity.Property(e => e.CurrentPriceLbp).HasColumnName("current_price_lbp");
            entity.Property(e => e.Source).HasColumnName("source");
            entity.Property(e => e.ConfidenceScore).HasColumnName("confidence_score");
            entity.Property(e => e.ConfirmationCount).HasColumnName("confirmation_count");
            entity.Property(e => e.TrustLevel).HasColumnName("trust_level");
            entity.Property(e => e.IsVerified).HasColumnName("is_verified");
            entity.Property(e => e.IsInStock).HasColumnName("is_in_stock");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.HasOne(e => e.Store).WithMany().HasForeignKey(e => e.StoreId);
            entity.HasOne(e => e.Product).WithMany().HasForeignKey(e => e.ProductId);
            entity.HasOne(e => e.LatestSubmission).WithMany().HasForeignKey(e => e.LatestSubmissionId);
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
            entity.Property(e => e.SubmissionStatus).HasColumnName("submission_status");
            entity.Property(e => e.Source).HasColumnName("source");
            entity.Property(e => e.IsPromotion).HasColumnName("is_promotion");
            entity.Property(e => e.PromoEndsAt).HasColumnName("promo_ends_at");
            entity.Property(e => e.ReceiptImageUrl).HasColumnName("receipt_image_url");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.Upvotes).HasColumnName("upvotes");
            entity.Property(e => e.Downvotes).HasColumnName("downvotes");
            entity.Property(e => e.SubmitterTrustScore).HasColumnName("submitter_trust_score");
            entity.Property(e => e.IsDisputed).HasColumnName("is_disputed");
            entity.Property(e => e.DisputeReason).HasColumnName("dispute_reason");
            entity.Property(e => e.OcrStoreName).HasColumnName("ocr_store_name");
            entity.Property(e => e.OcrProductName).HasColumnName("ocr_product_name");
            entity.Property(e => e.OcrBarcode).HasColumnName("ocr_barcode");
            entity.Property(e => e.OcrPriceLbp).HasColumnName("ocr_price_lbp");
            entity.Property(e => e.OcrPayload).HasColumnName("ocr_payload");
            entity.Property(e => e.MismatchDetected).HasColumnName("mismatch_detected");
            entity.Property(e => e.MismatchReason).HasColumnName("mismatch_reason");
            entity.Property(e => e.VerifiedBy).HasColumnName("verified_by");
            entity.Property(e => e.VerifiedAt).HasColumnName("verified_at");
            entity.Property(e => e.RejectedBy).HasColumnName("rejected_by");
            entity.Property(e => e.RejectedAt).HasColumnName("rejected_at");
            entity.Property(e => e.SupersededBy).HasColumnName("superseded_by");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.HasOne(e => e.Store).WithMany().HasForeignKey(e => e.StoreId);
            entity.HasOne(e => e.Product).WithMany().HasForeignKey(e => e.ProductId);
            entity.HasOne(e => e.SubmittedByUser).WithMany().HasForeignKey(e => e.SubmittedBy);
            entity.HasOne(e => e.VerifiedByUser).WithMany().HasForeignKey(e => e.VerifiedBy);
            entity.HasOne(e => e.RejectedByUser).WithMany().HasForeignKey(e => e.RejectedBy);
            entity.HasOne(e => e.SupersededBySubmission).WithMany().HasForeignKey(e => e.SupersededBy);
        });
        modelBuilder.Entity<ProductAlias>(entity =>
{
    entity.ToTable("product_aliases");
    entity.Property(e => e.Id).HasColumnName("id");
    entity.Property(e => e.ProductId).HasColumnName("product_id");
    entity.Property(e => e.Alias).HasColumnName("alias");
    entity.Property(e => e.LanguageCode).HasColumnName("language_code");
    entity.Property(e => e.CreatedAt).HasColumnName("created_at");
});

        // 7. Map "StoreCatalogItem" model to "store_catalog_items" table
        modelBuilder.Entity<StoreCatalogItem>(entity =>
        {
            entity.ToTable("store_catalog_items");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.OfficialPriceLbp).HasColumnName("official_price_lbp");
            entity.Property(e => e.PromoPriceLbp).HasColumnName("promo_price_lbp");
            entity.Property(e => e.PromoEndsAt).HasColumnName("promo_ends_at");
            entity.Property(e => e.IsInStock).HasColumnName("is_in_stock");
            entity.Property(e => e.IsPromotion).HasColumnName("is_promotion");
            entity.Property(e => e.LastUpdatedBy).HasColumnName("last_updated_by");
            entity.Property(e => e.LastUpdatedAt).HasColumnName("last_updated_at");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            
            entity.HasIndex(e => new { e.StoreId, e.ProductId }).IsUnique();
        });

        // 8. Map "CatalogAuditEntry" model to "catalog_audit_entries" table
        modelBuilder.Entity<CatalogAuditEntry>(entity =>
        {
            entity.ToTable("catalog_audit_entries");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CatalogItemId).HasColumnName("catalog_item_id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.ChangedBy).HasColumnName("changed_by");
            entity.Property(e => e.Reason).HasColumnType("catalog_change_reason").HasColumnName("reason");
            entity.Property(e => e.RelatedReportId).HasColumnName("related_report_id");
            entity.Property(e => e.PreviousPriceLbp).HasColumnName("previous_price_lbp");
            entity.Property(e => e.NewPriceLbp).HasColumnName("new_price_lbp");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });
            modelBuilder.Entity<Alert>(entity =>
{
    entity.ToTable("price_alerts");

    entity.Property(e => e.Id).HasColumnName("id");
    entity.Property(e => e.UserId).HasColumnName("user_id");
    entity.Property(e => e.ProductId).HasColumnName("product_id");
    entity.Property(e => e.TargetPriceLbp).HasColumnName("threshold_lbp");
    entity.Property(e => e.VerifiedOnly).HasColumnName("verified_only");

    entity.Property(e => e.Status)
        .HasColumnName("status")
        .HasColumnType("alert_status");

    entity.Property(e => e.CreatedAt).HasColumnName("created_at");
    entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

    entity.HasOne(e => e.User)
        .WithMany()
        .HasForeignKey(e => e.UserId);

    entity.HasOne(e => e.Product)
        .WithMany()
        .HasForeignKey(e => e.ProductId);
});
// 9. Map "Notification" model to "notifications" table
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("notifications");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.RelatedPriceEntryId).HasColumnName("related_price_entry_id");
            entity.Property(e => e.RelatedStoreId).HasColumnName("related_store_id");
            entity.Property(e => e.RelatedProductId).HasColumnName("related_product_id");
            entity.Property(e => e.RelatedAlertId).HasColumnName("related_alert_id");
            entity.Property(e => e.IsRead).HasColumnName("is_read");
            entity.Property(e => e.ReadAt).HasColumnName("read_at");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");

            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
            entity.HasOne(e => e.RelatedAlert).WithMany().HasForeignKey(e => e.RelatedAlertId);
        });

// 10. Map "CatalogDiscrepancyReport" model to "catalog_discrepancy_reports" table
        modelBuilder.Entity<CatalogDiscrepancyReport>(entity =>
        {
            entity.ToTable("catalog_discrepancy_reports");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CatalogItemId).HasColumnName("catalog_item_id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.ReportedBy).HasColumnName("reported_by");
            entity.Property(e => e.ReporterTrustScore).HasColumnName("reporter_trust_score");
            entity.Property(e => e.ReportType).HasColumnName("report_type");
            entity.Property(e => e.ObservedPriceLbp).HasColumnName("observed_price_lbp");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.ApprovedNewPriceLbp).HasColumnName("approved_new_price_lbp");
            entity.Property(e => e.ReviewNote).HasColumnName("review_note");
            entity.Property(e => e.ReviewedBy).HasColumnName("reviewed_by");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.ResolvedAt).HasColumnName("resolved_at");
        });

        // 11. Map "FuelPrice" model to "fuel_prices" table
        modelBuilder.Entity<FuelPrice>(entity =>
        {
            entity.ToTable("fuel_prices");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FuelType).HasColumnName("fuel_type");
            entity.Property(e => e.OfficialPriceLbp).HasColumnName("official_price_lbp");
            entity.Property(e => e.ReportedPriceLbp).HasColumnName("reported_price_lbp");
            entity.Property(e => e.EffectiveFrom).HasColumnName("effective_from");
            entity.Property(e => e.EffectiveTo).HasColumnName("effective_to");
            entity.Property(e => e.Source).HasColumnName("source");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        // 12. Map "StationReport" model to "station_reports" table
        modelBuilder.Entity<StationReport>(entity =>
        {
            entity.ToTable("station_reports");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.FuelType).HasColumnName("fuel_type");
            entity.Property(e => e.IsOpen).HasColumnName("is_open");
            entity.Property(e => e.HasStock).HasColumnName("has_stock");
            entity.Property(e => e.QueueMinutes).HasColumnName("queue_minutes");
            entity.Property(e => e.QueueDepth).HasColumnName("queue_depth");
            entity.Property(e => e.IsRationed).HasColumnName("is_rationed");
            entity.Property(e => e.LimitAmountLbp).HasColumnName("limit_amount_lbp");
            entity.Property(e => e.ReportedBy).HasColumnName("reported_by");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        // 13. Map "StationReportConfirmation" to "station_report_confirmations" table
        modelBuilder.Entity<StationReportConfirmation>(entity =>
        {
            entity.ToTable("station_report_confirmations");
            entity.HasKey(e => new { e.ReportId, e.UserId });
            entity.Property(e => e.ReportId).HasColumnName("report_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
        });

        // 14. Map "Cart" model to "carts" table
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.ToTable("carts");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasIndex(e => e.UserId).IsUnique();
        });

        // 15. Map "CartItem" model to "cart_items" table
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.ToTable("cart_items");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CartId).HasColumnName("cart_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        // 16. AdminAuditLog
        modelBuilder.Entity<AdminAuditLog>(entity =>
        {
            entity.ToTable("admin_audit_logs");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PerformedBy).HasColumnName("performed_by");
            entity.Property(e => e.Action).HasColumnName("action");
            entity.Property(e => e.TargetUserId).HasColumnName("target_user_id");
            entity.Property(e => e.TargetPriceEntryId).HasColumnName("target_price_entry_id");
            entity.Property(e => e.TargetProductId).HasColumnName("target_product_id");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.Metadata).HasColumnName("metadata");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasOne(e => e.PerformedByUser).WithMany().HasForeignKey(e => e.PerformedBy);
            entity.HasOne(e => e.TargetUser).WithMany().HasForeignKey(e => e.TargetUserId);
            entity.HasOne(e => e.TargetProduct).WithMany().HasForeignKey(e => e.TargetProductId);
        });

        // 17. ApprovalRequest
        modelBuilder.Entity<ApprovalRequest>(entity =>
        {
            entity.ToTable("approval_requests");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RequestedBy).HasColumnName("requested_by");
            entity.Property(e => e.ReviewedBy).HasColumnName("reviewed_by");
            entity.Property(e => e.Action).HasColumnName("action");
            entity.Property(e => e.Label).HasColumnName("label");
            entity.Property(e => e.Payload).HasColumnName("payload");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.ReviewNote).HasColumnName("review_note");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.ResolvedAt).HasColumnName("resolved_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        // 18. MissingProductRequest
        modelBuilder.Entity<MissingProductRequest>(entity =>
        {
            entity.ToTable("missing_product_requests");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.ProductNameFreetext).HasColumnName("product_name_freetext");
            entity.Property(e => e.RequestedBy).HasColumnName("requested_by");
            entity.Property(e => e.RequesterTrustScore).HasColumnName("requester_trust_score");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.ReviewNote).HasColumnName("review_note");
            entity.Property(e => e.ReviewedBy).HasColumnName("reviewed_by");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.ResolvedAt).HasColumnName("resolved_at");
            entity.HasOne(e => e.Store).WithMany().HasForeignKey(e => e.StoreId);
            entity.HasOne(e => e.Product).WithMany().HasForeignKey(e => e.ProductId);
            entity.HasOne(e => e.RequestedByUser).WithMany().HasForeignKey(e => e.RequestedBy);
            entity.HasOne(e => e.ReviewedByUser).WithMany().HasForeignKey(e => e.ReviewedBy);
        });

        // 19. ModerationCase
        modelBuilder.Entity<ModerationCase>(entity =>
        {
            entity.ToTable("moderation_cases");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PriceSubmissionId).HasColumnName("price_submission_id");
            entity.Property(e => e.CaseType).HasColumnName("case_type");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Severity).HasColumnName("severity");
            entity.Property(e => e.CaseNote).HasColumnName("case_note");
            entity.Property(e => e.AssignedTo).HasColumnName("assigned_to");
            entity.Property(e => e.ResolvedBy).HasColumnName("resolved_by");
            entity.Property(e => e.ResolvedAt).HasColumnName("resolved_at");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.HasOne(e => e.PriceSubmission).WithMany().HasForeignKey(e => e.PriceSubmissionId);
            entity.HasOne(e => e.AssignedToUser).WithMany().HasForeignKey(e => e.AssignedTo);
            entity.HasOne(e => e.ResolvedByUser).WithMany().HasForeignKey(e => e.ResolvedBy);
        });

        // 20. PriceAnomaly
        modelBuilder.Entity<PriceAnomaly>(entity =>
        {
            entity.ToTable("price_anomalies");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.PriceSubmissionId).HasColumnName("price_submission_id");
            entity.Property(e => e.OldPriceLbp).HasColumnName("old_price_lbp");
            entity.Property(e => e.NewPriceLbp).HasColumnName("new_price_lbp");
            entity.Property(e => e.ChangePercent).HasColumnName("change_percent");
            entity.Property(e => e.Severity).HasColumnName("severity");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.DetectedAt).HasColumnName("detected_at");
            entity.Property(e => e.InvestigatedBy).HasColumnName("investigated_by");
            entity.Property(e => e.InvestigatedAt).HasColumnName("investigated_at");
            entity.Property(e => e.ResolutionNote).HasColumnName("resolution_note");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.HasOne(e => e.Store).WithMany().HasForeignKey(e => e.StoreId);
            entity.HasOne(e => e.Product).WithMany().HasForeignKey(e => e.ProductId);
            entity.HasOne(e => e.PriceSubmission).WithMany().HasForeignKey(e => e.PriceSubmissionId);
            entity.HasOne(e => e.InvestigatedByUser).WithMany().HasForeignKey(e => e.InvestigatedBy);
        });

        // 21. PriceConfirmation
        modelBuilder.Entity<PriceConfirmation>(entity =>
        {
            entity.ToTable("price_confirmations");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PriceSubmissionId).HasColumnName("price_submission_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasOne(e => e.PriceSubmission).WithMany().HasForeignKey(e => e.PriceSubmissionId);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
        });

        // 22. PriceFeedback
        modelBuilder.Entity<PriceFeedback>(entity =>
        {
            entity.ToTable("price_feedback");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PriceEntryId).HasColumnName("price_entry_id");
            entity.Property(e => e.SubmittedBy).HasColumnName("submitted_by");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasOne(e => e.PriceEntry).WithMany().HasForeignKey(e => e.PriceEntryId);
            entity.HasOne(e => e.SubmittedByUser).WithMany().HasForeignKey(e => e.SubmittedBy);
        });

        // 23. PriceNote
        modelBuilder.Entity<PriceNote>(entity =>
        {
            entity.ToTable("price_notes");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PriceSubmissionId).HasColumnName("price_submission_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasOne(e => e.PriceSubmission).WithMany().HasForeignKey(e => e.PriceSubmissionId);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
        });

        // 24. PriceReport
        modelBuilder.Entity<PriceReport>(entity =>
        {
            entity.ToTable("price_reports");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PriceSubmissionId).HasColumnName("price_submission_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.ReportType).HasColumnName("report_type");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasOne(e => e.PriceSubmission).WithMany().HasForeignKey(e => e.PriceSubmissionId);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
        });

        // 25. Region
        modelBuilder.Entity<Region>(entity =>
        {
            entity.ToTable("regions");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        // 26. District
        modelBuilder.Entity<District>(entity =>
        {
            entity.ToTable("districts");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RegionId).HasColumnName("region_id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasOne(e => e.Region).WithMany(r => r.Districts).HasForeignKey(e => e.RegionId);
        });

        // 27. PriceAlertRegion
        modelBuilder.Entity<PriceAlertRegion>(entity =>
        {
            entity.ToTable("price_alert_regions");
            entity.HasKey(e => new { e.AlertId, e.RegionId });
            entity.Property(e => e.AlertId).HasColumnName("alert_id");
            entity.Property(e => e.RegionId).HasColumnName("region_id");
            entity.HasOne(e => e.Alert).WithMany().HasForeignKey(e => e.AlertId);
            entity.HasOne(e => e.Region).WithMany().HasForeignKey(e => e.RegionId);
        });

        // 28. RetailerOnboardingApplication
        modelBuilder.Entity<RetailerOnboardingApplication>(entity =>
        {
            entity.ToTable("retailer_onboarding_applications");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ContactName).HasColumnName("contact_name");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Phone).HasColumnName("phone");
            entity.Property(e => e.ProposedStoreName).HasColumnName("proposed_store_name");
            entity.Property(e => e.City).HasColumnName("city");
            entity.Property(e => e.District).HasColumnName("district");
            entity.Property(e => e.AddressText).HasColumnName("address_text");
            entity.Property(e => e.Latitude).HasColumnName("latitude");
            entity.Property(e => e.Longitude).HasColumnName("longitude");
            entity.Property(e => e.CurrentStep).HasColumnName("current_step");
            entity.Property(e => e.TotalSteps).HasColumnName("total_steps");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.AdminNotes).HasColumnName("admin_notes");
            entity.Property(e => e.AppliedAt).HasColumnName("applied_at");
            entity.Property(e => e.ReviewedAt).HasColumnName("reviewed_at");
            entity.Property(e => e.ReviewedBy).HasColumnName("reviewed_by");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
            entity.HasOne(e => e.Store).WithMany().HasForeignKey(e => e.StoreId);
            entity.HasOne(e => e.ReviewedByUser).WithMany().HasForeignKey(e => e.ReviewedBy);
        });

        // 29. RetailerOnboardingDocument
        modelBuilder.Entity<RetailerOnboardingDocument>(entity =>
        {
            entity.ToTable("retailer_onboarding_documents");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ApplicationId).HasColumnName("application_id");
            entity.Property(e => e.DocumentType).HasColumnName("document_type");
            entity.Property(e => e.FileUrl).HasColumnName("file_url");
            entity.Property(e => e.UploadedAt).HasColumnName("uploaded_at");
            entity.HasOne(e => e.Application).WithMany(a => a.Documents).HasForeignKey(e => e.ApplicationId);
        });

        // 30. StorePromotion
        modelBuilder.Entity<StorePromotion>(entity =>
        {
            entity.ToTable("store_promotions");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.DiscountPercent).HasColumnName("discount_percent");
            entity.Property(e => e.OriginalPriceLbp).HasColumnName("original_price_lbp");
            entity.Property(e => e.PromoPriceLbp).HasColumnName("promo_price_lbp");
            entity.Property(e => e.StartsAt).HasColumnName("starts_at");
            entity.Property(e => e.EndsAt).HasColumnName("ends_at");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.HasOne(e => e.Store).WithMany().HasForeignKey(e => e.StoreId);
            entity.HasOne(e => e.Product).WithMany().HasForeignKey(e => e.ProductId);
            entity.HasOne(e => e.CreatedByUser).WithMany().HasForeignKey(e => e.CreatedBy);
        });

        // 31. StoreSyncRun
        modelBuilder.Entity<StoreSyncRun>(entity =>
        {
            entity.ToTable("store_sync_runs");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.Method).HasColumnName("method");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.RecordsReceived).HasColumnName("records_received");
            entity.Property(e => e.RecordsProcessed).HasColumnName("records_processed");
            entity.Property(e => e.RecordsFailed).HasColumnName("records_failed");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.StartedAt).HasColumnName("started_at");
            entity.Property(e => e.FinishedAt).HasColumnName("finished_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.HasOne(e => e.Store).WithMany().HasForeignKey(e => e.StoreId);
            entity.HasOne(e => e.CreatedByUser).WithMany().HasForeignKey(e => e.CreatedBy);
        });

        // 32. StoreSyncItem
        modelBuilder.Entity<StoreSyncItem>(entity =>
        {
            entity.ToTable("store_sync_items");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SyncRunId).HasColumnName("sync_run_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.RawName).HasColumnName("raw_name");
            entity.Property(e => e.RawBarcode).HasColumnName("raw_barcode");
            entity.Property(e => e.RawPrice).HasColumnName("raw_price");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.FailReason).HasColumnName("fail_reason");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasOne(e => e.SyncRun).WithMany(r => r.Items).HasForeignKey(e => e.SyncRunId);
            entity.HasOne(e => e.Product).WithMany().HasForeignKey(e => e.ProductId);
        });

        // 33. SystemBroadcast
        modelBuilder.Entity<SystemBroadcast>(entity =>
        {
            entity.ToTable("system_broadcasts");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.Severity).HasColumnName("severity");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.StartsAt).HasColumnName("starts_at");
            entity.Property(e => e.EndsAt).HasColumnName("ends_at");
            entity.Property(e => e.Priority).HasColumnName("priority");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        // 34. SystemSetting
        modelBuilder.Entity<SystemSetting>(entity =>
        {
            entity.ToTable("system_settings");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Key).HasColumnName("key");
            entity.Property(e => e.Value).HasColumnName("value");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.HasOne(e => e.UpdatedByUser).WithMany().HasForeignKey(e => e.UpdatedBy);
        });

        // 35. StoreApiKey
        modelBuilder.Entity<StoreApiKey>(entity =>
        {
            entity.ToTable("store_api_keys");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.StoreId).HasColumnName("store_id");
            entity.Property(e => e.ApiKeyHash).HasColumnName("api_key_hash");
            entity.Property(e => e.KeyLabel).HasColumnName("key_label");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.LastUsedAt).HasColumnName("last_used_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.RevokedAt).HasColumnName("revoked_at");
            entity.HasOne(e => e.Store).WithMany().HasForeignKey(e => e.StoreId);
            entity.HasOne(e => e.CreatedByUser).WithMany().HasForeignKey(e => e.CreatedBy);
        });
    }

}