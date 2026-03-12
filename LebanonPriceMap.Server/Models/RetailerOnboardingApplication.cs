using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class RetailerOnboardingApplication
    {
        [Key]
        public Guid Id { get; set; }

        public Guid? UserId { get; set; }

        public Guid? StoreId { get; set; }

        [Required]
        [MaxLength(150)]
        public string ContactName { get; set; }

        [Required]
        public string Email { get; set; }

        [MaxLength(50)]
        public string Phone { get; set; }

        [Required]
        [MaxLength(255)]
        public string ProposedStoreName { get; set; }

        [MaxLength(100)]
        public string City { get; set; }

        [MaxLength(100)]
        public string District { get; set; }

        public string AddressText { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

        public short CurrentStep { get; set; } = 1;

        public short TotalSteps { get; set; } = 5;

        public string Status { get; set; } = "pending";

        public string AdminNotes { get; set; }

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ReviewedAt { get; set; }

        public Guid? ReviewedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("ReviewedBy")]
        public virtual User ReviewedByUser { get; set; }
        
        public virtual ICollection<RetailerOnboardingDocument> Documents { get; set; } = new List<RetailerOnboardingDocument>();
    }
}
