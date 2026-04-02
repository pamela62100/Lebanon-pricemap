namespace LebanonPriceMap.Server.DTOs;

public class ApprovalRequestResponse
{
    public string Id { get; set; } = string.Empty;
    public string RequestedBy { get; set; } = string.Empty;
    public string? ReviewedBy { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Payload { get; set; } = "{}";
    public string Status { get; set; } = "pending";
    public string? ReviewNote { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}

public class CreateApprovalRequest
{
    public string Action { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Payload { get; set; } = "{}";
}

public class ResolveApprovalRequest
{
    public string? Note { get; set; }
}
