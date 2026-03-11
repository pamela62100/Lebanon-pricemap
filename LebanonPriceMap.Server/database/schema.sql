BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- =========================================================
-- Helpers
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- Enums
-- =========================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('shopper', 'retailer', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM ('active', 'warned', 'suspended', 'banned');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'store_status') THEN
    CREATE TYPE store_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sync_method') THEN
    CREATE TYPE sync_method AS ENUM ('manual', 'api', 'csv');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sync_status') THEN
    CREATE TYPE sync_status AS ENUM ('ok', 'fail', 'partial');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'onboarding_status') THEN
    CREATE TYPE onboarding_status AS ENUM ('pending', 'in_progress', 'approved', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_source') THEN
    CREATE TYPE submission_source AS ENUM ('community', 'official', 'manual', 'api', 'csv');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
    CREATE TYPE submission_status AS ENUM ('pending', 'verified', 'rejected', 'flagged', 'superseded');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'moderation_case_status') THEN
    CREATE TYPE moderation_case_status AS ENUM ('pending', 'verified', 'rejected', 'warned', 'dismissed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'severity_level') THEN
    CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status') THEN
    CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_type') THEN
    CREATE TYPE approval_type AS ENUM (
      'account_delete',
      'bulk_delete_prices',
      'store_activate',
      'store_suspend',
      'store_onboarding',
      'price_override',
      'other'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM (
      'price_verified',
      'price_flagged',
      'price_alert',
      'trust_changed',
      'approval_update',
      'store_update',
      'system'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'promo_status') THEN
    CREATE TYPE promo_status AS ENUM ('draft', 'active', 'expired', 'cancelled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'anomaly_status') THEN
    CREATE TYPE anomaly_status AS ENUM ('active', 'investigating', 'dismissed', 'resolved');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_status') THEN
    CREATE TYPE alert_status AS ENUM ('active', 'paused', 'triggered', 'deleted');
  END IF;
END
$$;

-- =========================================================
-- Users
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  role user_role NOT NULL DEFAULT 'shopper',
  status user_status NOT NULL DEFAULT 'active',

  email CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,

  first_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(150),

  city VARCHAR(100),
  district VARCHAR(100),

  avatar_url TEXT,
  avatar_initials VARCHAR(10),

  trust_score SMALLINT NOT NULL DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 100),
  upload_count INTEGER NOT NULL DEFAULT 0,
  verified_count INTEGER NOT NULL DEFAULT 0,

  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Geography
-- =========================================================

CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_region_district UNIQUE (region_id, name)
);

-- =========================================================
-- Stores
-- =========================================================

CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  arabic_name VARCHAR(255),

  city VARCHAR(100),
  district VARCHAR(100),
  district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
  region_id UUID REFERENCES regions(id) ON DELETE SET NULL,

  address_line_1 TEXT,
  address_line_2 TEXT,

  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),

  logo_url TEXT,
  cover_image_url TEXT,

  trust_score SMALLINT NOT NULL DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 100),
  status store_status NOT NULL DEFAULT 'pending',
  is_verified_partner BOOLEAN NOT NULL DEFAULT FALSE,

  sync_method sync_method NOT NULL DEFAULT 'manual',
  api_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  internal_rate_lbp NUMERIC(12,2),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stores_owner_user_id ON stores(owner_user_id);

CREATE TABLE IF NOT EXISTS store_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  api_key_hash TEXT NOT NULL UNIQUE,
  key_label VARCHAR(150),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

-- =========================================================
-- Retailer onboarding
-- =========================================================

