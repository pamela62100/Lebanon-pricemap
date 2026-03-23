using System;
using System.ComponentModel.DataAnnotations;

namespace LebanonPriceMap.Server.DTOs
{
    public class CatalogItemDto
    {
        public Guid Id { get; set; }
        public Guid StoreId { get; set; }
        public string StoreName { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductBrand { get; set; }
        public string ProductUnit { get; set; }
        public decimal? OfficialPriceLbp { get; set; }
        public decimal? PromoPriceLbp { get; set; }
        public DateTime? PromoEndsAt { get; set; }
        public bool IsInStock { get; set; }
        public bool IsPromotion { get; set; }
        public DateTime LastUpdatedAt { get; set; }
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
        public string Reason { get; set; } = "owner_update";
        public string Note { get; set; }
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
        public string Reason { get; set; } = "owner_update";
        public string Note { get; set; }
    }

    public class CatalogAuditDto
    {
        public Guid Id { get; set; }
        public Guid CatalogItemId { get; set; }
        public Guid? ChangedBy { get; set; }
        public string ChangedByName { get; set; }
        public string Reason { get; set; }
        public decimal? PreviousPriceLbp { get; set; }
        public decimal? NewPriceLbp { get; set; }
        public string Note { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
