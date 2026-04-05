namespace LebanonPriceMap.Server.DTOs;

public class DiscrepancySubmissionRequest
{
    public Guid CatalogItemId { get; set; }
    public Guid StoreId { get; set; }
    public Guid ProductId { get; set; }
    public string ReportType { get; set; } // 'price_mismatch', 'out_of_stock', 'incorrect_promo'
    public decimal? ObservedPriceLbp { get; set; }
    public string Note { get; set; }
}

public class ResolveDiscrepancyRequest
{
    public string Note { get; set; }
    public decimal? ApprovedPrice { get; set; }
}