CREATE TABLE IF NOT EXISTS retailer_onboarding_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,

  contact_name VARCHAR(150) NOT NULL,
  email CITEXT NOT NULL,
  phone VARCHAR(50),

  proposed_store_name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  district VARCHAR(100),
  region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
  address_text TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),

  current_step SMALLINT NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 5),
  total_steps SMALLINT NOT NULL DEFAULT 5 CHECK (total_steps = 5),
  status onboarding_status NOT NULL DEFAULT 'pending',

  admin_notes TEXT,

  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS retailer_onboarding_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES retailer_onboarding_applications(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Categories and products
-- =========================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  arabic_name VARCHAR(100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  name VARCHAR(255) NOT NULL,
  arabic_name VARCHAR(255),
  description TEXT,

  unit VARCHAR(100) NOT NULL,
  brand VARCHAR(150),
  barcode VARCHAR(100) UNIQUE,

  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  merged_into_product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  created_by UUID REFERENCES users(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alias VARCHAR(255) NOT NULL,
  language_code VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_product_alias UNIQUE (product_id, alias)
);

-- =========================================================
-- Store catalog / retailer official products
-- =========================================================

CREATE TABLE IF NOT EXISTS store_catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  listed_name VARCHAR(255),
  listed_unit VARCHAR(100),

  official_price_lbp NUMERIC(12,2) CHECK (official_price_lbp IS NULL OR official_price_lbp >= 0),
  is_in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  last_synced_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_store_catalog UNIQUE (store_id, product_id)
);

CREATE TABLE IF NOT EXISTS store_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  title VARCHAR(255),
  promo_price_lbp NUMERIC(12,2) NOT NULL CHECK (promo_price_lbp >= 0),
  regular_price_lbp NUMERIC(12,2) CHECK (regular_price_lbp IS NULL OR regular_price_lbp >= 0),

  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  status promo_status NOT NULL DEFAULT 'active',

  created_by UUID REFERENCES users(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  method sync_method NOT NULL,
  status sync_status NOT NULL,

  records_received INTEGER,
  records_processed INTEGER,
  records_failed INTEGER,

  message TEXT,

  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,

  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- =========================================================
-- Price submissions / public prices / OCR
-- =========================================================

CREATE TABLE IF NOT EXISTS price_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,

  source submission_source NOT NULL DEFAULT 'community',
  submission_status submission_status NOT NULL DEFAULT 'pending',

  price_lbp NUMERIC(12,2) NOT NULL CHECK (price_lbp >= 0),

  quantity_value NUMERIC(12,2),
  quantity_unit VARCHAR(50),

  receipt_image_url TEXT,
  note TEXT,

  ocr_store_name VARCHAR(255),
  ocr_product_name VARCHAR(255),
  ocr_barcode VARCHAR(100),
  ocr_price_lbp NUMERIC(12,2),
  ocr_payload JSONB,

  mismatch_detected BOOLEAN NOT NULL DEFAULT FALSE,
  mismatch_reason TEXT,

  trust_snapshot SMALLINT CHECK (trust_snapshot IS NULL OR trust_snapshot BETWEEN 0 AND 100),

  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  rejected_by UUID REFERENCES users(id) ON DELETE SET NULL,
  rejected_at TIMESTAMPTZ,

  superseded_by UUID REFERENCES price_submissions(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS current_store_product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  latest_submission_id UUID REFERENCES price_submissions(id) ON DELETE SET NULL,

  current_price_lbp NUMERIC(12,2) NOT NULL CHECK (current_price_lbp >= 0),
  source submission_source NOT NULL,
  confidence_score SMALLINT NOT NULL DEFAULT 50 CHECK (confidence_score BETWEEN 0 AND 100),

  confirmation_count INTEGER NOT NULL DEFAULT 0,
  trust_level VARCHAR(20) DEFAULT 'medium',

  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_in_stock BOOLEAN NOT NULL DEFAULT TRUE,

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_current_store_product UNIQUE (store_id, product_id)
);

CREATE TABLE IF NOT EXISTS price_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_submission_id UUID NOT NULL REFERENCES price_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_price_confirmation UNIQUE (price_submission_id, user_id)
);

CREATE TABLE IF NOT EXISTS price_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_submission_id UUID NOT NULL REFERENCES price_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_submission_id UUID NOT NULL REFERENCES price_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Moderation / flagged prices
-- =========================================================

CREATE TABLE IF NOT EXISTS moderation_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  price_submission_id UUID NOT NULL REFERENCES price_submissions(id) ON DELETE CASCADE,

  case_type VARCHAR(50) NOT NULL,
  status moderation_case_status NOT NULL DEFAULT 'pending',
  severity severity_level NOT NULL DEFAULT 'medium',

  submitted_price_lbp NUMERIC(12,2),
  extracted_price_lbp NUMERIC(12,2),
  submitted_product_label VARCHAR(255),
  extracted_product_label VARCHAR(255),

  case_note TEXT,

  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Price anomalies
-- =========================================================

CREATE TABLE IF NOT EXISTS price_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price_submission_id UUID REFERENCES price_submissions(id) ON DELETE SET NULL,

  old_price_lbp NUMERIC(12,2) NOT NULL,
  new_price_lbp NUMERIC(12,2) NOT NULL,
  change_percent NUMERIC(8,2) NOT NULL,

  severity severity_level NOT NULL DEFAULT 'medium',
  status anomaly_status NOT NULL DEFAULT 'active',

  region_id UUID REFERENCES regions(id) ON DELETE SET NULL,

  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  investigated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  investigated_at TIMESTAMPTZ,
  resolution_note TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Alerts
-- =========================================================

CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  threshold_lbp NUMERIC(12,2) NOT NULL CHECK (threshold_lbp >= 0),
  verified_only BOOLEAN NOT NULL DEFAULT TRUE,
  status alert_status NOT NULL DEFAULT 'active',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_alert_regions (
  alert_id UUID NOT NULL REFERENCES price_alerts(id) ON DELETE CASCADE,
  region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
  PRIMARY KEY (alert_id, region_id)
);

-- =========================================================
-- Cart
-- =========================================================

CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Notifications
-- =========================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL DEFAULT 'system',

  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  related_store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  related_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  related_price_submission_id UUID REFERENCES price_submissions(id) ON DELETE SET NULL,
  related_alert_id UUID REFERENCES price_alerts(id) ON DELETE SET NULL,

  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- =========================================================
-- Approval queue
-- =========================================================

CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,

  approval_type approval_type NOT NULL,
  label VARCHAR(255) NOT NULL,
  action_key VARCHAR(100),

  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status approval_status NOT NULL DEFAULT 'pending',

  review_note TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Admin activity logs
-- =========================================================

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  admin_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Broadcast ticker
-- =========================================================

CREATE TABLE IF NOT EXISTS system_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Indexes
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_arabic_name ON products(arabic_name);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);

CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_region_id ON stores(region_id);
CREATE INDEX IF NOT EXISTS idx_stores_city_district ON stores(city, district);

CREATE INDEX IF NOT EXISTS idx_store_catalog_items_store_id ON store_catalog_items(store_id);
CREATE INDEX IF NOT EXISTS idx_store_catalog_items_product_id ON store_catalog_items(product_id);

CREATE INDEX IF NOT EXISTS idx_store_promotions_store_id ON store_promotions(store_id);
CREATE INDEX IF NOT EXISTS idx_store_promotions_product_id ON store_promotions(product_id);
CREATE INDEX IF NOT EXISTS idx_store_promotions_status ON store_promotions(status);

CREATE INDEX IF NOT EXISTS idx_store_sync_runs_store_id ON store_sync_runs(store_id);
CREATE INDEX IF NOT EXISTS idx_store_sync_runs_started_at ON store_sync_runs(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_price_submissions_store_product ON price_submissions(store_id, product_id);
CREATE INDEX IF NOT EXISTS idx_price_submissions_status ON price_submissions(submission_status);
CREATE INDEX IF NOT EXISTS idx_price_submissions_source ON price_submissions(source);
CREATE INDEX IF NOT EXISTS idx_price_submissions_submitted_at ON price_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_submissions_mismatch ON price_submissions(mismatch_detected);

CREATE INDEX IF NOT EXISTS idx_current_store_product_prices_store_id ON current_store_product_prices(store_id);
CREATE INDEX IF NOT EXISTS idx_current_store_product_prices_product_id ON current_store_product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_current_store_product_prices_verified ON current_store_product_prices(is_verified);

CREATE INDEX IF NOT EXISTS idx_price_confirmations_price_submission_id ON price_confirmations(price_submission_id);
CREATE INDEX IF NOT EXISTS idx_price_reports_price_submission_id ON price_reports(price_submission_id);
CREATE INDEX IF NOT EXISTS idx_price_notes_price_submission_id ON price_notes(price_submission_id);

CREATE INDEX IF NOT EXISTS idx_moderation_cases_status ON moderation_cases(status);
CREATE INDEX IF NOT EXISTS idx_moderation_cases_case_type ON moderation_cases(case_type);
CREATE INDEX IF NOT EXISTS idx_moderation_cases_severity ON moderation_cases(severity);

CREATE INDEX IF NOT EXISTS idx_price_anomalies_status ON price_anomalies(status);
CREATE INDEX IF NOT EXISTS idx_price_anomalies_detected_at ON price_anomalies(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_anomalies_region_id ON price_anomalies(region_id);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_product_id ON price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_status ON price_alerts(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_approval_requests_requested_by ON approval_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_approval_requests_type ON approval_requests(approval_type);

CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_user_id ON admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_entity ON admin_activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_retailer_onboarding_status ON retailer_onboarding_applications(status);
CREATE INDEX IF NOT EXISTS idx_retailer_onboarding_step ON retailer_onboarding_applications(current_step);

CREATE INDEX IF NOT EXISTS idx_system_broadcasts_active ON system_broadcasts(is_active);

-- =========================================================
-- updated_at triggers
-- =========================================================

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_stores_updated_at ON stores;
CREATE TRIGGER trg_stores_updated_at
BEFORE UPDATE ON stores
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_retailer_onboarding_updated_at ON retailer_onboarding_applications;
CREATE TRIGGER trg_retailer_onboarding_updated_at
BEFORE UPDATE ON retailer_onboarding_applications
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_store_catalog_items_updated_at ON store_catalog_items;
CREATE TRIGGER trg_store_catalog_items_updated_at
BEFORE UPDATE ON store_catalog_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_store_promotions_updated_at ON store_promotions;
CREATE TRIGGER trg_store_promotions_updated_at
BEFORE UPDATE ON store_promotions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_price_submissions_updated_at ON price_submissions;
CREATE TRIGGER trg_price_submissions_updated_at
BEFORE UPDATE ON price_submissions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_moderation_cases_updated_at ON moderation_cases;
CREATE TRIGGER trg_moderation_cases_updated_at
BEFORE UPDATE ON moderation_cases
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_price_anomalies_updated_at ON price_anomalies;
CREATE TRIGGER trg_price_anomalies_updated_at
BEFORE UPDATE ON price_anomalies
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_price_alerts_updated_at ON price_alerts;
CREATE TRIGGER trg_price_alerts_updated_at
BEFORE UPDATE ON price_alerts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_carts_updated_at ON carts;
CREATE TRIGGER trg_carts_updated_at
BEFORE UPDATE ON carts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_cart_items_updated_at ON cart_items;
CREATE TRIGGER trg_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_approval_requests_updated_at ON approval_requests;
CREATE TRIGGER trg_approval_requests_updated_at
BEFORE UPDATE ON approval_requests
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;