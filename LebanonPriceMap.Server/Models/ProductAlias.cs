using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class ProductAlias
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Alias { get; set; }

        [MaxLength(10)]
        public string LanguageCode { get; set; } = "en";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
    }
}
