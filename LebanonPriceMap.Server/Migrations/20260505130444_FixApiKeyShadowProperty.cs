using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LebanonPriceMap.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixApiKeyShadowProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // The shadow property StoreId1 does not exist in the database, 
            // so we do nothing here to keep the migration history clean.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "StoreId1",
                table: "store_api_keys",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_store_api_keys_StoreId1",
                table: "store_api_keys",
                column: "StoreId1");

            migrationBuilder.AddForeignKey(
                name: "FK_store_api_keys_stores_StoreId1",
                table: "store_api_keys",
                column: "StoreId1",
                principalTable: "stores",
                principalColumn: "id");
        }
    }
}
