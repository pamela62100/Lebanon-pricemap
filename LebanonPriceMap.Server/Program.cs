using LebanonPriceMap.Server.Data;
using LebanonPriceMap.Server.Hubs;
using LebanonPriceMap.Server.Services;
using LebanonPriceMap.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Connect to PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        o => {
            o.MapEnum<AlertStatus>("alert_status");
            o.MapEnum<SyncMethod>("sync_method");
            o.MapEnum<SyncStatus>("sync_status");
            o.MapEnum<SubmissionSource>("submission_source");
            o.MapEnum<SubmissionStatus>("submission_status");
            o.MapEnum<CatalogChangeReason>("catalog_change_reason");
        }
    ));

// Register Services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<PriceService>();
builder.Services.AddScoped<StoreService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CatalogService>();
builder.Services.AddScoped<DiscrepancyService>();
builder.Services.AddScoped<AlertService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<FuelService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<DataSeederService>();
builder.Services.AddSingleton<LiveBroadcaster>();


// Add CORS — must allow credentials for SignalR
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000" };
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Set the default backend URL for Docker (listen on all interfaces)
var defaultPort = 80;
var urls = $"http://{System.Net.IPAddress.Any}:{defaultPort}";
builder.WebHost.UseUrls(urls);

// SignalR
builder.Services.AddSignalR();

// Add JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret is not configured.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            NameClaimType = ClaimTypes.NameIdentifier
        };

        // SignalR can't set custom headers on the WebSocket handshake — pull the
        // bearer token out of the query string when the request targets the hub.
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                var token = ctx.Request.Query["access_token"];
                var path = ctx.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(token) && path.StartsWithSegments("/hubs"))
                {
                    ctx.Token = token;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        // Prevent infinite recursion when an entity has navigation properties
        // that loop back (e.g. CatalogItem ↔ DiscrepancyReports).
        opts.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed database in development
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DataSeederService>();
        await seeder.SeedAllAsync();
    }
    
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<LiveHub>("/hubs/live");
await app.RunAsync();