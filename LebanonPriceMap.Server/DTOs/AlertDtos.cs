namespace LebanonPriceMap.Server.DTOs;

public class CreateAlertRequest
{
    public Guid ProductId { get; set; }
    public decimal TargetPriceLbp { get; set; }
}

public class AlertResponse
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string? ProductName { get; set; }
    public decimal TargetPriceLbp { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}