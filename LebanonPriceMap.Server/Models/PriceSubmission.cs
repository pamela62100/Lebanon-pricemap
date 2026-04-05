using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class PriceSubmission
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StoreId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        public Guid? SubmittedBy { get; set; }

        public string Source { get; set; } = "community";

        public string SubmissionStatus { get; set; } = "pending";

        [Required]
        public decimal PriceLbp { get; set; }

        public bool IsPromotion { get; set; } = false;

        public DateTime? PromoEndsAt { get; set; }

        public string ReceiptImageUrl { get; set; }

        public string Note { get; set; }

        public short? SubmitterTrustScore { get; set; }

        public int Upvotes { get; set; } = 0;

        public int Downvotes { get; set; } = 0;

        public bool IsDisputed { get; set; } = false;

        public string DisputeReason { get; set; }

        [MaxLength(255)]
        public string OcrStoreName { get; set; }

        [MaxLength(255)]
        public string OcrProductName { get; set; }

        [MaxLength(100)]
        public string OcrBarcode { get; set; }

        public decimal? OcrPriceLbp { get; set; }

        public string OcrPayload { get; set; }

        public bool MismatchDetected { get; set; } = false;

        public string MismatchReason { get; set; }

        public Guid? VerifiedBy { get; set; }

        public DateTime? VerifiedAt { get; set; }

        public Guid? RejectedBy { get; set; }

        public DateTime? RejectedAt { get; set; }

        public Guid? SupersededBy { get; set; }
        
        public int Upvotes { get; set; } = 0;
        public int Downvotes { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [ForeignKey("SubmittedBy")]
        public virtual User SubmittedByUser { get; set; }

        [ForeignKey("VerifiedBy")]
        public virtual User VerifiedByUser { get; set; }

        [ForeignKey("RejectedBy")]
        public virtual User RejectedByUser { get; set; }

        [ForeignKey("SupersededBy")]
        public virtual PriceSubmission SupersededBySubmission { get; set; }
    }
}
