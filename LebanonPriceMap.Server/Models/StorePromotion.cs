using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class StorePromotion
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StoreId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [MaxLength(255)]
        public string Title { get; set; }

        public decimal? DiscountPercent { get; set; }

        public decimal? OriginalPriceLbp { get; set; }

        [Required]
        public decimal PromoPriceLbp { get; set; }

        public DateTime StartsAt { get; set; } = DateTime.UtcNow;

        public DateTime? EndsAt { get; set; }

        public string Status { get; set; } = "active";

        public Guid? CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User CreatedByUser { get; set; }
    }
}
