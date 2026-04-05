using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class Store
    {
        [Key]
        public Guid Id { get; set; }

        public Guid? OwnerUserId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(150)]
        public string? Chain { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? District { get; set; }

        [MaxLength(100)]
        public string? Region { get; set; }

        public string? AddressLine1 { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

        public string? LogoUrl { get; set; }

        public string? CoverImageUrl { get; set; }

        public short TrustScore { get; set; } = 50;

        public string Status { get; set; } = "pending";

        public bool IsVerifiedRetailer { get; set; } = false;

        public string PowerStatus { get; set; } = "stable";

        public decimal? InternalRateLbp { get; set; }

        public string SyncMethod { get; set; } = "manual";

        public bool ApiEnabled { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("OwnerUserId")]
        public virtual User Owner { get; set; }

        public virtual ICollection<StoreApiKey> ApiKeys { get; set; } = new List<StoreApiKey>();
        public virtual ICollection<StoreCatalogItem> CatalogItems { get; set; } = new List<StoreCatalogItem>();
    }
}
