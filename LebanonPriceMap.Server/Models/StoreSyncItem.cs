using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class StoreSyncItem
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid SyncRunId { get; set; }

        public Guid? ProductId { get; set; }

        [MaxLength(255)]
        public string RawName { get; set; }

        [MaxLength(100)]
        public string RawBarcode { get; set; }

        public decimal? RawPrice { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; }

        public string FailReason { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("SyncRunId")]
        public virtual StoreSyncRun SyncRun { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
    }
}
