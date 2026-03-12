using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class PriceReport
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid PriceSubmissionId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string ReportType { get; set; }

        public string Note { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PriceSubmissionId")]
        public virtual PriceSubmission PriceSubmission { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
