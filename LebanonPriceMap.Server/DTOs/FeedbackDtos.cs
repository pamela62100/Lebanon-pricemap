namespace LebanonPriceMap.Server.DTOs;

public class FeedbackResponse
{
    public string Id { get; set; } = string.Empty;
    public string PriceEntryId { get; set; } = string.Empty;
    public string? SubmittedBy { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class SubmitFeedbackRequest
{
    public Guid PriceEntryId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Note { get; set; }
}
