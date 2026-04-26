# Lebanon PriceMap - Deployment Testing & Troubleshooting Guide

## Build Status ✅

- **Backend**: Builds successfully (no errors)
- **Frontend**: Builds successfully (no errors, CSS warnings only)
- **Framework**: ASP.NET Core 10 + React + Vite + TypeScript

---

## CRITICAL FIX APPLIED ✅

### Port Configuration Mismatch [FIXED]

```
Old Config:
  Backend: http://localhost:5223
  Frontend: http://localhost:5000/api

New Config:
  Backend: http://localhost:5000 ✅
  Frontend: http://localhost:5000/api ✅
```

**Files Changed**:

- `LebanonPriceMap.Server/Properties/launchSettings.json`

---

## Server Startup Instructions

### 1. Terminal 1: Backend API

```powershell
cd "c:\fyp\Lebanon-pricemap\LebanonPriceMap.Server"
dotnet run
```

Expected output: `Now listening on: http://localhost:5000`

### 2. Terminal 2: Frontend Dev Server

```powershell
cd "c:\fyp\Lebanon-pricemap\lebanonpricemap.client"
npm run dev
```

Expected output: `Local:   http://localhost:5173`

---

## API Configuration

### Frontend API Client

- **File**: `src/api/axiosClient.ts`
- **Base URL**: `http://localhost:5000/api`
- **Auth Header**: `Authorization: Bearer {token}`
- **Token Storage**: `localStorage.rakis_token`

### Backend Configuration

- **CORS**: Enabled for localhost:5173, 5174, 5175, 3000
- **JWT**: Configured in `appsettings.json`
- **Database**: PostgreSQL (DefaultConnection)

---

## Available Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Prices

- `GET /api/prices/search` - Search prices
- `GET /api/prices/product/{id}` - Get prices by product
- `GET /api/prices/{id}` - Get single price entry
- `POST /api/prices` - Submit new price (requires auth)
- `POST /api/prices/{id}/vote` - Vote on price (requires auth)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/barcode/{code}` - Get by barcode

### Stores

- `GET /api/stores` - Get all stores
- `GET /api/stores/{id}` - Get store by ID

### Alerts

- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create alert

### Cart

- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add to cart
- `DELETE /api/cart/items/{id}` - Remove from cart

---

## Page Routes to Test

### Public Pages (No Auth Required)

- `/` → LandingPage
- `/login` → LoginPage
- `/register` → RegisterPage
- `/map` → PublicMapPage
- `/product/:id` → ProductPublicPage
- `/store/:id` → StorePublicPage

### Shopper Pages (Auth Required)

- `/app` → SearchPage (index)
- `/app/list` → CartPage
- `/app/list/optimize` → CartOptimizePage
- `/app/scan` → BarcodeScannerPage
- `/app/fuel` → FuelTrackerPage
- `/app/profile` → ProfilePage
- `/app/upload` → UploadReceiptPage
- `/app/price/:id` → PriceDetailPage
- `/app/alerts` → AlertsPage
- `/app/notifications` → NotificationsPage
- `/app/requests` → MyRequestsPage
- `/app/catalog` → RetailerCatalogPage
- `/app/catalog/:storeId` → RetailerCatalogDetailPage

### Retailer Pages (Auth + retailer role)

- `/retailer` → StoreDashboardPage
- `/retailer/products` → RetailerProductsPage
- `/retailer/promotions` → PromotionsPage
- `/retailer/insights` → CompetitorInsightsPage
- `/retailer/sync` → RetailerSyncPage
- `/retailer/upload` → BulkUploadPage
- `/retailer/price/:id/edit` → UpdatePricePage
- `/retailer/profile` → ProfilePage

### Admin Pages (Auth + admin role)

- `/admin` → AdminOverviewPage
- `/admin/approvals` → AdminApprovalQueuePage
- `/admin/users` → AdminUsersPage
- `/admin/products` → AdminProductsPage
- `/admin/stores` → AdminStoresPage
- `/admin/flagged` → AdminFlaggedPricesPage
- `/admin/anomalies` → AdminAnomaliesPage
- `/admin/logs` → AdminActivityLogsPage
- `/admin/onboarding` → AdminOnboardingPage

---

## Testing Checklist

### Phase 1: Server Connectivity

- [ ] Backend starts on port 5000
- [ ] Frontend starts on port 5173
- [ ] Frontend loads without errors
- [ ] Network tab shows API calls going to correct URL

### Phase 2: Public Routes

- [ ] `/` loads (LandingPage)
- [ ] `/login` loads (LoginPage)
- [ ] `/register` loads (RegisterPage)
- [ ] `/map` loads (PublicMapPage)
- [ ] Invalid routes show NotFoundPage (404)

### Phase 3: Authentication

- [ ] Can register new account
- [ ] Can login with credentials
- [ ] JWT token stored in localStorage
- [ ] Logout clears token

### Phase 4: Protected Routes

- [ ] Unauthenticated user redirected to login
- [ ] Authenticated user can access `/app` routes
- [ ] Admin can access `/admin` routes
- [ ] Retailer can access `/retailer` routes
- [ ] Wrong role gets redirected

### Phase 5: Page Navigation

- [ ] All shopper pages load without 404
- [ ] All retailer pages load without 404
- [ ] All admin pages load without 404
- [ ] Dynamic routes (:id) load correctly

### Phase 6: Button Functions

- [ ] Search button works
- [ ] Filter buttons work
- [ ] Add to cart button works
- [ ] Submit price button works
- [ ] Navigation buttons work

### Phase 7: Dialogs

- [ ] Dialog open/close works
- [ ] Dialog form submission works
- [ ] Dialog validation works
- [ ] Confirm dialogs have proper buttons

### Phase 8: Authorization

- [ ] Admin-only pages blocked for non-admins
- [ ] Retailer-only pages blocked for non-retailers
- [ ] Shopper can only see shopper pages
- [ ] Role validation on form submission

---

## Troubleshooting 404 Errors

### If you see 404 when navigating:

1. **Check Backend is Running**

   ```powershell
   # In backend terminal, look for:
   # "Now listening on: http://localhost:5000"
   ```

2. **Check Network Tab in Browser DevTools**
   - Right-click → Inspect → Network tab
   - Look for API calls and their responses
   - 404 on API = endpoint doesn't exist
   - 401 on API = authentication required

3. **Check Route Permissions**
   - Admin routes require `role === "admin"`
   - Retailer routes require `role === "retailer" || "admin"`
   - Shopper routes require valid JWT token

4. **Clear Browser Cache**
   ```javascript
   // In browser console:
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

