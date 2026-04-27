using LebanonPriceMap.Server.DTOs;
using LebanonPriceMap.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LebanonPriceMap.Server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.Register(request);

        if (result == null)
            return BadRequest(new { message = "Email already exists" });

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.Login(request);

        if (result == null)
            return Unauthorized(new { message = "Invalid email or password" });

        return Ok(result);
    }

    /// <summary>
    /// GET /api/auth/me
    /// Validate the current JWT and return the user's profile.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim.Value);
        var result = await _authService.GetCurrentUserAsync(userId);

        if (result == null)
            return NotFound(new { success = false, message = "User not found" });

        return Ok(new { success = true, data = result });
    }

    /// <summary>
    /// POST /api/auth/logout
    /// Stateless logout — the client discards the JWT.
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        // With stateless JWTs there is nothing to invalidate server-side.
        // The client is expected to clear the token from local storage.
        return Ok(new { success = true, message = "Logged out successfully" });
    }

    /// <summary>
    /// POST /api/auth/forgot-password
    /// Always returns success regardless of whether the email exists.
    /// </summary>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var origin = Request.Headers["Origin"].ToString();
        if (string.IsNullOrEmpty(origin)) origin = "http://localhost:5173";
        await _authService.RequestPasswordResetAsync(request.Email, origin);
        return Ok(new { success = true, message = "If that email exists, a reset link has been sent." });
    }

    /// <summary>
    /// POST /api/auth/reset-password
    /// Completes a password reset using a token from email.
    /// </summary>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var success = await _authService.ResetPasswordAsync(request.Token, request.NewPassword);
        if (!success) return BadRequest(new { success = false, message = "Invalid or expired reset link." });
        return Ok(new { success = true, message = "Password has been reset. You can now sign in." });
    }

    /// <summary>
    /// DELETE /api/auth/account — soft-deletes the current user.
    /// </summary>
    [HttpDelete("account")]
    [Authorize]
    public async Task<IActionResult> DeleteMyAccount()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim.Value);
        var success = await _authService.DeleteAccountAsync(userId);
        if (!success) return NotFound(new { success = false, message = "User not found" });
        return Ok(new { success = true, message = "Account deleted." });
    }
}