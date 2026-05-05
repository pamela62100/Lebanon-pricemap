using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LebanonPriceMap.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixSyncEnums : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add 'running' to the sync_status enum in the database
            migrationBuilder.Sql("DO $$ BEGIN ALTER TYPE sync_status ADD VALUE 'running'; EXCEPTION WHEN duplicate_object THEN null; END $$;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
