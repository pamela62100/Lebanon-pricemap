using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LebanonPriceMap.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSyncModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Enums already exist in database

            migrationBuilder.AlterColumn<string>(
                name: "message",
                table: "store_sync_runs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "raw_name",
                table: "store_sync_items",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "raw_barcode",
                table: "store_sync_items",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "fail_reason",
                table: "store_sync_items",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<SubmissionStatus>(
                name: "submission_status",
                table: "price_submissions",
                type: "submission_status",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<SubmissionSource>(
                name: "source",
                table: "price_submissions",
                type: "submission_source",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "ocr_payload",
                table: "price_submissions",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<SubmissionSource>(
                name: "source",
                table: "current_store_product_prices",
                type: "submission_source",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "review_note",
                table: "catalog_discrepancy_reports",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "note",
                table: "catalog_discrepancy_reports",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:alert_status", "active,deleted,paused,triggered")
                .Annotation("Npgsql:Enum:sync_method", "manual,csv,api")
                .Annotation("Npgsql:Enum:sync_status", "running,ok,fail,partial")
                .OldAnnotation("Npgsql:Enum:alert_status", "active,deleted,paused,triggered")
                .OldAnnotation("Npgsql:Enum:submission_source", "community,official,manual,api,csv")
                .OldAnnotation("Npgsql:Enum:submission_status", "pending,verified,rejected,flagged,superseded")
                .OldAnnotation("Npgsql:Enum:sync_method", "manual,csv,api")
                .OldAnnotation("Npgsql:Enum:sync_status", "running,ok,fail,partial");

            migrationBuilder.AlterColumn<string>(
                name: "message",
                table: "store_sync_runs",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "raw_name",
                table: "store_sync_items",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "raw_barcode",
                table: "store_sync_items",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "fail_reason",
                table: "store_sync_items",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "submission_status",
                table: "price_submissions",
                type: "text",
                nullable: false,
                oldClrType: typeof(SubmissionStatus),
                oldType: "submission_status");

            migrationBuilder.AlterColumn<string>(
                name: "source",
                table: "price_submissions",
                type: "text",
                nullable: false,
                oldClrType: typeof(SubmissionSource),
                oldType: "submission_source");

            migrationBuilder.AlterColumn<string>(
                name: "ocr_payload",
                table: "price_submissions",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "jsonb");

            migrationBuilder.AlterColumn<string>(
                name: "source",
                table: "current_store_product_prices",
                type: "text",
                nullable: false,
                oldClrType: typeof(SubmissionSource),
                oldType: "submission_source");

            migrationBuilder.AlterColumn<string>(
                name: "review_note",
                table: "catalog_discrepancy_reports",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "note",
                table: "catalog_discrepancy_reports",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
