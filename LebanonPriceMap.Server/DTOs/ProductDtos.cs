namespace LebanonPriceMap.Server.DTOs;

public class ProductResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? NameAr { get; set; }
    public string? Category { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string? Brand { get; set; }
    public string? Barcode { get; set; }
    public int UploadCount { get; set; }
    public bool IsArchived { get; set; }
    public List<string> Aliases { get; set; } = new();
}