---

## Common Issues & Solutions

### Issue: "Cannot GET /api/prices/search"

**Solution**: Backend not running on correct port

```powershell
# Check: dotnet run output should show port 5000
# Fix: cd to LebanonPriceMap.Server and run: dotnet run
```

### Issue: Token not persisting

**Solution**: JWT token not being saved correctly

```javascript
// Check in browser console:
localStorage.getItem("rakis_token");
// Should return a long JWT token string
```

### Issue: Pages load but show empty content

**Solution**: API calls failing silently

- Open browser DevTools → Network tab
- Look for failed API requests
- Check response for error messages
- Verify JWT token is valid

### Issue: 401 Unauthorized on protected routes

**Solution**: Token expired or invalid

- Check if token exists in localStorage
- Login again to get new token
- Verify JWT secret matches between frontend and backend

---

## Environment Variables

### Frontend (.env files if needed)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (appsettings.json)

```json
{
  "Jwt": {
    "Secret": "WenArkhass_SuperSecret_2025_Lebanon_PriceMap!",
    "Issuer": "LebanonPriceMap",
    "Audience": "LebanonPriceMap",
    "ExpiryHours": 24
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=wenarkhass_db;Username=postgres;Password=postgres"
  }
}
```

---

## Database Setup (If Needed)

```sql
-- Run these scripts in order:
-- 1. schema.sql - Creates all tables
-- 2. seed.sql - Populates test data
```

---

## Performance & Optimization Notes

### Frontend Bundle Size

- Current: 1.25MB (minified)
- Warning: Consider code splitting for large features
- Recommendation: Use dynamic imports for admin/retailer sections

### Package Vulnerabilities

- SixLabors.ImageSharp: Update to latest version
- Several npm packages have moderate vulnerabilities
- Plan security updates after testing

---

## Deployment Checklist

- [ ] All tests pass
- [ ] No 404 errors
- [ ] Authentication working
- [ ] All pages load
- [ ] Buttons functional
- [ ] Dialogs working
- [ ] Authorization enforced
- [ ] Database connected
- [ ] Error handling in place
- [ ] Performance acceptable

---

## Contact & Support

For issues during deployment:

1. Check this guide's troubleshooting section
2. Review browser DevTools console and network tabs
3. Check backend logs in terminal
4. Verify all ports are correct (5000 for backend, 5173 for frontend)
