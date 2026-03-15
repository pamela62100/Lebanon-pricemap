using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class StoreCatalogItem
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StoreId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        public decimal? OfficialPriceLbp { get; set; }

        public decimal? PromoPriceLbp { get; set; }

        public DateTime? PromoEndsAt { get; set; }

        public bool IsInStock { get; set; } = true;

        public bool IsPromotion { get; set; } = false;

        public Guid? LastUpdatedBy { get; set; }

        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [ForeignKey("LastUpdatedBy")]
        public virtual User LastUpdatedByUser { get; set; }

        public virtual ICollection<CatalogDiscrepancyReport> DiscrepancyReports { get; set; } = new List<CatalogDiscrepancyReport>();
    }
}
