CREATE TYPE alert_status AS ENUM ('active', 'deleted', 'paused', 'triggered');
CREATE TYPE submission_source AS ENUM ('community', 'official', 'manual', 'api', 'csv');
CREATE TYPE submission_status AS ENUM ('pending', 'verified', 'rejected', 'flagged', 'superseded');
CREATE TYPE sync_method AS ENUM ('manual', 'csv', 'api');
CREATE TYPE sync_status AS ENUM ('running', 'ok', 'fail', 'partial');


CREATE TABLE approval_requests (
    id uuid NOT NULL,
    requested_by uuid NOT NULL,
    reviewed_by uuid,
    action character varying(100) NOT NULL,
    label character varying(255) NOT NULL,
    payload text NOT NULL,
    status text NOT NULL,
    review_note text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    resolved_at timestamp with time zone,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_approval_requests" PRIMARY KEY (id)
);


CREATE TABLE categories (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    sort_order integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_categories" PRIMARY KEY (id)
);


CREATE TABLE fuel_prices (
    id uuid NOT NULL,
    fuel_type text NOT NULL,
    official_price_lbp numeric NOT NULL,
    reported_price_lbp numeric,
    effective_from timestamp with time zone NOT NULL,
    effective_to timestamp with time zone,
    source character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_fuel_prices" PRIMARY KEY (id)
);


CREATE TABLE password_reset_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_hash character varying(128) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_password_reset_tokens" PRIMARY KEY (id)
);


CREATE TABLE regions (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_regions" PRIMARY KEY (id)
);


CREATE TABLE system_broadcasts (
    id uuid NOT NULL,
    type text NOT NULL,
    message text NOT NULL,
    severity text NOT NULL,
    is_active boolean NOT NULL,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone,
    priority integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_system_broadcasts" PRIMARY KEY (id)
);


CREATE TABLE users (
    id uuid NOT NULL,
    role text NOT NULL,
    status text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    name text,
    avatar_initials text,
    city text,
    trust_score integer NOT NULL,
    trust_level text NOT NULL,
    upload_count integer NOT NULL,
    verified_count integer NOT NULL,
    joined_at timestamp with time zone NOT NULL,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_users" PRIMARY KEY (id)
);


CREATE TABLE districts (
    id uuid NOT NULL,
    region_id uuid,
    name character varying(100) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_districts" PRIMARY KEY (id),
    CONSTRAINT "FK_districts_regions_region_id" FOREIGN KEY (region_id) REFERENCES regions (id)
);


CREATE TABLE carts (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_carts" PRIMARY KEY (id),
    CONSTRAINT "FK_carts_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE products (
    id uuid NOT NULL,
    category_id uuid,
    name character varying(255) NOT NULL,
    name_ar character varying(255),
    description text,
    unit character varying(100) NOT NULL,
    brand character varying(150),
    barcode character varying(100),
    upload_count integer NOT NULL,
    is_archived boolean NOT NULL,
    merged_into_product_id uuid,
    created_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_products" PRIMARY KEY (id),
    CONSTRAINT "FK_products_categories_category_id" FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT "FK_products_products_merged_into_product_id" FOREIGN KEY (merged_into_product_id) REFERENCES products (id),
    CONSTRAINT "FK_products_users_created_by" FOREIGN KEY (created_by) REFERENCES users (id)
);


CREATE TABLE stores (
    id uuid NOT NULL,
    owner_user_id uuid,
    name character varying(255) NOT NULL,
    chain character varying(150),
    city character varying(100),
    district character varying(100),
    region character varying(100),
    address_line_1 text,
    latitude numeric,
    longitude numeric,
    logo_url text,
    cover_image_url text,
    trust_score smallint NOT NULL,
    status text NOT NULL,
    is_verified_retailer boolean NOT NULL,
    power_status text NOT NULL,
    internal_rate_lbp numeric,
    sync_method text NOT NULL,
    api_enabled boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_stores" PRIMARY KEY (id),
    CONSTRAINT "FK_stores_users_owner_user_id" FOREIGN KEY (owner_user_id) REFERENCES users (id)
);


