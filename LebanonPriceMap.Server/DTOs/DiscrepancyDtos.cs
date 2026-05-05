namespace LebanonPriceMap.Server.DTOs;

public class DiscrepancySubmissionRequest
{
    public Guid CatalogItemId { get; set; }
    public Guid StoreId { get; set; }
    public Guid ProductId { get; set; }
    public string ReportType { get; set; } = string.Empty; // 'price_mismatch', 'out_of_stock', 'incorrect_promo'
    public decimal? ObservedPriceLbp { get; set; }
    public string Note { get; set; } = string.Empty;
}

public class ResolveDiscrepancyRequest
{
    public string Note { get; set; } = string.Empty;
    public decimal? ApprovedPrice { get; set; }
}
