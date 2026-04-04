namespace LebanonPriceMap.Server.DTOs;

/// <summary>
/// Request to submit feedback on a price entry (verify, report, etc.).
/// </summary>
public class FeedbackSubmitRequest
{
    public Guid PriceEntryId { get; set; }
    public string Type { get; set; } = string.Empty; // "confirm", "too_high", "too_low", "out_of_stock"
    public string? Note { get; set; }
}

/// <summary>
/// Response DTO for price feedback.
/// </summary>
public class FeedbackResponse
{
    public string Id { get; set; } = string.Empty;
    public string PriceEntryId { get; set; } = string.Empty;
    public string? SubmittedBy { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string Status { get; set; } = "open";
    public DateTime CreatedAt { get; set; }
}
