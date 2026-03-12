using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class CatalogDiscrepancyReport
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid CatalogItemId { get; set; }

        [Required]
        public Guid StoreId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        public Guid? ReportedBy { get; set; }

        public short? ReporterTrustScore { get; set; }

        [Required]
        public string ReportType { get; set; }

        public decimal? ObservedPriceLbp { get; set; }

        public string Note { get; set; }

        public string Status { get; set; } = "pending";

        public decimal? ApprovedNewPriceLbp { get; set; }

        public string ReviewNote { get; set; }

        public Guid? ReviewedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ResolvedAt { get; set; }

        // Navigation properties
        [ForeignKey("CatalogItemId")]
        public virtual StoreCatalogItem CatalogItem { get; set; }

        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [ForeignKey("ReportedBy")]
        public virtual User ReportedByUser { get; set; }

        [ForeignKey("ReviewedBy")]
        public virtual User ReviewedByUser { get; set; }
    }
}
