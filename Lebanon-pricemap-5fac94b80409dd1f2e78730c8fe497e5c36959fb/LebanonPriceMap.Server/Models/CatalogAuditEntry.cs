using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class CatalogAuditEntry
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid CatalogItemId { get; set; }

        [Required]
        public Guid StoreId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        public Guid? ChangedBy { get; set; }

        [Required]
        public string Reason { get; set; }

        public Guid? RelatedReportId { get; set; }

        public decimal? PreviousPriceLbp { get; set; }

        public decimal? NewPriceLbp { get; set; }

        public string Note { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("CatalogItemId")]
        public virtual StoreCatalogItem CatalogItem { get; set; }

        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [ForeignKey("ChangedBy")]
        public virtual User ChangedByUser { get; set; }

        [ForeignKey("RelatedReportId")]
        public virtual CatalogDiscrepancyReport RelatedReport { get; set; }
    }
}
