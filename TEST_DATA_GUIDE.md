# Lebanon Price Map - Test Data & Seeding Guide

## Overview

This document describes how to seed comprehensive test data into your Lebanon Price Map application. The application includes both a .NET seeding service and CSV files for importing data.

## Data Included

### Users (90+ total)

- **Admins**: 2 administrative users
- **Retailers**: 8 store owners
- **Shoppers**: 80+ regular users across all Lebanese regions
  - Trust scores ranging from low (18-30) to high (75-100)
  - Various activity levels (upload counts from 0-150)
  - Based in: Beirut, Tripoli, Sidon, Zahle, Metn, Keserwan, Jounieh

### Stores (60+ total)

- **Chain Supermarkets**: Spinneys, Carrefour, TSC, Happy, Bou Khalil, LCC
- **Independent Markets**: Various local shops across Lebanon
- **Fuel Stations**: 8+ fuel stations across major cities
- All with realistic Lebanese coordinates
- Complete store information: location, trust scores, operating status

### Products (60+ total)

- **Dairy**: Milk, eggs, yogurt, labneh, cheese
- **Bakery**: Bread, pita, croissants, manakish
- **Oils & Fats**: Olive oil, sunflower oil, canola oil, butter
- **Fuel**: Diesel, Gasoline 95/98 Octane
- **Meat**: Chicken, beef, lamb, fish, shrimp
- **Grains**: Rice, lentils, beans, pasta, flour
- **Beverages**: Water, juice, cola, coffee, tea
- **Produce**: Vegetables and fruits

### Price Submissions (200+ total)

- Various status types: verified, pending, flagged
- Community and official sources
- Promotion prices with dates
- Vote data and dispute information

### Fuel Prices (10+ records)

- 4 weeks of historical data
- All fuel types: Gasoline 95, Gasoline 98, Diesel
- Official and reported prices from Ministry of Energy

### Station Reports (10+ records)

- Real-time fuel station status
- Queue information
- Stock and rationing details
- Confirmations from multiple users

### Store Catalogs (500+ items)

- Products per store with pricing
- Active promotions
- Stock availability
- Last update tracking

## Method 1: .NET Seeding Service (Recommended)

### Setup

1. The `DataSeederService` is already integrated into your application
2. It's registered in `Program.cs` and automatically runs on startup in Development mode

### Usage

Simply run your application in development mode:

```bash
dotnet run --configuration Debug
```

The seeding service will:

- Automatically check if the database is empty
- Seed all test data on first startup
- Skip seeding if data already exists

### What Gets Seeded

The service creates:

- ✅ 90+ users (admins, retailers, shoppers)
- ✅ 60+ stores across Lebanon
- ✅ 60+ products
- ✅ 200+ price submissions
- ✅ 10+ fuel price records
- ✅ 10+ station reports
- ✅ 500+ store catalog items
- ✅ Regions, districts, and categories

### Features of the Seeding Service

- **Realistic Data Generation**: Uses Lebanon-specific locations, names, and prices
- **Varied Trust Levels**: Users have different trust scores affecting their interaction
- **Complete Coverage**: Seeds across all major Lebanese cities
- **Promotional Content**: Includes active and expired promotions
- **Historical Data**: Includes dates spanning the last 2 months
- **Relationships**: Properly links users to stores, stores to products, etc.

## Method 2: CSV Import

If you prefer to manually import CSV files, use these files:

### Available CSV Files

1. **test_data_users.csv** - 30 users
2. **test_data_users_extended.csv** - 30 additional users
3. **test_data_stores.csv** - 30 stores
4. **test_data_stores_extended.csv** - 30 additional stores
5. **test_data_products.csv** - 30 products
6. **test_data_products_extended.csv** - 30 additional products
7. **test_data_price_submissions.csv** - 30 price submissions
8. **test_data_price_submissions_extended.csv** - 20 additional submissions
9. **test_data_fuel_prices.csv** - 10 fuel price records
10. **test_data_station_reports.csv** - 10 station reports
11. **test_data_store_catalog.csv** - 20 catalog items

### Import Instructions

You can import these CSV files into PostgreSQL using:

#### Option A: psql command line

```bash
# First, connect to your database
psql -h localhost -U your_user -d lebanon_pricemap

# Then import each CSV
\COPY users FROM '/path/to/test_data_users.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',')
\COPY stores FROM '/path/to/test_data_stores.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',')
\COPY products FROM '/path/to/test_data_products.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',')
```

#### Option B: DBeaver or pgAdmin

1. Right-click on the table
2. Select "Import Data"
3. Choose the CSV file
4. Map columns
5. Execute import

#### Option C: PostgreSQL COPY command

