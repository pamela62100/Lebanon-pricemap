using System;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LebanonPriceMap.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSyncSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // The tables already exist, so we do nothing here
            // but keep the migration to mark it as applied.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
