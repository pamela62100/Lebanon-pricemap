using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class ModerationCase
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid PriceSubmissionId { get; set; }

        [Required]
        [MaxLength(50)]
        public string CaseType { get; set; }

        public string Status { get; set; } = "pending";

        public string Severity { get; set; } = "medium";

        public string CaseNote { get; set; }

        public Guid? AssignedTo { get; set; }

        public Guid? ResolvedBy { get; set; }

        public DateTime? ResolvedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PriceSubmissionId")]
        public virtual PriceSubmission PriceSubmission { get; set; }

        [ForeignKey("AssignedTo")]
        public virtual User AssignedToUser { get; set; }

        [ForeignKey("ResolvedBy")]
        public virtual User ResolvedByUser { get; set; }
    }
}