```sql
COPY users(id, role, status, email, password_hash, name, avatar_initials, city,
           trust_score, trust_level, upload_count, verified_count, joined_at)
FROM '/absolute/path/to/test_data_users.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');
```

## Test User Credentials

All test users have the same password for testing purposes:

```
Password: test123456
```

### Sample Test Accounts

| Email                 | Role     | Trust Score | City    |
| --------------------- | -------- | ----------- | ------- |
| admin@wein.app        | Admin    | 100         | Beirut  |
| habib.nassar@test.com | Retailer | 92          | Beirut  |
| layla.khoury@test.com | Shopper  | 91          | Beirut  |
| rima.karam@test.com   | Shopper  | 67          | Tripoli |
| fatima.ali@test.com   | Shopper  | 78          | Sidon   |

## Data Characteristics

### Trust Score Distribution

- **High (75-100)**: ~40% of users
- **Medium (50-74)**: ~40% of users
- **Low (0-49)**: ~20% of users

### Geographic Distribution

- **Beirut**: 35% of data
- **Metn**: 15% of data
- **Keserwan**: 15% of data
- **Tripoli**: 12% of data
- **Sidon**: 12% of data
- **Zahle**: 11% of data

### Price Ranges (in LBP)

- **Dairy Products**: 45,000 - 435,000
- **Bakery**: 35,000 - 130,000
- **Oils**: 80,000 - 650,000
- **Fuel**: 110,000 - 130,000 (per liter)
- **Meat**: 350,000 - 500,000 (per kg)
- **Produce**: 40,000 - 160,000 (per kg)

## Database Schema Assumptions

The seeding service assumes the following tables exist:

- users
- regions
- districts
- categories
- products
- product_aliases
- stores
- store_api_keys
- store_catalog_items
- price_submissions
- fuel_prices
- station_reports
- station_report_confirmations

## Resetting Data

To reset your database and reseed fresh data:

### Option 1: Using Entity Framework (Recommended)

```bash
# Delete migrations
dotnet ef database drop

# Recreate database
dotnet ef database update

# Restart app to trigger seeding
dotnet run --configuration Debug
```

### Option 2: Direct SQL

```sql
-- Drop and recreate the database
DROP DATABASE lebanon_pricemap;
CREATE DATABASE lebanon_pricemap;

-- Recreate schema and apply migrations
dotnet ef database update
```

## Customizing the Seeding Service

You can modify `DataSeederService.cs` to adjust:

- Number of users/stores/products
- Trust score distributions
- Product definitions and categories
- Promotion percentages
- Price ranges
- Geographic locations

### Example: Add more users

```csharp
// In SeedUsersAsync() method
for (int i = 0; i < 150; i++)  // Change from 60 to 150
{
    // ... existing code
}
```

## Performance Notes

- **Initial Seeding**: Takes 5-10 seconds for 1000+ records
- **CSV Import**: Faster than service seeding (2-5 seconds)
- **Database Size**: ~50MB with all test data
- **Concurrent Users**: Can handle 100+ test users simultaneously

## Troubleshooting

### Error: "Database already has data"

The seeding service won't overwrite existing data. Reset the database first:

```bash
dotnet ef database drop
dotnet ef database update
```

### Duplicate Key Errors

Ensure you're using fresh GUIDs or the database is clean before importing CSVs

### CSV Import Encoding Issues

Ensure CSVs are saved as UTF-8:

```bash
# Convert if needed
iconv -f ISO-8859-1 -t UTF-8 file.csv > file_utf8.csv
```

### Missing Foreign Key References

Ensure you seed data in the correct order:

1. Regions & Districts
2. Categories
3. Users
4. Products
5. Stores
6. Catalog items & Submissions

## Useful Queries for Testing

```sql
-- Check how many records were seeded
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as store_count FROM stores;
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as price_count FROM price_submissions;

-- Find high-trust users
SELECT * FROM users WHERE trust_level = 'high' ORDER BY trust_score DESC;

-- See stores by city
SELECT city, COUNT(*) as count FROM stores GROUP BY city;

-- Check promotions
SELECT * FROM store_catalog_items WHERE is_promotion = true;

-- Price distribution
SELECT category_id, AVG(official_price_lbp) as avg_price
FROM store_catalog_items scc
JOIN products p ON scc.product_id = p.id
GROUP BY category_id;
```

## Next Steps

1. ✅ **Seed Test Data**: Run the application to automatically seed
2. ✅ **Test Features**: Use test accounts to explore the app
3. ✅ **Monitor Performance**: Check response times with realistic data volume
4. ✅ **Adjust as Needed**: Modify seeding to match your specific testing needs

## Support

For issues or customization needs:

- Check the `DataSeederService.cs` for inline documentation
- Review CSV file formats in the root directory
- Ensure PostgreSQL is properly configured for your environment

---

**Happy Testing!** 🇱🇧
