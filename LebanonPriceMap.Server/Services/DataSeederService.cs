using LebanonPriceMap.Server.Models;
using LebanonPriceMap.Server.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace LebanonPriceMap.Server.Services
{
    /// <summary>
    /// Service for seeding test data into the database.
    /// Includes users, stores, products, prices, and fuel data.
    /// </summary>
    public class DataSeederService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DataSeederService> _logger;
        private readonly Random _random = new Random();

        // Lebanese cities and regions
        private readonly string[] _cities = 
        { 
            "Beirut", "Tripoli", "Sidon", "Zahle", "Jounieh", "Dbayeh", 
            "Metn", "Keserwan", "Tyre", "Baalbek", "Hermel"
        };

        private readonly string[] _districts = 
        { 
            "Downtown", "Achrafieh", "Mar Mkhael", "Hamra", "Gemmayzeh", "Dora",
            "Mina", "City Center", "Old City", "Ras Beirut", "Badaro"
        };

        private readonly string[] _firstNames = 
        { 
            "Layla", "Rima", "Fouad", "Habib", "Fatima", "Hassan", "Mariam", 
            "Ali", "Hana", "Khalid", "Sara", "Nour", "Dina", "Rashid", "Mona",
            "Amal", "Amira", "Yasmine", "Tarek", "Lina", "Karim", "Hussein", 
            "Diana", "Zainab", "Raed", "Fatema", "Jamal", "Samer", "Ahmed", "Malak"
        };

        private readonly string[] _lastNames = 
        { 
            "Khoury", "Karam", "Gemayel", "Nassar", "Ali", "Ibrahim", "Khalil",
            "Mikati", "Hariri", "Abdo", "Hassan", "Salem", "Rizk", "Assaf", 
            "Mansour", "Rahhal", "Haddad", "Said", "Khalifa", "Barakat", "Farah"
        };

        private readonly string[] _storeChains = 
        { 
            "Spinneys", "Carrefour", "TSC", "Happy", "Bou Khalil", "LCC",
            "ABC Mart", "Star Market", "Martakla", "A-One"
        };

        private readonly string[] _productNames =
        {
            "Whole Milk 1L", "Low Fat Milk 1L", "Eggs 30 Pack", "Yogurt 500g", "Labneh 500g",
            "White Cheese 500g", "Bread Loaf", "Pita Bread", "Croissant", "Manakish",
            "Olive Oil 750ml", "Sunflower Oil 1L", "Canola Oil 750ml", "Butter 250g",
            "Diesel Fuel per L", "Gasoline 95 Octane", "Gasoline 98 Octane",
            "Chicken per kg", "Beef per kg", "Lamb per kg",
            "White Rice 5kg", "Basmati Rice 1kg", "Lentils 1kg", "Beans 1kg",
            "Water 1.5L", "Cola 2L", "Fanta Orange", "Sprite 2L",
            "Tomato per kg", "Cucumber per kg", "Onion per kg", "Garlic per kg",
            "Potato per kg", "Carrot per kg", "Lemon per kg", "Orange per kg"
        };

        private readonly string[] _storeCities =
        {
            "Beirut", "Tripoli", "Sidon", "Zahle", "Jounieh", "Dbayeh"
        };

        public DataSeederService(AppDbContext context, ILogger<DataSeederService> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Seed all test data into the database
        /// </summary>
        public async Task SeedAllAsync()
        {
            try
            {
                _logger.LogInformation("Starting database seeding...");

                // Only seed if database is empty
                if (_context.Users.Any())
                {
                    _logger.LogInformation("Database already has data. Skipping seeding.");
                    return;
                }

                // Seed in order
                await SeedRegionsAndDistrictsAsync();
                await SeedCategoriesAsync();
                await SeedUsersAsync();
                await SeedProductsAsync();
                await SeedStoresAsync();
                await SeedPriceSubmissionsAsync();
                await SeedFuelDataAsync();
                await SeedStoreCatalogAsync();

                await _context.SaveChangesAsync();
                _logger.LogInformation("Database seeding completed successfully!");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error seeding database: {ex.Message}");
                throw;
            }
        }

        private async Task SeedRegionsAndDistrictsAsync()
        {
            _logger.LogInformation("Seeding regions and districts...");

            var regions = new List<Region>
            {
                new Region { Id = Guid.Parse("00000000-0000-0000-0000-000000000001"), Name = "Beirut" },
                new Region { Id = Guid.Parse("00000000-0000-0000-0000-000000000002"), Name = "Metn" },
                new Region { Id = Guid.Parse("00000000-0000-0000-0000-000000000003"), Name = "Keserwan" },
                new Region { Id = Guid.Parse("00000000-0000-0000-0000-000000000004"), Name = "Tripoli" },
                new Region { Id = Guid.Parse("00000000-0000-0000-0000-000000000005"), Name = "Sidon" },
                new Region { Id = Guid.Parse("00000000-0000-0000-0000-000000000006"), Name = "Zahle" }
            };

            await _context.Regions.AddRangeAsync(regions);
            _logger.LogInformation($"Added {regions.Count} regions");
        }

        private async Task SeedCategoriesAsync()
        {
            _logger.LogInformation("Seeding product categories...");

            var categories = new List<Category>
            {
                new Category { Id = Guid.Parse("11000000-0000-0000-0000-000000000001"), Name = "Dairy", SortOrder = 1 },
                new Category { Id = Guid.Parse("11000000-0000-0000-0000-000000000002"), Name = "Bakery", SortOrder = 2 },
                new Category { Id = Guid.Parse("11000000-0000-0000-0000-000000000003"), Name = "Oil", SortOrder = 3 },
                new Category { Id = Guid.Parse("11000000-0000-0000-0000-000000000004"), Name = "Fuel", SortOrder = 4 },
                new Category { Id = Guid.Parse("11000000-0000-0000-0000-000000000005"), Name = "Meat", SortOrder = 5 },
                new Category { Id = Guid.Parse("11000000-0000-0000-0000-000000000006"), Name = "Grains", SortOrder = 6 },
                new Category { Id = Guid.Parse("11000000-0000-0000-0000-000000000007"), Name = "Beverages", SortOrder = 7 },
                new Category { Id = Guid.Parse("11000000-0000-0000-0000-000000000008"), Name = "Produce", SortOrder = 8 }
            };

            await _context.Categories.AddRangeAsync(categories);
            _logger.LogInformation($"Added {categories.Count} categories");
        }

        private async Task SeedUsersAsync()
        {
            _logger.LogInformation("Seeding users...");

            var users = new List<User>();
            var guid = Guid.Parse("10000000-0000-0000-0000-000000000000");

            // Add admin users
            users.Add(CreateUser(ref guid, "admin@wein.app", "Admin User", "admin", 100, "high", 0, 0));
            users.Add(CreateUser(ref guid, "admin2@wein.app", "Admin Manager", "admin", 100, "high", 0, 0));

            // Add retailer users
            users.Add(CreateUser(ref guid, "habib.nassar@test.com", "Habib Nassar", "retailer", 92, "high", 0, 0));
            users.Add(CreateUser(ref guid, "ali.store@test.com", "Ali Store Owner", "retailer", 85, "high", 0, 0));
            users.Add(CreateUser(ref guid, "hussein.fuel@test.com", "Hussein Fuel Station", "retailer", 93, "high", 0, 0));

            // Add 60+ shopper users with varied trust levels
            for (int i = 0; i < 60; i++)
            {
                string firstName = _firstNames[i % _firstNames.Length];
                string lastName = _lastNames[(i / _firstNames.Length) % _lastNames.Length];
                string email = $"{firstName.ToLower()}.{lastName.ToLower()}.{i}@test.com";
                string city = _cities[i % _cities.Length];

                int trustScore = 50 + _random.Next(-45, 51);
                string trustLevel = trustScore >= 75 ? "high" : (trustScore >= 50 ? "medium" : "low");
                int uploadCount = _random.Next(5, 150);
                int verifiedCount = (int)(uploadCount * (trustScore / 100.0));

                users.Add(CreateUser(ref guid, email, $"{firstName} {lastName}", "shopper", trustScore, trustLevel, uploadCount, verifiedCount));
            }

            await _context.Users.AddRangeAsync(users);
            _logger.LogInformation($"Added {users.Count} users");
        }

        private async Task SeedProductsAsync()
        {
            _logger.LogInformation("Seeding products...");

            var categories = await _context.Categories.ToListAsync();
            var products = new List<Product>();
            var productGuid = Guid.Parse("12000000-0000-0000-0000-000000000000");

            // Create diverse set of products
            var categoryMap = new Dictionary<string, Guid>
            {
                { "Dairy", categories.First(c => c.Name == "Dairy").Id },
                { "Bakery", categories.First(c => c.Name == "Bakery").Id },
                { "Oil", categories.First(c => c.Name == "Oil").Id },
                { "Fuel", categories.First(c => c.Name == "Fuel").Id },
                { "Meat", categories.First(c => c.Name == "Meat").Id },
                { "Grains", categories.First(c => c.Name == "Grains").Id },
                { "Beverages", categories.First(c => c.Name == "Beverages").Id },
                { "Produce", categories.First(c => c.Name == "Produce").Id }
            };

            var productDefinitions = new[]
            {
                // Dairy
                (Name: "Whole Milk 1L", NameAr: "حليب كامل الدسم ١ لتر", Unit: "1L", Category: "Dairy", Barcode: "6221012345001"),
                (Name: "Low Fat Milk 1L", NameAr: "حليب قليل الدسم ١ لتر", Unit: "1L", Category: "Dairy", Barcode: "6221012345011"),
                (Name: "Eggs 30 Pack", NameAr: "بيض ٣٠ حبة", Unit: "30 pcs", Category: "Dairy", Barcode: "6221087654321"),
                (Name: "Yogurt 500g", NameAr: "زبادي ٥٠٠ غرام", Unit: "500g", Category: "Dairy", Barcode: "6221012345012"),
                (Name: "Labneh 500g", NameAr: "لبنة ٥٠٠ غرام", Unit: "500g", Category: "Dairy", Barcode: "6221012345013"),
                (Name: "White Cheese 500g", NameAr: "جبنة بيضاء ٥٠٠ غرام", Unit: "500g", Category: "Dairy", Barcode: "6221012345014"),

                // Bakery
                (Name: "Bread Loaf", NameAr: "خبز عربي رغيف", Unit: "loaf", Category: "Bakery", Barcode: "6221099887766"),
                (Name: "Pita Bread 6 Pack", NameAr: "خبز عربي ٦ أرغفة", Unit: "6 pcs", Category: "Bakery", Barcode: "6221012345015"),
                (Name: "Croissant 2 Pack", NameAr: "كرواسون ٢ حبة", Unit: "2 pcs", Category: "Bakery", Barcode: "6221012345016"),
                (Name: "Manakish 7 pieces", NameAr: "مناقيش (٧ حبات)", Unit: "7 pcs", Category: "Bakery", Barcode: "6221012345030"),

                // Oil
                (Name: "Olive Oil 750ml", NameAr: "زيت زيتون ممتاز ٧٥٠مل", Unit: "750ml", Category: "Oil", Barcode: "6221055443322"),
                (Name: "Sunflower Oil 1L", NameAr: "زيت دوار الشمس ١ لتر", Unit: "1L", Category: "Oil", Barcode: "6221012345017"),
                (Name: "Canola Oil 750ml", NameAr: "زيت الكانولا ٧٥٠ مل", Unit: "750ml", Category: "Oil", Barcode: "6221012345018"),
                (Name: "Butter 250g", NameAr: "زبدة ٢٥٠ غرام", Unit: "250g", Category: "Oil", Barcode: "6221012345031"),

                // Fuel
                (Name: "Diesel per Liter", NameAr: "ديزل لكل لتر", Unit: "per L", Category: "Fuel", Barcode: "6221011223344"),
                (Name: "Gasoline 95 Octane", NameAr: "بنزين ٩٥ أوكتان", Unit: "per L", Category: "Fuel", Barcode: "6221066778899"),
                (Name: "Gasoline 98 Octane", NameAr: "بنزين ٩٨ أوكتان", Unit: "per L", Category: "Fuel", Barcode: "6221012345019"),

                // Meat
                (Name: "Chicken per kg", NameAr: "دجاج كيلو", Unit: "kg", Category: "Meat", Barcode: "6221012345007"),
                (Name: "Beef per kg", NameAr: "لحم بقري كيلو", Unit: "kg", Category: "Meat", Barcode: "6221012345020"),
                (Name: "Lamb per kg", NameAr: "لحم ضأن كيلو", Unit: "kg", Category: "Meat", Barcode: "6221012345021"),

                // Grains
                (Name: "Egyptian Rice 5kg", NameAr: "أرز أبيض مصري ٥ كيلو", Unit: "5kg", Category: "Grains", Barcode: "6221012345008"),
                (Name: "Basmati Rice 1kg", NameAr: "أرز بسمتي ١ كيلو", Unit: "1kg", Category: "Grains", Barcode: "6221012345022"),
                (Name: "Lentils 1kg", NameAr: "عدس ١ كيلو", Unit: "1kg", Category: "Grains", Barcode: "6221012345023"),
                (Name: "Beans 1kg", NameAr: "فاصوليا ١ كيلو", Unit: "1kg", Category: "Grains", Barcode: "6221012345032"),

                // Beverages
                (Name: "Water 1.5L", NameAr: "مياه معبأة ١.٥ لتر", Unit: "1.5L", Category: "Beverages", Barcode: "6221012345009"),
                (Name: "Cola 2L", NameAr: "كولا ٢ لتر", Unit: "2L", Category: "Beverages", Barcode: "6221012345024"),
                (Name: "Fanta Orange 2L", NameAr: "فانتا برتقالي ٢ لتر", Unit: "2L", Category: "Beverages", Barcode: "6221012345025"),
                (Name: "Sprite 2L", NameAr: "سبرايت ٢ لتر", Unit: "2L", Category: "Beverages", Barcode: "6221012345033"),

                // Produce
                (Name: "Tomato per kg", NameAr: "طماطم كيلو", Unit: "kg", Category: "Produce", Barcode: "6221012345026"),
                (Name: "Cucumber per kg", NameAr: "خيار كيلو", Unit: "kg", Category: "Produce", Barcode: "6221012345027"),
                (Name: "Onion per kg", NameAr: "بصل كيلو", Unit: "kg", Category: "Produce", Barcode: "6221012345028"),
                (Name: "Garlic per kg", NameAr: "ثوم كيلو", Unit: "kg", Category: "Produce", Barcode: "6221012345029"),
                (Name: "Lemon per kg", NameAr: "ليمون كيلو", Unit: "kg", Category: "Produce", Barcode: null),
                (Name: "Potato per kg", NameAr: "بطاطا كيلو", Unit: "kg", Category: "Produce", Barcode: "6221012345034"),
                (Name: "Carrot per kg", NameAr: "جزر كيلو", Unit: "kg", Category: "Produce", Barcode: "6221012345035"),
                (Name: "Orange per kg", NameAr: "برتقال كيلو", Unit: "kg", Category: "Produce", Barcode: "6221012345036"),
            };

            foreach (var def in productDefinitions)
            {
                products.Add(new Product
                {
                    Id = productGuid,
                    Name = def.Name,
                    NameAr = def.NameAr,
                    Unit = def.Unit,
                    CategoryId = categoryMap[def.Category],
                    Barcode = def.Barcode,
                    UploadCount = _random.Next(50, 300),
                    IsArchived = false,
                    CreatedAt = DateTime.UtcNow
                });
                productGuid = new Guid(productGuid.ToByteArray().Select((b, i) => i == 15 ? (byte)(b + 1) : b).ToArray());
            }

            await _context.Products.AddRangeAsync(products);
            _logger.LogInformation($"Added {products.Count} products");
        }

        private async Task SeedStoresAsync()
        {
            _logger.LogInformation("Seeding stores...");

            var stores = new List<Store>();
            var storeGuid = Guid.Parse("13000000-0000-0000-0000-000000000000");
            var users = await _context.Users.Where(u => u.Role == "retailer").ToListAsync();
            var storeChainDefinitions = new[]
            {
                ("Spinneys", 96, new (string, string, decimal, decimal)[] 
                { 
                    ("Beirut", "Achrafieh", 33.8886m, 35.5160m),
                    ("Tripoli", "City Center", 34.4372m, 35.8516m),
                    ("Sidon", "City Center", 33.5631m, 35.3704m),
                    ("Dbayeh", "Dbayeh", 33.9375m, 35.5955m),
                    ("Jounieh", "Jounieh", 33.9730m, 35.6265m)
                }),
                ("Carrefour", 93, new (string, string, decimal, decimal)[]
                {
                    ("Beirut", "Dora", 33.9020m, 35.5750m),
                    ("Zahle", "City Center", 33.8560m, 35.8900m),
                    ("Dbayeh", "Dbayeh", 33.9365m, 35.5950m)
                }),
                ("TSC", 92, new (string, string, decimal, decimal)[]
                {
                    ("Dbayeh", "Dbayeh", 33.9370m, 35.5950m),
                    ("Zahle", "City Center", 33.8551m, 35.8875m),
                    ("Jounieh", "Jounieh", 33.9720m, 35.6251m)
                }),
                ("Happy", 89, new (string, string, decimal, decimal)[]
                {
                    ("Beirut", "Mar Mkhael", 33.8840m, 35.5130m)
                }),
                ("Bou Khalil", 91, new (string, string, decimal, decimal)[]
                {
                    ("Beirut", "Hamra", 33.8950m, 35.4850m)
                }),
                ("LCC", 90, new (string, string, decimal, decimal)[]
                {
                    ("Tripoli", "Mina", 34.4443m, 35.8301m)
                })
            };

            // Add chain stores
            foreach (var (chainName, trustScore, locations) in storeChainDefinitions)
            {
                foreach (var (city, district, lat, lng) in locations)
                {
                    var store = new Store
                    {
                        Id = storeGuid,
                        Name = $"{chainName} {district}",
                        Chain = chainName,
                        City = city,
                        District = district,
                        Region = _cities.Contains(city) ? city : "Other",
                        Latitude = lat,
                        Longitude = lng,
                        TrustScore = (short)trustScore,
                        Status = "verified",
                        IsVerifiedRetailer = true,
                        PowerStatus = new[] { "stable", "unstable", "reported_warm" }[_random.Next(3)],
                        InternalRateLbp = 89000 + _random.Next(0, 5000),
                        CreatedAt = DateTime.UtcNow
                    };
                    stores.Add(store);
                    storeGuid = new Guid(storeGuid.ToByteArray().Select((b, i) => i == 15 ? (byte)(b + 1) : b).ToArray());
                }
            }

            // Add independent stores
            for (int i = 0; i < 15; i++)
            {
                string city = _storeCities[i % _storeCities.Length];
                string district = _districts[i % _districts.Length];
                
                var store = new Store
                {
                    Id = storeGuid,
                    OwnerUserId = users.Count > 0 ? users[i % users.Count].Id : null,
                    Name = $"Market {district} {i + 1}",
                    City = city,
                    District = district,
                    Region = city,
                    Latitude = 33.5m + (decimal)_random.NextDouble() * 1,
                    Longitude = 35.0m + (decimal)_random.NextDouble() * 1,
                    TrustScore = (short)(70 + _random.Next(0, 30)),
                    Status = "verified",
                    IsVerifiedRetailer = _random.NextDouble() > 0.5,
                    PowerStatus = "stable",
                    InternalRateLbp = 89000 + _random.Next(0, 5000),
                    CreatedAt = DateTime.UtcNow
                };
                stores.Add(store);
                storeGuid = new Guid(storeGuid.ToByteArray().Select((b, i) => i == 15 ? (byte)(b + 1) : b).ToArray());
            }

            // Add fuel stations
            for (int i = 0; i < 8; i++)
            {
                string city = _storeCities[i % _storeCities.Length];
                var store = new Store
                {
                    Id = storeGuid,
                    OwnerUserId = i < users.Count ? users[i].Id : null,
                    Name = $"Fuel Station {city} {i + 1}",
                    Chain = $"{city} Fuel",
                    City = city,
                    District = _districts[i % _districts.Length],
                    Region = city,
                    Latitude = 33.5m + (decimal)_random.NextDouble() * 1,
                    Longitude = 35.0m + (decimal)_random.NextDouble() * 1,
                    TrustScore = (short)(85 + _random.Next(0, 15)),
                    Status = "verified",
                    IsVerifiedRetailer = true,
                    PowerStatus = "stable",
                    InternalRateLbp = 88000 + _random.Next(0, 4000),
                    CreatedAt = DateTime.UtcNow
                };
                stores.Add(store);
                storeGuid = new Guid(storeGuid.ToByteArray().Select((b, i) => i == 15 ? (byte)(b + 1) : b).ToArray());
            }

            await _context.Stores.AddRangeAsync(stores);
            _logger.LogInformation($"Added {stores.Count} stores");
        }

        private async Task SeedPriceSubmissionsAsync()
        {
            _logger.LogInformation("Seeding price submissions...");

            var stores = await _context.Stores.ToListAsync();
            var products = await _context.Products.ToListAsync();
            var users = await _context.Users.Where(u => u.Role == "shopper").ToListAsync();

            var submissions = new List<PriceSubmission>();
            var submissionGuid = Guid.Parse("14000000-0000-0000-0000-000000000000");

            // Create 200+ price submissions
            for (int i = 0; i < 200; i++)
            {
                var store = stores[i % stores.Count];
                var product = products[i % products.Count];
                var user = users[i % users.Count];

                var basePrice = 50000 + _random.Next(0, 600000);
                var isPromo = _random.NextDouble() > 0.7;
                var promoPrice = isPromo ? (int)(basePrice * (0.8 + _random.NextDouble() * 0.15)) : 0;

                var submission = new PriceSubmission
                {
                    Id = submissionGuid,
                    StoreId = store.Id,
                    ProductId = product.Id,
                    SubmittedBy = user.Id,
                    Source = _random.NextDouble() > 0.8 ? SubmissionSource.official : SubmissionSource.community,
                    SubmissionStatus = _random.NextDouble() switch
                    {
                        > 0.8 => SubmissionStatus.pending,
                        > 0.1 => SubmissionStatus.verified,
                        _ => SubmissionStatus.flagged
                    },
                    PriceLbp = basePrice,
                    IsPromotion = isPromo,
                    PromoEndsAt = isPromo ? DateTime.UtcNow.AddDays(_random.Next(5, 30)) : null,
                    SubmitterTrustScore = (short)user.TrustScore,
                    Upvotes = _random.Next(0, 50),
                    Downvotes = _random.Next(0, 10),
                    IsDisputed = _random.NextDouble() > 0.9,
                    VerifiedBy = _random.NextDouble() > 0.3 ? users.FirstOrDefault(u => u.Role == "admin")?.Id : null,
                    VerifiedAt = _random.NextDouble() > 0.3 ? DateTime.UtcNow.AddDays(-_random.Next(0, 30)) : null,
                    CreatedAt = DateTime.UtcNow.AddDays(-_random.Next(0, 60))
                };
                submissions.Add(submission);
                submissionGuid = new Guid(submissionGuid.ToByteArray().Select((b, i) => i == 15 ? (byte)(b + 1) : b).ToArray());
            }

            await _context.PriceSubmissions.AddRangeAsync(submissions);
            _logger.LogInformation($"Added {submissions.Count} price submissions");
        }

        private async Task SeedFuelDataAsync()
        {
            _logger.LogInformation("Seeding fuel data...");

            var fuelPrices = new List<FuelPrice>();
            var fuelGuid = Guid.Parse("19000000-0000-0000-0000-000000000000");

            var fuelTypes = new[] { "gasoline_95", "gasoline_98", "diesel" };
            var baseDate = DateTime.UtcNow;

            for (int week = 0; week < 4; week++)
            {
                foreach (var fuelType in fuelTypes)
                {
                    var basePrice = fuelType switch
                    {
                        "gasoline_95" => 894000,
                        "gasoline_98" => 952000,
                        _ => 756000
                    };

                    var price = new FuelPrice
                    {
                        Id = fuelGuid,
                        FuelType = fuelType,
                        OfficialPriceLbp = basePrice + _random.Next(-10000, 10000),
                        ReportedPriceLbp = basePrice + _random.Next(-5000, 20000),
                        EffectiveFrom = baseDate.AddDays(-(week * 7)),
                        EffectiveTo = baseDate.AddDays(-(week * 7) + 7),
                        Source = "Ministry of Energy Lebanon"
                    };
                    fuelPrices.Add(price);
                    fuelGuid = new Guid(fuelGuid.ToByteArray().Select((b, i) => i == 15 ? (byte)(b + 1) : b).ToArray());
                }
            }

            await _context.FuelPrices.AddRangeAsync(fuelPrices);
            _logger.LogInformation($"Added {fuelPrices.Count} fuel price records");
        }

        private async Task SeedStoreCatalogAsync()
        {
            _logger.LogInformation("Seeding store catalog...");

            var stores = await _context.Stores.ToListAsync();
            var products = await _context.Products.ToListAsync();
            var users = await _context.Users.ToListAsync();

            var catalogItems = new List<StoreCatalogItem>();
            var catalogGuid = Guid.Parse("1b000000-0000-0000-0000-000000000000");

            // Create catalog items for each store
            foreach (var store in stores)
            {
                int itemsPerStore = _random.Next(15, 35);
                var selectedProducts = products.OrderBy(x => _random.Next()).Take(itemsPerStore);

                foreach (var product in selectedProducts)
                {
                    var basePrice = 50000 + _random.Next(0, 600000);
                    var isPromo = _random.NextDouble() > 0.8;
                    var promoPrice = isPromo ? (int)(basePrice * (0.8 + _random.NextDouble() * 0.15)) : (int?)null;

                    var item = new StoreCatalogItem
                    {
                        Id = catalogGuid,
                        StoreId = store.Id,
                        ProductId = product.Id,
                        OfficialPriceLbp = basePrice,
                        PromoPriceLbp = (decimal?)promoPrice,
                        PromoEndsAt = isPromo ? DateTime.UtcNow.AddDays(_random.Next(5, 30)) : null,
                        IsInStock = _random.NextDouble() > 0.1,
                        IsPromotion = isPromo,
                        LastUpdatedBy = users[_random.Next(users.Count)].Id,
                        LastUpdatedAt = DateTime.UtcNow.AddDays(-_random.Next(0, 30)),
                        CreatedAt = DateTime.UtcNow.AddDays(-_random.Next(30, 90))
                    };
                    catalogItems.Add(item);
                    catalogGuid = new Guid(catalogGuid.ToByteArray().Select((b, i) => i == 15 ? (byte)(b + 1) : b).ToArray());
                }
            }

            await _context.StoreCatalogItems.AddRangeAsync(catalogItems);
            _logger.LogInformation($"Added {catalogItems.Count} catalog items");
        }

        private User CreateUser(ref Guid guid, string email, string name, string role, int trustScore, string trustLevel, int uploadCount, int verifiedCount)
        {
            var user = new User
            {
                Id = guid,
                Email = email,
                Name = name,
                Role = role,
                Status = trustScore < 30 ? "suspended" : (trustScore < 50 ? "warned" : "active"),
                PasswordHash = HashPassword("test123456"),
                AvatarInitials = string.Concat(name.Split(' ').Select(s => s[0])),
                City = _cities[_random.Next(_cities.Length)],
                TrustScore = trustScore,
                TrustLevel = trustLevel,
                UploadCount = uploadCount,
                VerifiedCount = verifiedCount,
                JoinedAt = DateTime.UtcNow.AddDays(-_random.Next(30, 500)),
                CreatedAt = DateTime.UtcNow
            };

            guid = new Guid(guid.ToByteArray().Select((b, i) => i == 15 ? (byte)(b + 1) : b).ToArray());
            return user;
        }

        private string HashPassword(string password)
        {
            // Using simple BCrypt hashing - all test users use same hash for "test123456"
            return "$2b$11$qVHHuAIJnxxUayG26gHv3ehrUmKsMyFNYQq0CtHWgHHRAbGe0hCZ2";
        }
    }
}
