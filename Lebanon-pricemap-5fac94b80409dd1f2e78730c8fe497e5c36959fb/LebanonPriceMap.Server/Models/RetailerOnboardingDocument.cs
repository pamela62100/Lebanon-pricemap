using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class RetailerOnboardingDocument
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ApplicationId { get; set; }

        [Required]
        [MaxLength(50)]
        public string DocumentType { get; set; }

        [Required]
        public string FileUrl { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ApplicationId")]
        public virtual RetailerOnboardingApplication Application { get; set; }
    }
}
