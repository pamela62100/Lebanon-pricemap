using System;
using LebanonPriceMap.Server.Models;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LebanonPriceMap.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:alert_status", "active,deleted,paused,triggered")
                .Annotation("Npgsql:Enum:catalog_change_reason", "owner_update,system_sync,admin_override,report_correction,promo_ended")
                .Annotation("Npgsql:Enum:submission_source", "community,official,manual,api,csv")
                .Annotation("Npgsql:Enum:submission_status", "pending,verified,rejected,flagged,superseded")
                .Annotation("Npgsql:Enum:sync_method", "manual,csv,api")
                .Annotation("Npgsql:Enum:sync_status", "running,ok,fail,partial");

            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "fuel_prices",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    fuel_type = table.Column<string>(type: "text", nullable: false),
                    official_price_lbp = table.Column<decimal>(type: "numeric", nullable: false),
                    reported_price_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    effective_from = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    effective_to = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    source = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fuel_prices", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "password_reset_tokens",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    token_hash = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    used_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_password_reset_tokens", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "regions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_regions", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "system_broadcasts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    severity = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    starts_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ends_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    priority = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_system_broadcasts", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    role = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    avatar_initials = table.Column<string>(type: "text", nullable: true),
                    city = table.Column<string>(type: "text", nullable: true),
                    trust_score = table.Column<int>(type: "integer", nullable: false),
                    trust_level = table.Column<string>(type: "text", nullable: false),
                    upload_count = table.Column<int>(type: "integer", nullable: false),
                    verified_count = table.Column<int>(type: "integer", nullable: false),
                    joined_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    last_login_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "districts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    region_id = table.Column<Guid>(type: "uuid", nullable: true),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_districts", x => x.id);
                    table.ForeignKey(
                        name: "FK_districts_regions_region_id",
                        column: x => x.region_id,
                        principalTable: "regions",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "carts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_carts", x => x.id);
                    table.ForeignKey(
                        name: "FK_carts_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "price_confirmations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    price_submission_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_price_confirmations", x => x.id);
                    table.ForeignKey(
                        name: "FK_price_confirmations_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    category_id = table.Column<Guid>(type: "uuid", nullable: true),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    name_ar = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    unit = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    brand = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    barcode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    upload_count = table.Column<int>(type: "integer", nullable: false),
                    is_archived = table.Column<bool>(type: "boolean", nullable: false),
                    merged_into_product_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products", x => x.id);
                    table.ForeignKey(
                        name: "FK_products_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "categories",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_products_products_merged_into_product_id",
                        column: x => x.merged_into_product_id,
                        principalTable: "products",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_products_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "stores",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    owner_user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    chain = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    district = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    region = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    address_line_1 = table.Column<string>(type: "text", nullable: true),
                    latitude = table.Column<decimal>(type: "numeric", nullable: true),
                    longitude = table.Column<decimal>(type: "numeric", nullable: true),
                    logo_url = table.Column<string>(type: "text", nullable: true),
                    cover_image_url = table.Column<string>(type: "text", nullable: true),
                    trust_score = table.Column<short>(type: "smallint", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    is_verified_retailer = table.Column<bool>(type: "boolean", nullable: false),
                    power_status = table.Column<string>(type: "text", nullable: false),
                    internal_rate_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    sync_method = table.Column<SyncMethod>(type: "sync_method", nullable: false),
                    api_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_stores", x => x.id);
                    table.ForeignKey(
                        name: "FK_stores_users_owner_user_id",
                        column: x => x.owner_user_id,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "system_settings",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    key = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    value = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_system_settings", x => x.id);
                    table.ForeignKey(
                        name: "FK_system_settings_users_updated_by",
                        column: x => x.updated_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "price_alerts",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    threshold_lbp = table.Column<decimal>(type: "numeric", nullable: false),
                    verified_only = table.Column<bool>(type: "boolean", nullable: false),
                    status = table.Column<AlertStatus>(type: "alert_status", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_price_alerts", x => x.id);
                    table.ForeignKey(
                        name: "FK_price_alerts_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_price_alerts_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "product_aliases",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    alias = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    language_code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_product_aliases", x => x.id);
                    table.ForeignKey(
                        name: "FK_product_aliases_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "cart_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    cart_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: true),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cart_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_cart_items_carts_cart_id",
                        column: x => x.cart_id,
                        principalTable: "carts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_cart_items_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_cart_items_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "missing_product_requests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: true),
                    product_name_freetext = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    requested_by = table.Column<Guid>(type: "uuid", nullable: true),
                    requester_trust_score = table.Column<short>(type: "smallint", nullable: true),
                    note = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    review_note = table.Column<string>(type: "text", nullable: false),
                    reviewed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    resolved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_missing_product_requests", x => x.id);
                    table.ForeignKey(
                        name: "FK_missing_product_requests_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_missing_product_requests_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_missing_product_requests_users_requested_by",
                        column: x => x.requested_by,
                        principalTable: "users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_missing_product_requests_users_reviewed_by",
                        column: x => x.reviewed_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "price_submissions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    submitted_by = table.Column<Guid>(type: "uuid", nullable: true),
                    source = table.Column<SubmissionSource>(type: "submission_source", nullable: false),
                    submission_status = table.Column<SubmissionStatus>(type: "submission_status", nullable: false),
                    price_lbp = table.Column<decimal>(type: "numeric", nullable: false),
                    is_promotion = table.Column<bool>(type: "boolean", nullable: false),
                    promo_ends_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    receipt_image_url = table.Column<string>(type: "text", nullable: true),
                    note = table.Column<string>(type: "text", nullable: true),
                    submitter_trust_score = table.Column<short>(type: "smallint", nullable: true),
                    upvotes = table.Column<int>(type: "integer", nullable: false),
                    downvotes = table.Column<int>(type: "integer", nullable: false),
                    is_disputed = table.Column<bool>(type: "boolean", nullable: false),
                    dispute_reason = table.Column<string>(type: "text", nullable: true),
                    ocr_store_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ocr_product_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ocr_barcode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ocr_price_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    ocr_payload = table.Column<string>(type: "jsonb", nullable: true),
                    mismatch_detected = table.Column<bool>(type: "boolean", nullable: false),
                    mismatch_reason = table.Column<string>(type: "text", nullable: true),
                    verified_by = table.Column<Guid>(type: "uuid", nullable: true),
                    verified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    rejected_by = table.Column<Guid>(type: "uuid", nullable: true),
                    rejected_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    superseded_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_price_submissions", x => x.id);
                    table.ForeignKey(
                        name: "FK_price_submissions_price_submissions_superseded_by",
                        column: x => x.superseded_by,
                        principalTable: "price_submissions",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_price_submissions_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_price_submissions_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_price_submissions_users_rejected_by",
                        column: x => x.rejected_by,
                        principalTable: "users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_price_submissions_users_submitted_by",
                        column: x => x.submitted_by,
                        principalTable: "users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_price_submissions_users_verified_by",
                        column: x => x.verified_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "station_reports",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    fuel_type = table.Column<string>(type: "text", nullable: false),
                    is_open = table.Column<bool>(type: "boolean", nullable: false),
                    has_stock = table.Column<bool>(type: "boolean", nullable: false),
                    queue_minutes = table.Column<int>(type: "integer", nullable: false),
                    queue_depth = table.Column<int>(type: "integer", nullable: false),
                    is_rationed = table.Column<bool>(type: "boolean", nullable: false),
                    limit_amount_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    reported_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_station_reports", x => x.id);
                    table.ForeignKey(
                        name: "FK_station_reports_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_station_reports_users_reported_by",
                        column: x => x.reported_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "store_api_keys",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    api_key_hash = table.Column<string>(type: "text", nullable: false),
                    key_label = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    last_used_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    revoked_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_store_api_keys", x => x.id);
                    table.ForeignKey(
                        name: "FK_store_api_keys_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_store_api_keys_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "store_catalog_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    official_price_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    promo_price_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    promo_ends_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_in_stock = table.Column<bool>(type: "boolean", nullable: false),
                    is_promotion = table.Column<bool>(type: "boolean", nullable: false),
                    last_updated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    last_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_store_catalog_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_store_catalog_items_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_store_catalog_items_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_store_catalog_items_users_last_updated_by",
                        column: x => x.last_updated_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "store_promotions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    discount_percent = table.Column<decimal>(type: "numeric", nullable: true),
                    original_price_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    promo_price_lbp = table.Column<decimal>(type: "numeric", nullable: false),
                    starts_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ends_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<string>(type: "text", nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_store_promotions", x => x.id);
                    table.ForeignKey(
                        name: "FK_store_promotions_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_store_promotions_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_store_promotions_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "store_sync_runs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    method = table.Column<SyncMethod>(type: "sync_method", nullable: false),
                    status = table.Column<SyncStatus>(type: "sync_status", nullable: false),
                    records_received = table.Column<int>(type: "integer", nullable: true),
                    records_processed = table.Column<int>(type: "integer", nullable: true),
                    records_failed = table.Column<int>(type: "integer", nullable: true),
                    message = table.Column<string>(type: "text", nullable: true),
                    started_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    finished_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_store_sync_runs", x => x.id);
                    table.ForeignKey(
                        name: "FK_store_sync_runs_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_store_sync_runs_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "price_alert_regions",
                columns: table => new
                {
                    alert_id = table.Column<Guid>(type: "uuid", nullable: false),
                    region_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_price_alert_regions", x => new { x.alert_id, x.region_id });
                    table.ForeignKey(
                        name: "FK_price_alert_regions_price_alerts_alert_id",
                        column: x => x.alert_id,
                        principalTable: "price_alerts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_price_alert_regions_regions_region_id",
                        column: x => x.region_id,
                        principalTable: "regions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "admin_audit_logs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    performed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    action = table.Column<string>(type: "text", nullable: false),
                    target_user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    target_price_entry_id = table.Column<Guid>(type: "uuid", nullable: true),
                    target_product_id = table.Column<Guid>(type: "uuid", nullable: true),
                    note = table.Column<string>(type: "text", nullable: false),
                    metadata = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admin_audit_logs", x => x.id);
                    table.ForeignKey(
                        name: "FK_admin_audit_logs_price_submissions_target_price_entry_id",
                        column: x => x.target_price_entry_id,
                        principalTable: "price_submissions",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_admin_audit_logs_products_target_product_id",
                        column: x => x.target_product_id,
                        principalTable: "products",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_admin_audit_logs_users_performed_by",
                        column: x => x.performed_by,
                        principalTable: "users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_admin_audit_logs_users_target_user_id",
                        column: x => x.target_user_id,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "current_store_product_prices",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    latest_submission_id = table.Column<Guid>(type: "uuid", nullable: true),
                    current_price_lbp = table.Column<decimal>(type: "numeric", nullable: false),
                    source = table.Column<SubmissionSource>(type: "submission_source", nullable: false),
                    confidence_score = table.Column<short>(type: "smallint", nullable: false),
                    confirmation_count = table.Column<int>(type: "integer", nullable: false),
                    trust_level = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    is_verified = table.Column<bool>(type: "boolean", nullable: false),
                    is_in_stock = table.Column<bool>(type: "boolean", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_current_store_product_prices", x => x.id);
                    table.ForeignKey(
                        name: "FK_current_store_product_prices_price_submissions_latest_submi~",
                        column: x => x.latest_submission_id,
                        principalTable: "price_submissions",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_current_store_product_prices_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_current_store_product_prices_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "moderation_cases",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    price_submission_id = table.Column<Guid>(type: "uuid", nullable: false),
                    case_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    severity = table.Column<string>(type: "text", nullable: false),
                    case_note = table.Column<string>(type: "text", nullable: true),
                    assigned_to = table.Column<Guid>(type: "uuid", nullable: true),
                    resolved_by = table.Column<Guid>(type: "uuid", nullable: true),
                    resolved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_moderation_cases", x => x.id);
                    table.ForeignKey(
                        name: "FK_moderation_cases_price_submissions_price_submission_id",
                        column: x => x.price_submission_id,
                        principalTable: "price_submissions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_moderation_cases_users_assigned_to",
                        column: x => x.assigned_to,
                        principalTable: "users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_moderation_cases_users_resolved_by",
                        column: x => x.resolved_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    message = table.Column<string>(type: "text", nullable: false),
                    related_price_entry_id = table.Column<Guid>(type: "uuid", nullable: true),
                    related_store_id = table.Column<Guid>(type: "uuid", nullable: true),
                    related_product_id = table.Column<Guid>(type: "uuid", nullable: true),
                    related_alert_id = table.Column<Guid>(type: "uuid", nullable: true),
                    is_read = table.Column<bool>(type: "boolean", nullable: false),
                    read_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notifications", x => x.id);
                    table.ForeignKey(
                        name: "FK_notifications_price_alerts_related_alert_id",
                        column: x => x.related_alert_id,
                        principalTable: "price_alerts",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_notifications_price_submissions_related_price_entry_id",
                        column: x => x.related_price_entry_id,
                        principalTable: "price_submissions",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_notifications_products_related_product_id",
                        column: x => x.related_product_id,
                        principalTable: "products",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_notifications_stores_related_store_id",
                        column: x => x.related_store_id,
                        principalTable: "stores",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_notifications_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "price_anomalies",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    price_submission_id = table.Column<Guid>(type: "uuid", nullable: true),
                    old_price_lbp = table.Column<decimal>(type: "numeric", nullable: false),
                    new_price_lbp = table.Column<decimal>(type: "numeric", nullable: false),
                    change_percent = table.Column<decimal>(type: "numeric", nullable: false),
                    severity = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    detected_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    investigated_by = table.Column<Guid>(type: "uuid", nullable: true),
                    investigated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    resolution_note = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_price_anomalies", x => x.id);
                    table.ForeignKey(
                        name: "FK_price_anomalies_price_submissions_price_submission_id",
                        column: x => x.price_submission_id,
                        principalTable: "price_submissions",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_price_anomalies_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_price_anomalies_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_price_anomalies_users_investigated_by",
                        column: x => x.investigated_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "station_report_confirmations",
                columns: table => new
                {
                    report_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_station_report_confirmations", x => new { x.report_id, x.user_id });
                    table.ForeignKey(
                        name: "FK_station_report_confirmations_station_reports_report_id",
                        column: x => x.report_id,
                        principalTable: "station_reports",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_station_report_confirmations_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "catalog_discrepancy_reports",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    catalog_item_id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    reported_by = table.Column<Guid>(type: "uuid", nullable: true),
                    reporter_trust_score = table.Column<short>(type: "smallint", nullable: true),
                    report_type = table.Column<string>(type: "text", nullable: false),
                    observed_price_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    note = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "text", nullable: false),
                    approved_new_price_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    review_note = table.Column<string>(type: "text", nullable: true),
                    reviewed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    resolved_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_catalog_discrepancy_reports", x => x.id);
                    table.ForeignKey(
                        name: "FK_catalog_discrepancy_reports_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_catalog_discrepancy_reports_store_catalog_items_catalog_ite~",
                        column: x => x.catalog_item_id,
                        principalTable: "store_catalog_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_catalog_discrepancy_reports_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_catalog_discrepancy_reports_users_reported_by",
                        column: x => x.reported_by,
                        principalTable: "users",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_catalog_discrepancy_reports_users_reviewed_by",
                        column: x => x.reviewed_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "store_sync_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    sync_run_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: true),
                    raw_name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    raw_barcode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    raw_price = table.Column<decimal>(type: "numeric", nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    fail_reason = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_store_sync_items", x => x.id);
                    table.ForeignKey(
                        name: "FK_store_sync_items_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_store_sync_items_store_sync_runs_sync_run_id",
                        column: x => x.sync_run_id,
                        principalTable: "store_sync_runs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "catalog_audit_entries",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    catalog_item_id = table.Column<Guid>(type: "uuid", nullable: false),
                    store_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    changed_by = table.Column<Guid>(type: "uuid", nullable: true),
                    reason = table.Column<CatalogChangeReason>(type: "catalog_change_reason", nullable: false),
                    related_report_id = table.Column<Guid>(type: "uuid", nullable: true),
                    previous_price_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    new_price_lbp = table.Column<decimal>(type: "numeric", nullable: true),
                    note = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_catalog_audit_entries", x => x.id);
                    table.ForeignKey(
                        name: "FK_catalog_audit_entries_catalog_discrepancy_reports_related_r~",
                        column: x => x.related_report_id,
                        principalTable: "catalog_discrepancy_reports",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_catalog_audit_entries_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_catalog_audit_entries_store_catalog_items_catalog_item_id",
                        column: x => x.catalog_item_id,
                        principalTable: "store_catalog_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_catalog_audit_entries_stores_store_id",
                        column: x => x.store_id,
                        principalTable: "stores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_catalog_audit_entries_users_changed_by",
                        column: x => x.changed_by,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_admin_audit_logs_performed_by",
                table: "admin_audit_logs",
                column: "performed_by");

            migrationBuilder.CreateIndex(
                name: "IX_admin_audit_logs_target_price_entry_id",
                table: "admin_audit_logs",
                column: "target_price_entry_id");

            migrationBuilder.CreateIndex(
                name: "IX_admin_audit_logs_target_product_id",
                table: "admin_audit_logs",
                column: "target_product_id");

            migrationBuilder.CreateIndex(
                name: "IX_admin_audit_logs_target_user_id",
                table: "admin_audit_logs",
                column: "target_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_cart_items_cart_id",
                table: "cart_items",
                column: "cart_id");

            migrationBuilder.CreateIndex(
                name: "IX_cart_items_product_id",
                table: "cart_items",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_cart_items_store_id",
                table: "cart_items",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_carts_user_id",
                table: "carts",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_catalog_audit_entries_catalog_item_id",
                table: "catalog_audit_entries",
                column: "catalog_item_id");

            migrationBuilder.CreateIndex(
                name: "IX_catalog_audit_entries_changed_by",
                table: "catalog_audit_entries",
                column: "changed_by");

            migrationBuilder.CreateIndex(
                name: "IX_catalog_audit_entries_product_id",
                table: "catalog_audit_entries",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_catalog_audit_entries_related_report_id",
                table: "catalog_audit_entries",
                column: "related_report_id");

            migrationBuilder.CreateIndex(
                name: "IX_catalog_audit_entries_store_id",
                table: "catalog_audit_entries",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_catalog_discrepancy_reports_catalog_item_id",
                table: "catalog_discrepancy_reports",
                column: "catalog_item_id");

            migrationBuilder.CreateIndex(
                name: "IX_catalog_discrepancy_reports_product_id",
                table: "catalog_discrepancy_reports",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_catalog_discrepancy_reports_reported_by",
                table: "catalog_discrepancy_reports",
                column: "reported_by");

            migrationBuilder.CreateIndex(
                name: "IX_catalog_discrepancy_reports_reviewed_by",
                table: "catalog_discrepancy_reports",
                column: "reviewed_by");

            migrationBuilder.CreateIndex(
                name: "IX_catalog_discrepancy_reports_store_id",
                table: "catalog_discrepancy_reports",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_current_store_product_prices_latest_submission_id",
                table: "current_store_product_prices",
                column: "latest_submission_id");

            migrationBuilder.CreateIndex(
                name: "IX_current_store_product_prices_product_id",
                table: "current_store_product_prices",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_current_store_product_prices_store_id",
                table: "current_store_product_prices",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_districts_region_id",
                table: "districts",
                column: "region_id");

            migrationBuilder.CreateIndex(
                name: "IX_missing_product_requests_product_id",
                table: "missing_product_requests",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_missing_product_requests_requested_by",
                table: "missing_product_requests",
                column: "requested_by");

            migrationBuilder.CreateIndex(
                name: "IX_missing_product_requests_reviewed_by",
                table: "missing_product_requests",
                column: "reviewed_by");

            migrationBuilder.CreateIndex(
                name: "IX_missing_product_requests_store_id",
                table: "missing_product_requests",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_moderation_cases_assigned_to",
                table: "moderation_cases",
                column: "assigned_to");

            migrationBuilder.CreateIndex(
                name: "IX_moderation_cases_price_submission_id",
                table: "moderation_cases",
                column: "price_submission_id");

            migrationBuilder.CreateIndex(
                name: "IX_moderation_cases_resolved_by",
                table: "moderation_cases",
                column: "resolved_by");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_related_alert_id",
                table: "notifications",
                column: "related_alert_id");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_related_price_entry_id",
                table: "notifications",
                column: "related_price_entry_id");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_related_product_id",
                table: "notifications",
                column: "related_product_id");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_related_store_id",
                table: "notifications",
                column: "related_store_id");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_user_id",
                table: "notifications",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_password_reset_tokens_token_hash",
                table: "password_reset_tokens",
                column: "token_hash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_price_alert_regions_region_id",
                table: "price_alert_regions",
                column: "region_id");

            migrationBuilder.CreateIndex(
                name: "IX_price_alerts_product_id",
                table: "price_alerts",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_price_alerts_user_id",
                table: "price_alerts",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_price_anomalies_investigated_by",
                table: "price_anomalies",
                column: "investigated_by");

            migrationBuilder.CreateIndex(
                name: "IX_price_anomalies_price_submission_id",
                table: "price_anomalies",
                column: "price_submission_id");

            migrationBuilder.CreateIndex(
                name: "IX_price_anomalies_product_id",
                table: "price_anomalies",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_price_anomalies_store_id",
                table: "price_anomalies",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_price_confirmations_user_id",
                table: "price_confirmations",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_price_submissions_product_id",
                table: "price_submissions",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_price_submissions_rejected_by",
                table: "price_submissions",
                column: "rejected_by");

            migrationBuilder.CreateIndex(
                name: "IX_price_submissions_store_id",
                table: "price_submissions",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_price_submissions_submitted_by",
                table: "price_submissions",
                column: "submitted_by");

            migrationBuilder.CreateIndex(
                name: "IX_price_submissions_superseded_by",
                table: "price_submissions",
                column: "superseded_by");

            migrationBuilder.CreateIndex(
                name: "IX_price_submissions_verified_by",
                table: "price_submissions",
                column: "verified_by");

            migrationBuilder.CreateIndex(
                name: "IX_product_aliases_product_id",
                table: "product_aliases",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_products_category_id",
                table: "products",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "IX_products_created_by",
                table: "products",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_products_merged_into_product_id",
                table: "products",
                column: "merged_into_product_id");

            migrationBuilder.CreateIndex(
                name: "IX_station_report_confirmations_user_id",
                table: "station_report_confirmations",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_station_reports_reported_by",
                table: "station_reports",
                column: "reported_by");

            migrationBuilder.CreateIndex(
                name: "IX_station_reports_store_id",
                table: "station_reports",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_store_api_keys_created_by",
                table: "store_api_keys",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_store_api_keys_store_id",
                table: "store_api_keys",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_store_catalog_items_last_updated_by",
                table: "store_catalog_items",
                column: "last_updated_by");

            migrationBuilder.CreateIndex(
                name: "IX_store_catalog_items_product_id",
                table: "store_catalog_items",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_store_catalog_items_store_id_product_id",
                table: "store_catalog_items",
                columns: new[] { "store_id", "product_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_store_promotions_created_by",
                table: "store_promotions",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_store_promotions_product_id",
                table: "store_promotions",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_store_promotions_store_id",
                table: "store_promotions",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_store_sync_items_product_id",
                table: "store_sync_items",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_store_sync_items_sync_run_id",
                table: "store_sync_items",
                column: "sync_run_id");

            migrationBuilder.CreateIndex(
                name: "IX_store_sync_runs_created_by",
                table: "store_sync_runs",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_store_sync_runs_store_id",
                table: "store_sync_runs",
                column: "store_id");

            migrationBuilder.CreateIndex(
                name: "IX_stores_owner_user_id",
                table: "stores",
                column: "owner_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_system_settings_updated_by",
                table: "system_settings",
                column: "updated_by");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "admin_audit_logs");

            migrationBuilder.DropTable(
                name: "cart_items");

            migrationBuilder.DropTable(
                name: "catalog_audit_entries");

            migrationBuilder.DropTable(
                name: "current_store_product_prices");

            migrationBuilder.DropTable(
                name: "districts");

            migrationBuilder.DropTable(
                name: "fuel_prices");

            migrationBuilder.DropTable(
                name: "missing_product_requests");

            migrationBuilder.DropTable(
                name: "moderation_cases");

            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "password_reset_tokens");

            migrationBuilder.DropTable(
                name: "price_alert_regions");

            migrationBuilder.DropTable(
                name: "price_anomalies");

            migrationBuilder.DropTable(
                name: "price_confirmations");

            migrationBuilder.DropTable(
                name: "product_aliases");

            migrationBuilder.DropTable(
                name: "station_report_confirmations");

            migrationBuilder.DropTable(
                name: "store_api_keys");

            migrationBuilder.DropTable(
                name: "store_promotions");

            migrationBuilder.DropTable(
                name: "store_sync_items");

            migrationBuilder.DropTable(
                name: "system_broadcasts");

            migrationBuilder.DropTable(
                name: "system_settings");

            migrationBuilder.DropTable(
                name: "carts");

            migrationBuilder.DropTable(
                name: "catalog_discrepancy_reports");

            migrationBuilder.DropTable(
                name: "price_alerts");

            migrationBuilder.DropTable(
                name: "regions");

            migrationBuilder.DropTable(
                name: "price_submissions");

            migrationBuilder.DropTable(
                name: "station_reports");

            migrationBuilder.DropTable(
                name: "store_sync_runs");

            migrationBuilder.DropTable(
                name: "store_catalog_items");

            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.DropTable(
                name: "stores");

            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
