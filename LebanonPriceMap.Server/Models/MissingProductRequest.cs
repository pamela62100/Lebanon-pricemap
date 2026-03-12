using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class MissingProductRequest
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StoreId { get; set; }

        public Guid? ProductId { get; set; }

        [MaxLength(255)]
        public string ProductNameFreetext { get; set; }

        public Guid? RequestedBy { get; set; }

        public short? RequesterTrustScore { get; set; }

        public string Note { get; set; }

        public string Status { get; set; } = "pending";

        public string ReviewNote { get; set; }

        public Guid? ReviewedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ResolvedAt { get; set; }

        // Navigation properties
        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [ForeignKey("RequestedBy")]
        public virtual User RequestedByUser { get; set; }

        [ForeignKey("ReviewedBy")]
        public virtual User ReviewedByUser { get; set; }
    }
}
