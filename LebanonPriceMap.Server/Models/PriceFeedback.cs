using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class PriceFeedback
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid PriceEntryId { get; set; }

        public Guid? SubmittedBy { get; set; }

        [Required]
        public string Type { get; set; }

        public string Note { get; set; }

        public string Status { get; set; } = "open";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PriceEntryId")]
        public virtual PriceSubmission PriceEntry { get; set; }

        [ForeignKey("SubmittedBy")]
        public virtual User SubmittedByUser { get; set; }
    }
}
