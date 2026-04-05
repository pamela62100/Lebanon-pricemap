using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class AdminAuditLog
    {
        [Key]
        public Guid Id { get; set; }

        public Guid? PerformedBy { get; set; }

        [Required]
        public string Action { get; set; }

        public Guid? TargetUserId { get; set; }

        public Guid? TargetPriceEntryId { get; set; }

        public Guid? TargetProductId { get; set; }

        public string Note { get; set; }

        public string Metadata { get; set; } = "{}";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PerformedBy")]
        public virtual User PerformedByUser { get; set; }

        [ForeignKey("TargetUserId")]
        public virtual User TargetUser { get; set; }

        [ForeignKey("TargetPriceEntryId")]
        public virtual PriceSubmission TargetPriceEntry { get; set; }

        [ForeignKey("TargetProductId")]
        public virtual Product TargetProduct { get; set; }
    }
}