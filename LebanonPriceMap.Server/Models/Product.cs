using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class Product
    {
        [Key]
        public Guid Id { get; set; }

        public Guid? CategoryId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [MaxLength(255)]
        public string NameAr { get; set; }

        public string Description { get; set; }

        [Required]
        [MaxLength(100)]
        public string Unit { get; set; }

        [MaxLength(150)]
        public string Brand { get; set; }

        [MaxLength(100)]
        public string Barcode { get; set; }

        public int UploadCount { get; set; } = 0;

        public bool IsArchived { get; set; } = false;

        public Guid? MergedIntoProductId { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }

        [ForeignKey("MergedIntoProductId")]
        public virtual Product MergedIntoProduct { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User CreatedByUser { get; set; }

        public virtual ICollection<ProductAlias> Aliases { get; set; } = new List<ProductAlias>();
        public virtual ICollection<StoreCatalogItem> CatalogItems { get; set; } = new List<StoreCatalogItem>();
    }
}
