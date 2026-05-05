# Test Data & Seeding - Quick Summary

## What Was Created

### 1. .NET Seeding Service
**File**: `LebanonPriceMap.Server/Services/DataSeederService.cs`

A comprehensive C# service that automatically generates and seeds:
- 90+ test users (admins, retailers, shoppers)
- 60+ stores across Lebanon
- 60+ products in 8 categories
- 200+ price submissions
- 10+ fuel price records
- 10+ station reports
- 500+ store catalog items

**How it works**:
- Automatically runs on first startup in Development mode
- Creates realistic Lebanese data (locations, names, prices in LBP)
- Generates proper relationships between entities
- Skips if data already exists

### 2. Updated Program.cs
Registered the `DataSeederService` and configured automatic seeding on startup.

### 3. CSV Files (11 Total)

#### Original Files (30 items each)
1. `test_data_users.csv` - Shoppers, retailers, admins
2. `test_data_stores.csv` - Supermarkets, local shops, fuel stations
3. `test_data_products.csv` - All product categories
4. `test_data_price_submissions.csv` - Price entries
5. `test_data_fuel_prices.csv` - Fuel pricing
6. `test_data_station_reports.csv` - Fuel station status
7. `test_data_store_catalog.csv` - Store inventory

#### Extended Files (20-30 items each)
8. `test_data_users_extended.csv` - 30 more users
9. `test_data_stores_extended.csv` - 30 more stores
10. `test_data_products_extended.csv` - 30 more products
11. `test_data_price_submissions_extended.csv` - 20 more submissions

### 4. Documentation
**File**: `TEST_DATA_GUIDE.md`

Comprehensive guide covering:
- Data overview
- Setup instructions
- Multiple import methods
- Test user credentials
- Data characteristics
- Database schema info
- Troubleshooting tips
- Useful SQL queries

## Quick Start

### Option 1: Automatic Seeding (Recommended)
```bash
cd LebanonPriceMap.Server
dotnet run --configuration Debug
```
✅ Data automatically seeds on first startup
✅ Takes 5-10 seconds
✅ No additional steps needed

### Option 2: CSV Import
```bash
psql -h localhost -U your_user -d lebanon_pricemap
\COPY users FROM 'test_data_users.csv' WITH (FORMAT csv, HEADER true)
\COPY stores FROM 'test_data_stores.csv' WITH (FORMAT csv, HEADER true)
# ... etc for other files
```

## Test User Credentials

```
Email: admin@wein.app (Admin)
Email: layla.khoury@test.com (High-trust Shopper)
Email: habib.nassar@test.com (Retailer)
Password: test123456 (all users)
```

## Data Coverage

| Category | Count | Details |
|----------|-------|---------|
| **Users** | 90+ | Admins, retailers, shoppers across all regions |
| **Stores** | 60+ | Chains, independents, fuel stations |
| **Products** | 60+ | Dairy, bakery, oils, fuel, meat, grains, beverages, produce |
| **Prices** | 200+ | Various statuses with votes and disputes |
| **Fuel Data** | 10+ | 4 weeks of history, all fuel types |
| **Catalog Items** | 500+ | Store inventory with promotions |

## Geographic Coverage

- **Beirut**: 35%
- **Metn**: 15%
- **Keserwan**: 15%
- **Tripoli**: 12%
- **Sidon**: 12%
- **Zahle**: 11%

## Key Features

✅ **Realistic Lebanese Data**
- Local product names with Arabic translations
- Accurate Lebanese cities and districts
- Prices in LBP (Lebanese Pound)

✅ **Varied User Profiles**
- Different trust levels (high, medium, low)
- Various activity levels
- Mix of roles (admin, retailer, shopper)

✅ **Complete Relationships**
- Users linked to stores
- Products linked to categories
- Prices linked to users and stores
- Fuel prices with time ranges

✅ **Testing-Ready**
- Active and expired promotions
- Historical data spanning 2 months
- Multiple stores with inventory
- Vote data and disputes

## Files Location

```
c:\fyp\Lebanon-pricemap\
├── LebanonPriceMap.Server\
│   └── Services\
│       └── DataSeederService.cs          [NEW]
├── test_data_users.csv                   [NEW]
├── test_data_users_extended.csv          [NEW]
├── test_data_stores.csv                  [NEW]
├── test_data_stores_extended.csv         [NEW]
├── test_data_products.csv                [NEW]
├── test_data_products_extended.csv       [NEW]
├── test_data_price_submissions.csv       [NEW]
├── test_data_price_submissions_extended.csv [NEW]
├── test_data_fuel_prices.csv             [NEW]
├── test_data_station_reports.csv         [NEW]
├── test_data_store_catalog.csv           [NEW]
├── TEST_DATA_GUIDE.md                    [NEW - This file]
└── Program.cs                            [UPDATED]
```

## Next Steps

1. **Run the app**: `dotnet run --configuration Debug`
2. **Check the logs**: Should see seeding completion message
3. **Login**: Use test credentials
4. **Explore**: Test all features with realistic data
5. **Read Guide**: See `TEST_DATA_GUIDE.md` for details

## Customization

Want to adjust the test data? Edit `DataSeederService.cs`:

```csharp
// Change number of users
for (int i = 0; i < 150; i++)  // was 60

// Modify trust score ranges
int trustScore = 50 + _random.Next(-45, 51);  // adjust range

// Add more products
productDefinitions = new[] { ... }  // expand array

// Change cities
_cities = new[] { ... }  // modify array
```

## Support

- 📖 **Full Guide**: See `TEST_DATA_GUIDE.md`
- 🔍 **Troubleshooting**: Check guide's troubleshooting section
- 💻 **Code**: See comments in `DataSeederService.cs`
- 📊 **Queries**: SQL examples in `TEST_DATA_GUIDE.md`

---

**Total Test Data**: 1000+ records across all entity types
**Ready to test**: Yes - all data automatically seeded on first run! ✅
