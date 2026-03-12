# Initialize Core Backend Infrastructure & Sprint 1 (Auth + Catalog)

Initialize the core foundation of the Lebanon Price Map backend (ASP.NET Core 10). Setup shared infrastructure including JWT Authentication, Global Error Handling, Standardized API Responses, DbContext with core models, and initial DB migrations. Following Sprint 0, implement Sprint 1 track tasks (Auth and Catalog Read endpoints).

## User Review Required

- **Model Placement**: I'll move [User.cs](file:///c:/fyp/Lebanon-pricemap/LebanonPriceMap.Server/User.cs) from the root directory into a `Models/` folder, and place all new EF Core entity models there.
- **Database Scope**: I will define the Core 6-8 tables required for Auth and Catalog in [AppDbContext](file:///c:/fyp/Lebanon-pricemap/LebanonPriceMap.Server/Data/AppDbContext.cs#8-9) first to unblock Sprint 1, ensuring they have the properties listed in Section 4 and schema fixes from Section 4.3. Does this sound good before I generate the full migration?

## Proposed Changes

### Configuration and Shared Infrastructure (Sprint 0)
- **[NEW]** `LebanonPriceMap.Server/Helpers/ApiResponse.cs`: Standard response wrapper `{ success, data, message, error }`.
- **[NEW]** `LebanonPriceMap.Server/Middlewares/GlobalExceptionMiddleware.cs`: Catches unhandled exceptions, returns structured JSON.
- **[NEW]** `LebanonPriceMap.Server/Extensions/JwtBearerExtensions.cs`: JWT Configuration setup.
- **[NEW]** `LebanonPriceMap.Server/Extensions/ClaimsExtensions.cs`: Helper to easily extract `UserId` and `Role` from ClaimsPrincipal.
- **[MODIFY]** [LebanonPriceMap.Server/Program.cs](file:///c:/fyp/Lebanon-pricemap/LebanonPriceMap.Server/Program.cs): Wire up DbContext, JWT Auth, and exception middleware. Add DI for `IAuthService` and `ICatalogService`.

### Database Models (Core)
- **[DELETE]** [LebanonPriceMap.Server/User.cs](file:///c:/fyp/Lebanon-pricemap/LebanonPriceMap.Server/User.cs) (Moving to Models folder)
- **[NEW]** `LebanonPriceMap.Server/Models/User.cs`: Extended User model.
- **[NEW]** `LebanonPriceMap.Server/Models/Store.cs`: Store model including the `Chain` column and power status.
- **[NEW]** `LebanonPriceMap.Server/Models/Product.cs`: Core product information (barcode, category, unit).
- **[NEW]** `LebanonPriceMap.Server/Models/StoreCatalogItem.cs`: `store_catalog_items` table representing the catalog-first truth.
- **[NEW]** `LebanonPriceMap.Server/Models/CatalogAuditEntry.cs`: `catalog_audit_entries` required for atomic updates.
- **[NEW]** `LebanonPriceMap.Server/Models/StorePromotion.cs`: Includes `original_price_lbp` and `promo_price_lbp`.
- **[MODIFY]** [LebanonPriceMap.Server/Data/AppDbContext.cs](file:///c:/fyp/Lebanon-pricemap/LebanonPriceMap.Server/Data/AppDbContext.cs): Register `DbSet` for all these entities with proper configurations.

### Auth & Catalog Reads (Sprint 1)
- **[NEW]** `LebanonPriceMap.Server/DTOs/Auth/RequestDtos.cs`: `LoginDto`, `RegisterDto` with Fluent/Data Annotations.
- **[NEW]** `LebanonPriceMap.Server/DTOs/Auth/AuthResponseDto.cs`.
- **[NEW]** `LebanonPriceMap.Server/Services/IAuthService.cs` & `AuthService.cs`: Implements BCrypt password hashing and JWT generation.
- **[NEW]** `LebanonPriceMap.Server/Controllers/AuthController.cs`: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`.
- **[NEW]** `LebanonPriceMap.Server/DTOs/Catalog/...`: Catalog Read DTOs.
- **[NEW]** `LebanonPriceMap.Server/Services/ICatalogService.cs` & `CatalogService.cs`: Logic to fetch store catalogs and single items.
- **[NEW]** `LebanonPriceMap.Server/Controllers/CatalogController.cs`: `/api/catalog/store/{storeId}`, `/api/catalog/{id}`, `/api/catalog/{id}/audit`.

## Verification Plan

### Automated Tests
1. **Compilation**: Execute `dotnet build` from `c:\fyp\Lebanon-pricemap\LebanonPriceMap.Server` to ensure strong typing and syntax is valid.
2. **Migrations**: Execute `dotnet ef migrations add InitialCreate -p LebanonPriceMap.Server.csproj` to verify the DB schema is valid and generates properly.

### Manual Verification
1. Run application via `dotnet run` locally.
2. Create bash queries (via `curl` or `run_command` internally) to:
   - `POST /api/auth/register` to create a new user.
   - `POST /api/auth/login` to get a JWT token.
   - `GET /api/auth/me` with the bearer token to verify authentication headers are parsed.
