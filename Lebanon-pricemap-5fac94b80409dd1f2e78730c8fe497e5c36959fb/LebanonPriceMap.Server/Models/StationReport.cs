using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class StationReport
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StoreId { get; set; }

        [Required]
        public string FuelType { get; set; }

        public bool IsOpen { get; set; } = true;

        public bool HasStock { get; set; } = true;

        public int QueueMinutes { get; set; } = 0;

        public int QueueDepth { get; set; } = 0;

        public bool IsRationed { get; set; } = false;

        public decimal? LimitAmountLbp { get; set; }

        public Guid? ReportedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("ReportedBy")]
        public virtual User ReportedByUser { get; set; }

        public virtual ICollection<StationReportConfirmation> Confirmations { get; set; } = new List<StationReportConfirmation>();
    }
}