CREATE TABLE system_settings (
    id uuid NOT NULL,
    key character varying(255) NOT NULL,
    value text NOT NULL,
    description text,
    updated_by uuid,
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_system_settings" PRIMARY KEY (id),
    CONSTRAINT "FK_system_settings_users_updated_by" FOREIGN KEY (updated_by) REFERENCES users (id)
);


CREATE TABLE price_alerts (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    threshold_lbp numeric NOT NULL,
    verified_only boolean NOT NULL,
    status alert_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_price_alerts" PRIMARY KEY (id),
    CONSTRAINT "FK_price_alerts_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT "FK_price_alerts_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE product_aliases (
    id integer GENERATED BY DEFAULT AS IDENTITY,
    product_id uuid NOT NULL,
    alias character varying(255) NOT NULL,
    language_code character varying(10) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_product_aliases" PRIMARY KEY (id),
    CONSTRAINT "FK_product_aliases_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);


CREATE TABLE cart_items (
    id uuid NOT NULL,
    cart_id uuid NOT NULL,
    product_id uuid NOT NULL,
    store_id uuid,
    quantity integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_cart_items" PRIMARY KEY (id),
    CONSTRAINT "FK_cart_items_carts_cart_id" FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,
    CONSTRAINT "FK_cart_items_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT "FK_cart_items_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id)
);


CREATE TABLE missing_product_requests (
    id uuid NOT NULL,
    store_id uuid NOT NULL,
    product_id uuid,
    product_name_freetext character varying(255) NOT NULL,
    requested_by uuid,
    requester_trust_score smallint,
    note text NOT NULL,
    status text NOT NULL,
    review_note text NOT NULL,
    reviewed_by uuid,
    created_at timestamp with time zone NOT NULL,
    resolved_at timestamp with time zone,
    CONSTRAINT "PK_missing_product_requests" PRIMARY KEY (id),
    CONSTRAINT "FK_missing_product_requests_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT "FK_missing_product_requests_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT "FK_missing_product_requests_users_requested_by" FOREIGN KEY (requested_by) REFERENCES users (id),
    CONSTRAINT "FK_missing_product_requests_users_reviewed_by" FOREIGN KEY (reviewed_by) REFERENCES users (id)
);


CREATE TABLE price_submissions (
    id uuid NOT NULL,
    store_id uuid NOT NULL,
    product_id uuid NOT NULL,
    submitted_by uuid,
    source submission_source NOT NULL,
    submission_status submission_status NOT NULL,
    price_lbp numeric NOT NULL,
    is_promotion boolean NOT NULL,
    promo_ends_at timestamp with time zone,
    receipt_image_url text NOT NULL,
    note text NOT NULL,
    submitter_trust_score smallint,
    upvotes integer NOT NULL,
    downvotes integer NOT NULL,
    is_disputed boolean NOT NULL,
    dispute_reason text NOT NULL,
    ocr_store_name character varying(255) NOT NULL,
    ocr_product_name character varying(255) NOT NULL,
    ocr_barcode character varying(100) NOT NULL,
    ocr_price_lbp numeric,
    ocr_payload jsonb NOT NULL,
    mismatch_detected boolean NOT NULL,
    mismatch_reason text NOT NULL,
    verified_by uuid,
    verified_at timestamp with time zone,
    rejected_by uuid,
    rejected_at timestamp with time zone,
    superseded_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_price_submissions" PRIMARY KEY (id),
    CONSTRAINT "FK_price_submissions_price_submissions_superseded_by" FOREIGN KEY (superseded_by) REFERENCES price_submissions (id),
    CONSTRAINT "FK_price_submissions_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT "FK_price_submissions_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT "FK_price_submissions_users_rejected_by" FOREIGN KEY (rejected_by) REFERENCES users (id),
    CONSTRAINT "FK_price_submissions_users_submitted_by" FOREIGN KEY (submitted_by) REFERENCES users (id),
    CONSTRAINT "FK_price_submissions_users_verified_by" FOREIGN KEY (verified_by) REFERENCES users (id)
);


CREATE TABLE retailer_onboarding_applications (
    id uuid NOT NULL,
    user_id uuid,
    store_id uuid,
    contact_name character varying(150) NOT NULL,
    email text NOT NULL,
    phone character varying(50) NOT NULL,
    proposed_store_name character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    district character varying(100) NOT NULL,
    address_text text NOT NULL,
    latitude numeric,
    longitude numeric,
    current_step smallint NOT NULL,
    total_steps smallint NOT NULL,
    status text NOT NULL,
    admin_notes text NOT NULL,
    applied_at timestamp with time zone NOT NULL,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_retailer_onboarding_applications" PRIMARY KEY (id),
    CONSTRAINT "FK_retailer_onboarding_applications_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id),
    CONSTRAINT "FK_retailer_onboarding_applications_users_reviewed_by" FOREIGN KEY (reviewed_by) REFERENCES users (id),
    CONSTRAINT "FK_retailer_onboarding_applications_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id)
);


CREATE TABLE station_reports (
    id uuid NOT NULL,
    store_id uuid NOT NULL,
    fuel_type text NOT NULL,
    is_open boolean NOT NULL,
    has_stock boolean NOT NULL,
    queue_minutes integer NOT NULL,
    queue_depth integer NOT NULL,
    is_rationed boolean NOT NULL,
    limit_amount_lbp numeric,
    reported_by uuid,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_station_reports" PRIMARY KEY (id),
    CONSTRAINT "FK_station_reports_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT "FK_station_reports_users_reported_by" FOREIGN KEY (reported_by) REFERENCES users (id)
);


CREATE TABLE store_api_keys (
    id uuid NOT NULL,
    store_id uuid NOT NULL,
    api_key_hash text NOT NULL,
    key_label character varying(150) NOT NULL,
    is_active boolean NOT NULL,
    last_used_at timestamp with time zone,
    created_by uuid,
    created_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT "PK_store_api_keys" PRIMARY KEY (id),
    CONSTRAINT "FK_store_api_keys_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT "FK_store_api_keys_users_created_by" FOREIGN KEY (created_by) REFERENCES users (id)
);


CREATE TABLE store_catalog_items (
    id uuid NOT NULL,
    store_id uuid NOT NULL,
    product_id uuid NOT NULL,
    official_price_lbp numeric,
    promo_price_lbp numeric,
    promo_ends_at timestamp with time zone,
    is_in_stock boolean NOT NULL,
    is_promotion boolean NOT NULL,
    last_updated_by uuid,
    last_updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_store_catalog_items" PRIMARY KEY (id),
    CONSTRAINT "FK_store_catalog_items_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT "FK_store_catalog_items_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT "FK_store_catalog_items_users_last_updated_by" FOREIGN KEY (last_updated_by) REFERENCES users (id)
);


CREATE TABLE store_promotions (
    id uuid NOT NULL,
    store_id uuid NOT NULL,
    product_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    discount_percent numeric,
    original_price_lbp numeric,
    promo_price_lbp numeric NOT NULL,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone,
    status text NOT NULL,
    created_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_store_promotions" PRIMARY KEY (id),
    CONSTRAINT "FK_store_promotions_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT "FK_store_promotions_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT "FK_store_promotions_users_created_by" FOREIGN KEY (created_by) REFERENCES users (id)
);


CREATE TABLE store_sync_runs (
    id uuid NOT NULL,
    store_id uuid NOT NULL,
    method sync_method NOT NULL,
    status sync_status NOT NULL,
    records_received integer,
    records_processed integer,
    records_failed integer,
    message text,
    started_at timestamp with time zone NOT NULL,
    finished_at timestamp with time zone,
    created_by uuid,
    CONSTRAINT "PK_store_sync_runs" PRIMARY KEY (id),
    CONSTRAINT "FK_store_sync_runs_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT "FK_store_sync_runs_users_created_by" FOREIGN KEY (created_by) REFERENCES users (id)
);


CREATE TABLE price_alert_regions (
    alert_id uuid NOT NULL,
    region_id uuid NOT NULL,
    CONSTRAINT "PK_price_alert_regions" PRIMARY KEY (alert_id, region_id),
    CONSTRAINT "FK_price_alert_regions_price_alerts_alert_id" FOREIGN KEY (alert_id) REFERENCES price_alerts (id) ON DELETE CASCADE,
    CONSTRAINT "FK_price_alert_regions_regions_region_id" FOREIGN KEY (region_id) REFERENCES regions (id) ON DELETE CASCADE
);


CREATE TABLE admin_audit_logs (
    id uuid NOT NULL,
    performed_by uuid,
    action text NOT NULL,
    target_user_id uuid,
    target_price_entry_id uuid,
    target_product_id uuid,
    note text NOT NULL,
    metadata text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_admin_audit_logs" PRIMARY KEY (id),
    CONSTRAINT "FK_admin_audit_logs_price_submissions_target_price_entry_id" FOREIGN KEY (target_price_entry_id) REFERENCES price_submissions (id),
    CONSTRAINT "FK_admin_audit_logs_products_target_product_id" FOREIGN KEY (target_product_id) REFERENCES products (id),
    CONSTRAINT "FK_admin_audit_logs_users_performed_by" FOREIGN KEY (performed_by) REFERENCES users (id),
    CONSTRAINT "FK_admin_audit_logs_users_target_user_id" FOREIGN KEY (target_user_id) REFERENCES users (id)
);


CREATE TABLE current_store_product_prices (
    id uuid NOT NULL,
    store_id uuid NOT NULL,
    product_id uuid NOT NULL,
    latest_submission_id uuid,
    current_price_lbp numeric NOT NULL,
    source submission_source NOT NULL,
    confidence_score smallint NOT NULL,
    confirmation_count integer NOT NULL,
    trust_level character varying(20) NOT NULL,
    is_verified boolean NOT NULL,
    is_in_stock boolean NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_current_store_product_prices" PRIMARY KEY (id),
    CONSTRAINT "FK_current_store_product_prices_price_submissions_latest_submi~" FOREIGN KEY (latest_submission_id) REFERENCES price_submissions (id),
    CONSTRAINT "FK_current_store_product_prices_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT "FK_current_store_product_prices_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE
);


CREATE TABLE moderation_cases (
    id uuid NOT NULL,
    price_submission_id uuid NOT NULL,
    case_type character varying(50) NOT NULL,
    status text NOT NULL,
    severity text NOT NULL,
    case_note text NOT NULL,
    assigned_to uuid,
    resolved_by uuid,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_moderation_cases" PRIMARY KEY (id),
    CONSTRAINT "FK_moderation_cases_price_submissions_price_submission_id" FOREIGN KEY (price_submission_id) REFERENCES price_submissions (id) ON DELETE CASCADE,
    CONSTRAINT "FK_moderation_cases_users_assigned_to" FOREIGN KEY (assigned_to) REFERENCES users (id),
    CONSTRAINT "FK_moderation_cases_users_resolved_by" FOREIGN KEY (resolved_by) REFERENCES users (id)
);


CREATE TABLE notifications (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    related_price_entry_id uuid,
    related_store_id uuid,
    related_product_id uuid,
    related_alert_id uuid,
    is_read boolean NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_notifications" PRIMARY KEY (id),
    CONSTRAINT "FK_notifications_price_alerts_related_alert_id" FOREIGN KEY (related_alert_id) REFERENCES price_alerts (id),
    CONSTRAINT "FK_notifications_price_submissions_related_price_entry_id" FOREIGN KEY (related_price_entry_id) REFERENCES price_submissions (id),
    CONSTRAINT "FK_notifications_products_related_product_id" FOREIGN KEY (related_product_id) REFERENCES products (id),
    CONSTRAINT "FK_notifications_stores_related_store_id" FOREIGN KEY (related_store_id) REFERENCES stores (id),
    CONSTRAINT "FK_notifications_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE price_anomalies (
    id uuid NOT NULL,
    store_id uuid NOT NULL,
    product_id uuid NOT NULL,
    price_submission_id uuid,
    old_price_lbp numeric NOT NULL,
    new_price_lbp numeric NOT NULL,
    change_percent numeric NOT NULL,
    severity text NOT NULL,
    status text NOT NULL,
    detected_at timestamp with time zone NOT NULL,
    investigated_by uuid,
    investigated_at timestamp with time zone,
    resolution_note text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_price_anomalies" PRIMARY KEY (id),
    CONSTRAINT "FK_price_anomalies_price_submissions_price_submission_id" FOREIGN KEY (price_submission_id) REFERENCES price_submissions (id),
    CONSTRAINT "FK_price_anomalies_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT "FK_price_anomalies_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT "FK_price_anomalies_users_investigated_by" FOREIGN KEY (investigated_by) REFERENCES users (id)
);


CREATE TABLE price_confirmations (
    id uuid NOT NULL,
    price_submission_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_price_confirmations" PRIMARY KEY (id),
    CONSTRAINT "FK_price_confirmations_price_submissions_price_submission_id" FOREIGN KEY (price_submission_id) REFERENCES price_submissions (id) ON DELETE CASCADE,
    CONSTRAINT "FK_price_confirmations_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE price_feedback (
    id uuid NOT NULL,
    price_entry_id uuid NOT NULL,
    submitted_by uuid,
    type text NOT NULL,
    note text NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_price_feedback" PRIMARY KEY (id),
    CONSTRAINT "FK_price_feedback_price_submissions_price_entry_id" FOREIGN KEY (price_entry_id) REFERENCES price_submissions (id) ON DELETE CASCADE,
    CONSTRAINT "FK_price_feedback_users_submitted_by" FOREIGN KEY (submitted_by) REFERENCES users (id)
);


CREATE TABLE price_notes (
    id uuid NOT NULL,
    price_submission_id uuid NOT NULL,
    user_id uuid NOT NULL,
    note text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_price_notes" PRIMARY KEY (id),
    CONSTRAINT "FK_price_notes_price_submissions_price_submission_id" FOREIGN KEY (price_submission_id) REFERENCES price_submissions (id) ON DELETE CASCADE,
    CONSTRAINT "FK_price_notes_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE price_reports (
    id uuid NOT NULL,
    price_submission_id uuid NOT NULL,
    user_id uuid NOT NULL,
    report_type character varying(50) NOT NULL,
    note text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_price_reports" PRIMARY KEY (id),
    CONSTRAINT "FK_price_reports_price_submissions_price_submission_id" FOREIGN KEY (price_submission_id) REFERENCES price_submissions (id) ON DELETE CASCADE,
    CONSTRAINT "FK_price_reports_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE retailer_onboarding_documents (
    id uuid NOT NULL,
    application_id uuid NOT NULL,
    document_type character varying(50) NOT NULL,
    file_url text NOT NULL,
    uploaded_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_retailer_onboarding_documents" PRIMARY KEY (id),
    CONSTRAINT "FK_retailer_onboarding_documents_retailer_onboarding_applicati~" FOREIGN KEY (application_id) REFERENCES retailer_onboarding_applications (id) ON DELETE CASCADE
);


CREATE TABLE station_report_confirmations (
    report_id uuid NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT "PK_station_report_confirmations" PRIMARY KEY (report_id, user_id),
    CONSTRAINT "FK_station_report_confirmations_station_reports_report_id" FOREIGN KEY (report_id) REFERENCES station_reports (id) ON DELETE CASCADE,
    CONSTRAINT "FK_station_report_confirmations_users_user_id" FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE catalog_discrepancy_reports (
    id uuid NOT NULL,
    catalog_item_id uuid NOT NULL,
    store_id uuid NOT NULL,
    product_id uuid NOT NULL,
    reported_by uuid,
    reporter_trust_score smallint,
    report_type text NOT NULL,
    observed_price_lbp numeric,
    note text,
    status text NOT NULL,
    approved_new_price_lbp numeric,
    review_note text,
    reviewed_by uuid,
    created_at timestamp with time zone NOT NULL,
    resolved_at timestamp with time zone,
    CONSTRAINT "PK_catalog_discrepancy_reports" PRIMARY KEY (id),
    CONSTRAINT "FK_catalog_discrepancy_reports_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT "FK_catalog_discrepancy_reports_store_catalog_items_catalog_ite~" FOREIGN KEY (catalog_item_id) REFERENCES store_catalog_items (id) ON DELETE CASCADE,
    CONSTRAINT "FK_catalog_discrepancy_reports_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT "FK_catalog_discrepancy_reports_users_reported_by" FOREIGN KEY (reported_by) REFERENCES users (id),
    CONSTRAINT "FK_catalog_discrepancy_reports_users_reviewed_by" FOREIGN KEY (reviewed_by) REFERENCES users (id)
);


CREATE TABLE store_sync_items (
    id uuid NOT NULL,
    sync_run_id uuid NOT NULL,
    product_id uuid,
    raw_name character varying(255),
    raw_barcode character varying(100),
    raw_price numeric,
    status character varying(20) NOT NULL,
    fail_reason text,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_store_sync_items" PRIMARY KEY (id),
    CONSTRAINT "FK_store_sync_items_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT "FK_store_sync_items_store_sync_runs_sync_run_id" FOREIGN KEY (sync_run_id) REFERENCES store_sync_runs (id) ON DELETE CASCADE
);


CREATE TABLE catalog_audit_entries (
    id uuid NOT NULL,
    catalog_item_id uuid NOT NULL,
    store_id uuid NOT NULL,
    product_id uuid NOT NULL,
    changed_by uuid,
    reason catalog_change_reason NOT NULL,
    related_report_id uuid,
    previous_price_lbp numeric,
    new_price_lbp numeric,
    note text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "PK_catalog_audit_entries" PRIMARY KEY (id),
    CONSTRAINT "FK_catalog_audit_entries_catalog_discrepancy_reports_related_r~" FOREIGN KEY (related_report_id) REFERENCES catalog_discrepancy_reports (id),
    CONSTRAINT "FK_catalog_audit_entries_products_product_id" FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT "FK_catalog_audit_entries_store_catalog_items_catalog_item_id" FOREIGN KEY (catalog_item_id) REFERENCES store_catalog_items (id) ON DELETE CASCADE,
    CONSTRAINT "FK_catalog_audit_entries_stores_store_id" FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
    CONSTRAINT "FK_catalog_audit_entries_users_changed_by" FOREIGN KEY (changed_by) REFERENCES users (id)
);


CREATE INDEX "IX_admin_audit_logs_performed_by" ON admin_audit_logs (performed_by);


CREATE INDEX "IX_admin_audit_logs_target_price_entry_id" ON admin_audit_logs (target_price_entry_id);


CREATE INDEX "IX_admin_audit_logs_target_product_id" ON admin_audit_logs (target_product_id);


CREATE INDEX "IX_admin_audit_logs_target_user_id" ON admin_audit_logs (target_user_id);


CREATE INDEX "IX_cart_items_cart_id" ON cart_items (cart_id);


CREATE INDEX "IX_cart_items_product_id" ON cart_items (product_id);


CREATE INDEX "IX_cart_items_store_id" ON cart_items (store_id);


CREATE UNIQUE INDEX "IX_carts_user_id" ON carts (user_id);


CREATE INDEX "IX_catalog_audit_entries_catalog_item_id" ON catalog_audit_entries (catalog_item_id);


CREATE INDEX "IX_catalog_audit_entries_changed_by" ON catalog_audit_entries (changed_by);


CREATE INDEX "IX_catalog_audit_entries_product_id" ON catalog_audit_entries (product_id);


CREATE INDEX "IX_catalog_audit_entries_related_report_id" ON catalog_audit_entries (related_report_id);


CREATE INDEX "IX_catalog_audit_entries_store_id" ON catalog_audit_entries (store_id);


CREATE INDEX "IX_catalog_discrepancy_reports_catalog_item_id" ON catalog_discrepancy_reports (catalog_item_id);


CREATE INDEX "IX_catalog_discrepancy_reports_product_id" ON catalog_discrepancy_reports (product_id);


CREATE INDEX "IX_catalog_discrepancy_reports_reported_by" ON catalog_discrepancy_reports (reported_by);


CREATE INDEX "IX_catalog_discrepancy_reports_reviewed_by" ON catalog_discrepancy_reports (reviewed_by);


CREATE INDEX "IX_catalog_discrepancy_reports_store_id" ON catalog_discrepancy_reports (store_id);


CREATE INDEX "IX_current_store_product_prices_latest_submission_id" ON current_store_product_prices (latest_submission_id);


CREATE INDEX "IX_current_store_product_prices_product_id" ON current_store_product_prices (product_id);


CREATE INDEX "IX_current_store_product_prices_store_id" ON current_store_product_prices (store_id);


CREATE INDEX "IX_districts_region_id" ON districts (region_id);


CREATE INDEX "IX_missing_product_requests_product_id" ON missing_product_requests (product_id);


CREATE INDEX "IX_missing_product_requests_requested_by" ON missing_product_requests (requested_by);


CREATE INDEX "IX_missing_product_requests_reviewed_by" ON missing_product_requests (reviewed_by);


CREATE INDEX "IX_missing_product_requests_store_id" ON missing_product_requests (store_id);


CREATE INDEX "IX_moderation_cases_assigned_to" ON moderation_cases (assigned_to);


CREATE INDEX "IX_moderation_cases_price_submission_id" ON moderation_cases (price_submission_id);


CREATE INDEX "IX_moderation_cases_resolved_by" ON moderation_cases (resolved_by);


CREATE INDEX "IX_notifications_related_alert_id" ON notifications (related_alert_id);


CREATE INDEX "IX_notifications_related_price_entry_id" ON notifications (related_price_entry_id);


CREATE INDEX "IX_notifications_related_product_id" ON notifications (related_product_id);


CREATE INDEX "IX_notifications_related_store_id" ON notifications (related_store_id);


CREATE INDEX "IX_notifications_user_id" ON notifications (user_id);


CREATE UNIQUE INDEX "IX_password_reset_tokens_token_hash" ON password_reset_tokens (token_hash);


CREATE INDEX "IX_price_alert_regions_region_id" ON price_alert_regions (region_id);


CREATE INDEX "IX_price_alerts_product_id" ON price_alerts (product_id);


CREATE INDEX "IX_price_alerts_user_id" ON price_alerts (user_id);


CREATE INDEX "IX_price_anomalies_investigated_by" ON price_anomalies (investigated_by);


CREATE INDEX "IX_price_anomalies_price_submission_id" ON price_anomalies (price_submission_id);


CREATE INDEX "IX_price_anomalies_product_id" ON price_anomalies (product_id);


CREATE INDEX "IX_price_anomalies_store_id" ON price_anomalies (store_id);


CREATE INDEX "IX_price_confirmations_price_submission_id" ON price_confirmations (price_submission_id);


CREATE INDEX "IX_price_confirmations_user_id" ON price_confirmations (user_id);


CREATE INDEX "IX_price_feedback_price_entry_id" ON price_feedback (price_entry_id);


CREATE INDEX "IX_price_feedback_submitted_by" ON price_feedback (submitted_by);


CREATE INDEX "IX_price_notes_price_submission_id" ON price_notes (price_submission_id);


CREATE INDEX "IX_price_notes_user_id" ON price_notes (user_id);


CREATE INDEX "IX_price_reports_price_submission_id" ON price_reports (price_submission_id);


CREATE INDEX "IX_price_reports_user_id" ON price_reports (user_id);


CREATE INDEX "IX_price_submissions_product_id" ON price_submissions (product_id);


CREATE INDEX "IX_price_submissions_rejected_by" ON price_submissions (rejected_by);


CREATE INDEX "IX_price_submissions_store_id" ON price_submissions (store_id);


CREATE INDEX "IX_price_submissions_submitted_by" ON price_submissions (submitted_by);


CREATE INDEX "IX_price_submissions_superseded_by" ON price_submissions (superseded_by);


CREATE INDEX "IX_price_submissions_verified_by" ON price_submissions (verified_by);


CREATE INDEX "IX_product_aliases_product_id" ON product_aliases (product_id);


CREATE INDEX "IX_products_category_id" ON products (category_id);


CREATE INDEX "IX_products_created_by" ON products (created_by);


CREATE INDEX "IX_products_merged_into_product_id" ON products (merged_into_product_id);


CREATE INDEX "IX_retailer_onboarding_applications_reviewed_by" ON retailer_onboarding_applications (reviewed_by);


CREATE INDEX "IX_retailer_onboarding_applications_store_id" ON retailer_onboarding_applications (store_id);


CREATE INDEX "IX_retailer_onboarding_applications_user_id" ON retailer_onboarding_applications (user_id);


CREATE INDEX "IX_retailer_onboarding_documents_application_id" ON retailer_onboarding_documents (application_id);


CREATE INDEX "IX_station_report_confirmations_user_id" ON station_report_confirmations (user_id);


CREATE INDEX "IX_station_reports_reported_by" ON station_reports (reported_by);


CREATE INDEX "IX_station_reports_store_id" ON station_reports (store_id);


CREATE INDEX "IX_store_api_keys_created_by" ON store_api_keys (created_by);


CREATE INDEX "IX_store_api_keys_store_id" ON store_api_keys (store_id);


CREATE INDEX "IX_store_catalog_items_last_updated_by" ON store_catalog_items (last_updated_by);


CREATE INDEX "IX_store_catalog_items_product_id" ON store_catalog_items (product_id);


CREATE UNIQUE INDEX "IX_store_catalog_items_store_id_product_id" ON store_catalog_items (store_id, product_id);


CREATE INDEX "IX_store_promotions_created_by" ON store_promotions (created_by);


CREATE INDEX "IX_store_promotions_product_id" ON store_promotions (product_id);


CREATE INDEX "IX_store_promotions_store_id" ON store_promotions (store_id);


CREATE INDEX "IX_store_sync_items_product_id" ON store_sync_items (product_id);


CREATE INDEX "IX_store_sync_items_sync_run_id" ON store_sync_items (sync_run_id);


CREATE INDEX "IX_store_sync_runs_created_by" ON store_sync_runs (created_by);


CREATE INDEX "IX_store_sync_runs_store_id" ON store_sync_runs (store_id);


CREATE INDEX "IX_stores_owner_user_id" ON stores (owner_user_id);


CREATE INDEX "IX_system_settings_updated_by" ON system_settings (updated_by);


