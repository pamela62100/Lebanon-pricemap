using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class StoreSyncRun
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid StoreId { get; set; }

        [Required]
        public string Method { get; set; }

        [Required]
        public string Status { get; set; }

        public int? RecordsReceived { get; set; }

        public int? RecordsProcessed { get; set; }

        public int? RecordsFailed { get; set; }

        public string Message { get; set; }

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;

        public DateTime? FinishedAt { get; set; }

        public Guid? CreatedBy { get; set; }

        // Navigation properties
        [ForeignKey("StoreId")]
        public virtual Store Store { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User CreatedByUser { get; set; }

        public virtual ICollection<StoreSyncItem> Items { get; set; } = new List<StoreSyncItem>();
    }
}
