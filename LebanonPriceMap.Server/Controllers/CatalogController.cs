using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers
{
    [ApiController]
    [Route("api/catalog")]
    public class CatalogController : ControllerBase
    {
        private readonly CatalogService _catalogService;

        public CatalogController(CatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        [HttpGet("store/{id}")]
        public async Task<IActionResult> GetByStoreId(Guid id)
        {
            var items = await _catalogService.GetByStoreIdAsync(id);
            return Ok(new { success = true, data = items });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var item = await _catalogService.GetByIdAsync(id);
            if (item == null) return NotFound(new { success = false, message = "Catalog item not found" });
            return Ok(new { success = true, data = item });
        }

        [Authorize(Roles = "retailer,admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCatalogItemDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid? userId = userIdStr != null ? Guid.Parse(userIdStr) : null;

            var item = await _catalogService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, new { success = true, data = item });
        }

        [Authorize(Roles = "retailer,admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCatalogItemDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid? userId = userIdStr != null ? Guid.Parse(userIdStr) : null;

            var item = await _catalogService.UpdateAsync(id, dto, userId);
            if (item == null) return NotFound(new { success = false, message = "Catalog item not found" });
            return Ok(new { success = true, data = item });
        }

        [Authorize(Roles = "retailer,admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _catalogService.DeleteAsync(id);
            if (!success) return NotFound(new { success = false, message = "Catalog item not found" });
            return Ok(new { success = true, message = "Catalog item deleted" });
        }

        [Authorize(Roles = "retailer,admin")]
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromQuery] Guid storeId, IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest(new { success = false, message = "No file uploaded" });

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid? userId = userIdStr != null ? Guid.Parse(userIdStr) : null;

            using var stream = file.OpenReadStream();
            var result = await _catalogService.BulkUploadAsync(storeId, stream, userId);
            return Ok(result);
        }

        [Authorize(Roles = "retailer,admin")]
        [HttpGet("{id}/audit")]
        public async Task<IActionResult> GetAudit(Guid id)
        {
            var audit = await _catalogService.GetAuditTrailAsync(id);
            return Ok(new { success = true, data = audit });
        }
    }
}
