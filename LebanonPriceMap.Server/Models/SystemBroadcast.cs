using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LebanonPriceMap.Server.Models
{
    public class SystemBroadcast
    {
        [Key]
        public Guid Id { get; set; }

        public string Type { get; set; } = "info";

        [Required]
        public string Message { get; set; }

        public string Severity { get; set; } = "medium";

        public bool IsActive { get; set; } = true;

        public DateTime StartsAt { get; set; } = DateTime.UtcNow;

        public DateTime? EndsAt { get; set; }

        public int Priority { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
