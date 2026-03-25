namespace LebanonPriceMap.Server.Models;

public class Alert
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }

    public decimal TargetPriceLbp { get; set; }
    public bool VerifiedOnly { get; set; } = true;
    public AlertStatus Status { get; set; } = AlertStatus.active;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Product? Product { get; set; }
}