using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class ApprovalRequest
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid RequestedBy { get; set; }

        public Guid? ReviewedBy { get; set; }

        [Required]
        [MaxLength(100)]
        public string Action { get; set; }

        [Required]
        [MaxLength(255)]
        public string Label { get; set; }

        public string Payload { get; set; } = "{}";

        public string Status { get; set; } = "pending";

        public string ReviewNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ResolvedAt { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
