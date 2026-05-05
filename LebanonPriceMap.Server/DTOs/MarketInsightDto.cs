using System;

namespace LebanonPriceMap.Server.DTOs
{
    public class MarketInsightDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public decimal YourPrice { get; set; }
        public decimal MarketAverage { get; set; }
        public int CompetitorCount { get; set; }
        public string PricePosition { get; set; } = "fair"; // lower, fair, higher
    }
}
