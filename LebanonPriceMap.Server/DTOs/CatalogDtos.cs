using System;
using System.ComponentModel.DataAnnotations;

using LebanonPriceMap.Server.Models;

namespace LebanonPriceMap.Server.DTOs
{
    public class CatalogItemDto
    {
        public Guid Id { get; set; }
        public Guid StoreId { get; set; }
        public string StoreName { get; set; } = string.Empty;
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductBrand { get; set; } = string.Empty;
        public string ProductUnit { get; set; } = string.Empty;
        public decimal? OfficialPriceLbp { get; set; }
        public decimal? PromoPriceLbp { get; set; }
        public DateTime? PromoEndsAt { get; set; }
        public bool IsInStock { get; set; }
        public bool IsPromotion { get; set; }
        public decimal? DiscountPercent { get; set; }
        public DateTime LastUpdatedAt { get; set; }

        // Added to match frontend expectations
        public ProductDetailsDto? Product { get; set; }
    }

    public class ProductDetailsDto
    {
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
    }

    public class CreateCatalogItemDto
    {
        [Required]
        public Guid StoreId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        public decimal? OfficialPriceLbp { get; set; }
        public decimal? PromoPriceLbp { get; set; }
        public DateTime? PromoEndsAt { get; set; }
        public bool IsInStock { get; set; } = true;
        public bool IsPromotion { get; set; } = false;
        
        // Audit information
        public CatalogChangeReason Reason { get; set; } = CatalogChangeReason.owner_update;
        public string Note { get; set; } = string.Empty;
    }

    public class UpdateCatalogItemDto
    {
        public decimal? OfficialPriceLbp { get; set; }
        public decimal? PromoPriceLbp { get; set; }
        public DateTime? PromoEndsAt { get; set; }
        public bool IsInStock { get; set; }
        public bool IsPromotion { get; set; }
        
        // Audit information
        [Required]
        public CatalogChangeReason Reason { get; set; } = CatalogChangeReason.owner_update;
        public string Note { get; set; } = string.Empty;
    }

    public class CatalogAuditDto
    {
        public Guid Id { get; set; }
        public Guid CatalogItemId { get; set; }
        public Guid? ChangedBy { get; set; }
        public string ChangedByName { get; set; } = string.Empty;
        public CatalogChangeReason Reason { get; set; }
        public decimal? PreviousPriceLbp { get; set; }
        public decimal? NewPriceLbp { get; set; }
        public string Note { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
