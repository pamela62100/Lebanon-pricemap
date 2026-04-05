using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class PriceAnomaly
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StoreId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        public Guid? PriceSubmissionId { get; set; }

        [Required]
        public decimal OldPriceLbp { get; set; }

        [Required]
        public decimal NewPriceLbp { get; set; }

        [Required]
        public decimal ChangePercent { get; set; }

        public string Severity { get; set; } = "medium";

        public string Status { get; set; } = "active";

        public DateTime DetectedAt { get; set; } = DateTime.UtcNow;

        public Guid? InvestigatedBy { get; set; }

        public DateTime? InvestigatedAt { get; set; }

        public string ResolutionNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [ForeignKey("PriceSubmissionId")]
        public virtual PriceSubmission PriceSubmission { get; set; }

        [ForeignKey("InvestigatedBy")]
        public virtual User InvestigatedByUser { get; set; }
    }
}
