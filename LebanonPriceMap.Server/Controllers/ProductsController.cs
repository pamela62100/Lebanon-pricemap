using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductsController(ProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? query, [FromQuery] string? category)
    {
        var results = await _productService.GetAllAsync(query, category);
        return Ok(new { success = true, data = results });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _productService.GetByIdAsync(id);
        if (result == null) return NotFound(new { success = false, message = "Product not found" });
        return Ok(new { success = true, data = result });
    }

    [HttpGet("barcode/{code}")]
    public async Task<IActionResult> GetByBarcode(string code)
    {
        var result = await _productService.GetByBarcodeAsync(code);
        if (result == null) return NotFound(new { success = false, message = "Product not found" });
        return Ok(new { success = true, data = result });
    }
}