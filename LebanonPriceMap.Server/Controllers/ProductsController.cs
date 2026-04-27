using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

    /// <summary>
    /// POST /api/products
    /// Create a new master product in the global dictionary. Admin only.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim.Value);
        var result = await _productService.CreateAsync(request, userId);
        return Ok(new { success = true, data = result });
    }

    /// <summary>
    /// PUT /api/products/{id}
    /// Update an existing product. Admin only.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateProductRequest request)
    {
        var success = await _productService.UpdateAsync(id, request);
        if (!success) return NotFound(new { success = false, message = "Product not found" });
        return Ok(new { success = true });
    }

    /// <summary>
    /// PATCH /api/products/{id}/archive
    /// Archive (soft-delete) a product. Admin only.
    /// </summary>
    [HttpPatch("{id}/archive")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Archive(string id)
    {
        var success = await _productService.ArchiveAsync(id);
        if (!success) return NotFound(new { success = false, message = "Product not found" });
        return Ok(new { success = true });
    }
}