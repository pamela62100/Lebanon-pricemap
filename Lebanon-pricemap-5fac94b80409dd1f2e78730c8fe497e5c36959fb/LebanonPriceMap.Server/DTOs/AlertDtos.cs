namespace LebanonPriceMap.Server.DTOs;

public class CreateAlertRequest
{
    public Guid ProductId { get; set; }
    public decimal TargetPriceLbp { get; set; }
    public bool VerifiedOnly { get; set; } = true;
}

public class AlertResponse
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal TargetPriceLbp { get; set; }
    public bool Active { get; set; }
    public bool VerifiedOnly { get; set; }
    public DateTime CreatedAt { get; set; }
}