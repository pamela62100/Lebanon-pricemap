using LebanonPriceMap.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Xml;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
public class SitemapController : ControllerBase
{
    private readonly AppDbContext _db;
    private const string SiteUrl = "https://weinarkhass.com";

    public SitemapController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("/sitemap.xml")]
    [Produces("application/xml")]
    public async Task<IActionResult> GetSitemap()
    {
        var stores = await _db.Stores
            .Where(s => s.Status == "active" || s.Status == "verified")
            .Select(s => new { s.Id, s.UpdatedAt })
            .ToListAsync();

        var products = await _db.Products
            .Where(p => !p.IsArchived)
            .Select(p => new { p.Id, p.UpdatedAt })
            .ToListAsync();

        var sb = new StringBuilder();
        sb.Append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sb.Append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        AddUrl(sb, $"{SiteUrl}/", DateTime.UtcNow, "daily", "1.0");
        AddUrl(sb, $"{SiteUrl}/map", DateTime.UtcNow, "hourly", "0.9");

        foreach (var store in stores)
            AddUrl(sb, $"{SiteUrl}/store/{store.Id}", store.UpdatedAt, "daily", "0.7");

        foreach (var product in products)
            AddUrl(sb, $"{SiteUrl}/product/{product.Id}", product.UpdatedAt, "daily", "0.6");

        sb.Append("</urlset>");

        return Content(sb.ToString(), "application/xml", Encoding.UTF8);
    }

    private static void AddUrl(StringBuilder sb, string loc, DateTime lastmod, string changefreq, string priority)
    {
        sb.Append("<url>");
        sb.Append($"<loc>{XmlEscape(loc)}</loc>");
        sb.Append($"<lastmod>{lastmod:yyyy-MM-dd}</lastmod>");
        sb.Append($"<changefreq>{changefreq}</changefreq>");
        sb.Append($"<priority>{priority}</priority>");
        sb.Append("</url>");
    }

    private static string XmlEscape(string s) =>
        s.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;");
}
