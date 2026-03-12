using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class PriceAlertRegion
    {
        [Required]
        public Guid AlertId { get; set; }

        [Required]
        public Guid RegionId { get; set; }

        // Navigation properties
        [ForeignKey("AlertId")]
        public virtual PriceAlert Alert { get; set; }

        [ForeignKey("RegionId")]
        public virtual Region Region { get; set; }
    }
}
