using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class StationReportConfirmation
    {
        [Required]
        public Guid ReportId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        // Navigation properties
        [ForeignKey("ReportId")]
        public virtual StationReport Report { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
