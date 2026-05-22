using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LebanonPriceMap.Server.Migrations
{
    public partial class SeedBaseData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "regions",
                columns: new[] { "id", "name", "created_at" },
                values: new object[,]
                {
                    { Guid.Parse("00000000-0000-0000-0000-000000000001"), "Beirut", DateTime.UtcNow },
                    { Guid.Parse("00000000-0000-0000-0000-000000000002"), "Metn", DateTime.UtcNow },
                    { Guid.Parse("00000000-0000-0000-0000-000000000003"), "Keserwan", DateTime.UtcNow },
                    { Guid.Parse("00000000-0000-0000-0000-000000000004"), "Tripoli", DateTime.UtcNow },
                    { Guid.Parse("00000000-0000-0000-0000-000000000005"), "Sidon", DateTime.UtcNow },
                    { Guid.Parse("00000000-0000-0000-0000-000000000006"), "Zahle", DateTime.UtcNow }
                }
            );

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "id", "name", "sort_order", "created_at", "updated_at" },
                values: new object[,]
                {
                    { Guid.Parse("11000000-0000-0000-0000-000000000001"), "Dairy", 1, DateTime.UtcNow, DateTime.UtcNow },
                    { Guid.Parse("11000000-0000-0000-0000-000000000002"), "Bakery", 2, DateTime.UtcNow, DateTime.UtcNow },
                    { Guid.Parse("11000000-0000-0000-0000-000000000003"), "Oil", 3, DateTime.UtcNow, DateTime.UtcNow },
                    { Guid.Parse("11000000-0000-0000-0000-000000000004"), "Fuel", 4, DateTime.UtcNow, DateTime.UtcNow },
                    { Guid.Parse("11000000-0000-0000-0000-000000000005"), "Meat", 5, DateTime.UtcNow, DateTime.UtcNow },
                    { Guid.Parse("11000000-0000-0000-0000-000000000006"), "Grains", 6, DateTime.UtcNow, DateTime.UtcNow },
                    { Guid.Parse("11000000-0000-0000-0000-000000000007"), "Beverages", 7, DateTime.UtcNow, DateTime.UtcNow },
                    { Guid.Parse("11000000-0000-0000-0000-000000000008"), "Produce", 8, DateTime.UtcNow, DateTime.UtcNow }
                }
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(table: "categories", keyColumn: "id", keyValues: new object[]
            {
                Guid.Parse("11000000-0000-0000-0000-000000000001"),
                Guid.Parse("11000000-0000-0000-0000-000000000002"),
                Guid.Parse("11000000-0000-0000-0000-000000000003"),
                Guid.Parse("11000000-0000-0000-0000-000000000004"),
                Guid.Parse("11000000-0000-0000-0000-000000000005"),
                Guid.Parse("11000000-0000-0000-0000-000000000006"),
                Guid.Parse("11000000-0000-0000-0000-000000000007"),
                Guid.Parse("11000000-0000-0000-0000-000000000008")
            });

            migrationBuilder.DeleteData(table: "regions", keyColumn: "id", keyValues: new object[]
            {
                Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Guid.Parse("00000000-0000-0000-0000-000000000003"),
                Guid.Parse("00000000-0000-0000-0000-000000000004"),
                Guid.Parse("00000000-0000-0000-0000-000000000005"),
                Guid.Parse("00000000-0000-0000-0000-000000000006")
            });
        }
    }
}
