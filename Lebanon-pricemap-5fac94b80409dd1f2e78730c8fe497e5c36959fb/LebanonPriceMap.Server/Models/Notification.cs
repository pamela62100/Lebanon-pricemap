using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public string Type { get; set; } = "system";

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public Guid? RelatedPriceEntryId { get; set; }

        public Guid? RelatedStoreId { get; set; }

        public Guid? RelatedProductId { get; set; }

        public Guid? RelatedAlertId { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime? ReadAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [ForeignKey("RelatedPriceEntryId")]
        public virtual PriceSubmission RelatedPriceEntry { get; set; }

        [ForeignKey("RelatedStoreId")]
        public virtual Store RelatedStore { get; set; }

        [ForeignKey("RelatedProductId")]
        public virtual Product RelatedProduct { get; set; }

        [ForeignKey("RelatedAlertId")]
        public virtual Alert? RelatedAlert { get; set; }
    }
}
