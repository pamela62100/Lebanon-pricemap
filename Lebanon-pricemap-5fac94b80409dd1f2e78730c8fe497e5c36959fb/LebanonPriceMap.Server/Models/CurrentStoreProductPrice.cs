using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class CurrentStoreProductPrice
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StoreId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        public Guid? LatestSubmissionId { get; set; }

        public decimal CurrentPriceLbp { get; set; }

        [Required]
        public string Source { get; set; }

        public short ConfidenceScore { get; set; } = 50;

        public int ConfirmationCount { get; set; } = 0;
        
        [MaxLength(20)]
        public string TrustLevel { get; set; } = "medium";

        public bool IsVerified { get; set; } = false;

        public bool IsInStock { get; set; } = true;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [ForeignKey("LatestSubmissionId")]
        public virtual PriceSubmission LatestSubmission { get; set; }
    }
}
