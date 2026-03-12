using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class FuelPrice
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string FuelType { get; set; }

        public decimal OfficialPriceLbp { get; set; }

        public decimal? ReportedPriceLbp { get; set; }

        public DateTime EffectiveFrom { get; set; }

        public DateTime? EffectiveTo { get; set; }

        [MaxLength(255)]
        public string Source { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
