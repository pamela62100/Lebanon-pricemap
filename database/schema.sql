-- =========================================================
-- WenArkhass  — PostgreSQL Schema
-- =========================================================

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

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trust_level') THEN
    CREATE TYPE trust_level AS ENUM ('low', 'medium', 'high');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'store_status') THEN
    CREATE TYPE store_status AS ENUM ('pending', 'active', 'suspended', 'rejected', 'verified');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'power_status') THEN
    CREATE TYPE power_status AS ENUM ('stable', 'unstable', 'reported_warm', 'unknown');
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

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM (
      'price_verified',
      'price_flagged',
      'price_alert',
      'trust_changed',
      'trust_earned',
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

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedback_type') THEN
    CREATE TYPE feedback_type AS ENUM ('outdated', 'wrong_price', 'general');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedback_status') THEN
    CREATE TYPE feedback_status AS ENUM ('open', 'reviewed', 'resolved');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action') THEN
    CREATE TYPE audit_action AS ENUM ('approved', 'rejected', 'warned', 'merged', 'suspended', 'deleted', 'updated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fuel_type') THEN
    CREATE TYPE fuel_type AS ENUM ('gasoline_95', 'gasoline_98', 'diesel');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'broadcast_severity') THEN
    CREATE TYPE broadcast_severity AS ENUM ('low', 'medium', 'high', 'critical');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'broadcast_type') THEN
    CREATE TYPE broadcast_type AS ENUM ('stock_out', 'news', 'warning', 'info');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discrepancy_report_type') THEN
    CREATE TYPE discrepancy_report_type AS ENUM ('price_higher', 'price_lower', 'out_of_stock', 'wrong_unit', 'other');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discrepancy_status') THEN
    CREATE TYPE discrepancy_status AS ENUM ('pending', 'approved', 'rejected', 'needs_info');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'missing_product_status') THEN
    CREATE TYPE missing_product_status AS ENUM ('pending', 'forwarded', 'rejected', 'added');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'catalog_change_reason') THEN
    CREATE TYPE catalog_change_reason AS ENUM ('discrepancy_approved', 'promo_started', 'promo_ended', 'owner_update', 'admin_override');
  END IF;
END
$$;

-- =========================================================
-- Users
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  role            VARCHAR(20)    NOT NULL DEFAULT 'shopper',
  status          VARCHAR(20)  NOT NULL DEFAULT 'active',

  email           CITEXT       NOT NULL UNIQUE,
  password_hash   TEXT         NOT NULL,

  name            VARCHAR(150),
  avatar_initials VARCHAR(10),

  city            VARCHAR(100),
  district        VARCHAR(100),

  trust_score     SMALLINT     NOT NULL DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 100),
  trust_level     VARCHAR(20)  NOT NULL DEFAULT 'medium',
  upload_count    INTEGER      NOT NULL DEFAULT 0,
  verified_count  INTEGER      NOT NULL DEFAULT 0,

  joined_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_login_at   TIMESTAMPTZ,

  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Geography
-- =========================================================

CREATE TABLE IF NOT EXISTS regions (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS districts (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id  UUID         REFERENCES regions(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_region_district UNIQUE (region_id, name)
);

-- =========================================================
-- Stores
-- =========================================================

CREATE TABLE IF NOT EXISTS stores (
  id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id        UUID          REFERENCES users(id) ON DELETE SET NULL, -- nullable for chains

  name                 VARCHAR(255)  NOT NULL,
  chain                VARCHAR(150),
  city                 VARCHAR(100),
  district             VARCHAR(100),
  region               VARCHAR(100), -- denormalized for quick display

  address_line_1       TEXT,
  latitude             NUMERIC(10,7),
  longitude            NUMERIC(10,7),

  logo_url             TEXT,
  cover_image_url      TEXT,

  trust_score          SMALLINT      NOT NULL DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 100),
  status               store_status  NOT NULL DEFAULT 'pending',
  is_verified_retailer BOOLEAN       NOT NULL DEFAULT FALSE,
  power_status         power_status  NOT NULL DEFAULT 'stable',

  internal_rate_lbp    NUMERIC(12,2),
  sync_method          sync_method   NOT NULL DEFAULT 'manual',
  api_enabled          BOOLEAN       NOT NULL DEFAULT FALSE,

  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_api_keys (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id      UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  api_key_hash  TEXT        NOT NULL UNIQUE,
  key_label     VARCHAR(150),
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  last_used_at  TIMESTAMPTZ,
  created_by    UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at    TIMESTAMPTZ
);

-- =========================================================
-- Retailer Onboarding
-- =========================================================

CREATE TABLE IF NOT EXISTS retailer_onboarding_applications (
  id                   UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID               REFERENCES users(id) ON DELETE SET NULL,
  store_id             UUID               REFERENCES stores(id) ON DELETE SET NULL,

  contact_name         VARCHAR(150)       NOT NULL,
  email                CITEXT             NOT NULL,
  phone                VARCHAR(50),

  proposed_store_name  VARCHAR(255)       NOT NULL,
  city                 VARCHAR(100),
  district             VARCHAR(100),
  address_text         TEXT,
  latitude             NUMERIC(10,7),
  longitude            NUMERIC(10,7),

  current_step         SMALLINT           NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 5),
  total_steps          SMALLINT           NOT NULL DEFAULT 5,
  status               onboarding_status  NOT NULL DEFAULT 'pending',
  admin_notes          TEXT,

  applied_at           TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  reviewed_at          TIMESTAMPTZ,
  reviewed_by          UUID               REFERENCES users(id) ON DELETE SET NULL,

  created_at           TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS retailer_onboarding_documents (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID        NOT NULL REFERENCES retailer_onboarding_applications(id) ON DELETE CASCADE,
  document_type  VARCHAR(50) NOT NULL,
  file_url       TEXT        NOT NULL,
  uploaded_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Categories
-- =========================================================

CREATE TABLE IF NOT EXISTS categories (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER      NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Products
-- =========================================================

CREATE TABLE IF NOT EXISTS products (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID         REFERENCES categories(id) ON DELETE SET NULL,

  name         VARCHAR(255) NOT NULL,
  name_ar      VARCHAR(255),
  description  TEXT,
  unit         VARCHAR(100) NOT NULL,
  brand        VARCHAR(150),
  barcode      VARCHAR(100) UNIQUE,

  upload_count INTEGER      NOT NULL DEFAULT 0,
  is_archived  BOOLEAN      NOT NULL DEFAULT FALSE,

  merged_into_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_by   UUID         REFERENCES users(id) ON DELETE SET NULL,

  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_aliases (
  id            SERIAL       PRIMARY KEY,
  product_id    UUID         NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alias         VARCHAR(255) NOT NULL,
  language_code VARCHAR(10)  DEFAULT 'en',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_product_alias UNIQUE (product_id, alias)
);

-- =========================================================
-- Store Catalog (official prices maintained by retailer/admin)
-- =========================================================

CREATE TABLE IF NOT EXISTS store_catalog_items (
  id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id           UUID         NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id         UUID         NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  official_price_lbp NUMERIC(12,2) CHECK (official_price_lbp IS NULL OR official_price_lbp >= 0),
  promo_price_lbp    NUMERIC(12,2) CHECK (promo_price_lbp IS NULL OR promo_price_lbp >= 0),
  promo_ends_at      TIMESTAMPTZ,
  is_in_stock        BOOLEAN      NOT NULL DEFAULT TRUE,
  is_promotion       BOOLEAN      NOT NULL DEFAULT FALSE,

  last_updated_by    UUID         REFERENCES users(id) ON DELETE SET NULL,
  last_updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_store_catalog UNIQUE (store_id, product_id)
);

-- =========================================================
-- Catalog Discrepancy Reports
-- =========================================================

CREATE TABLE IF NOT EXISTS catalog_discrepancy_reports (
  id                     UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id        UUID                    NOT NULL REFERENCES store_catalog_items(id) ON DELETE CASCADE,
  store_id               UUID                    NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id             UUID                    NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  reported_by            UUID                    REFERENCES users(id) ON DELETE SET NULL,
  reporter_trust_score   SMALLINT,

  report_type            discrepancy_report_type NOT NULL,
  observed_price_lbp     NUMERIC(12,2),
  note                   TEXT,

  status                 discrepancy_status      NOT NULL DEFAULT 'pending',
  approved_new_price_lbp NUMERIC(12,2),
  review_note            TEXT,
  reviewed_by            UUID                    REFERENCES users(id) ON DELETE SET NULL,

  created_at             TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
  resolved_at            TIMESTAMPTZ
);

-- =========================================================
-- Missing Product Requests
-- =========================================================

CREATE TABLE IF NOT EXISTS missing_product_requests (
  id                    UUID                   PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id              UUID                   NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id            UUID                   REFERENCES products(id) ON DELETE SET NULL,
  product_name_freetext VARCHAR(255),

  requested_by          UUID                   REFERENCES users(id) ON DELETE SET NULL,
  requester_trust_score SMALLINT,
  note                  TEXT,

  status                missing_product_status NOT NULL DEFAULT 'pending',
  review_note           TEXT,
  reviewed_by           UUID                   REFERENCES users(id) ON DELETE SET NULL,

  created_at            TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
  resolved_at           TIMESTAMPTZ
);

-- =========================================================
-- Catalog Audit Log
-- =========================================================

CREATE TABLE IF NOT EXISTS catalog_audit_entries (
  id                 UUID                  PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id    UUID                  NOT NULL REFERENCES store_catalog_items(id) ON DELETE CASCADE,
  store_id           UUID                  NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id         UUID                  NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  changed_by         UUID                  REFERENCES users(id) ON DELETE SET NULL,
  reason             catalog_change_reason NOT NULL,
  related_report_id  UUID                  REFERENCES catalog_discrepancy_reports(id) ON DELETE SET NULL,

  previous_price_lbp NUMERIC(12,2),
  new_price_lbp      NUMERIC(12,2),
  note               TEXT,

  created_at         TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Store Promotions
-- =========================================================

CREATE TABLE IF NOT EXISTS store_promotions (
  id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id           UUID         NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id         UUID         NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  title              VARCHAR(255),
  discount_percent   NUMERIC(5,2),
  original_price_lbp NUMERIC(12,2),
  promo_price_lbp    NUMERIC(12,2) NOT NULL CHECK (promo_price_lbp >= 0),

  starts_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  ends_at            TIMESTAMPTZ,
  status             promo_status NOT NULL DEFAULT 'active',

  created_by         UUID         REFERENCES users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_sync_runs (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id          UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  method            sync_method NOT NULL,
  status            sync_status NOT NULL,
  records_received  INTEGER,
  records_processed INTEGER,
  records_failed    INTEGER,
  message           TEXT,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at       TIMESTAMPTZ,
  created_by        UUID        REFERENCES users(id) ON DELETE SET NULL
);

-- =========================================================
-- Price Submissions (community crowdsourced prices)
-- =========================================================

CREATE TABLE IF NOT EXISTS price_submissions (
  id                    UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id              UUID               NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id            UUID               NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  submitted_by          UUID               REFERENCES users(id) ON DELETE SET NULL,

  source                submission_source  NOT NULL DEFAULT 'community',
  submission_status     submission_status  NOT NULL DEFAULT 'pending',

  price_lbp             NUMERIC(12,2)      NOT NULL CHECK (price_lbp >= 0),
  is_promotion          BOOLEAN            NOT NULL DEFAULT FALSE,
  promo_ends_at         TIMESTAMPTZ,

  note                  TEXT,

  submitter_trust_score SMALLINT,

  verified_by           UUID               REFERENCES users(id) ON DELETE SET NULL,
  verified_at           TIMESTAMPTZ,
  rejected_by           UUID               REFERENCES users(id) ON DELETE SET NULL,
  rejected_at           TIMESTAMPTZ,

  superseded_by         UUID               REFERENCES price_submissions(id) ON DELETE SET NULL,

  created_at            TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS current_store_product_prices (
  id                   UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id             UUID               NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id           UUID               NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  latest_submission_id UUID               REFERENCES price_submissions(id) ON DELETE SET NULL,

  current_price_lbp    NUMERIC(12,2)      NOT NULL CHECK (current_price_lbp >= 0),
  source               submission_source  NOT NULL,
  confidence_score     SMALLINT           NOT NULL DEFAULT 50 CHECK (confidence_score BETWEEN 0 AND 100),
  confirmation_count   INTEGER            NOT NULL DEFAULT 0,
  trust_level          VARCHAR(20)        DEFAULT 'medium',
  is_verified          BOOLEAN            NOT NULL DEFAULT FALSE,
  is_in_stock          BOOLEAN            NOT NULL DEFAULT TRUE,

  updated_at           TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_current_store_product UNIQUE (store_id, product_id)
);

-- =========================================================
-- Price Feedback
-- =========================================================

CREATE TABLE IF NOT EXISTS price_feedback (
  id             UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  price_entry_id UUID            NOT NULL REFERENCES price_submissions(id) ON DELETE CASCADE,
  submitted_by   UUID            REFERENCES users(id) ON DELETE SET NULL,

  type           feedback_type   NOT NULL,
  note           TEXT,
  status         feedback_status NOT NULL DEFAULT 'open',

  created_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Price Confirmations, Reports & Notes
-- =========================================================

CREATE TABLE IF NOT EXISTS price_confirmations (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  price_submission_id UUID        NOT NULL REFERENCES price_submissions(id) ON DELETE CASCADE,
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_price_confirmation UNIQUE (price_submission_id, user_id)
);

CREATE TABLE IF NOT EXISTS price_reports (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  price_submission_id UUID        NOT NULL REFERENCES price_submissions(id) ON DELETE CASCADE,
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type         VARCHAR(50) NOT NULL,
  note                TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_notes (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  price_submission_id UUID        NOT NULL REFERENCES price_submissions(id) ON DELETE CASCADE,
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note                TEXT        NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Moderation Cases
-- =========================================================

CREATE TABLE IF NOT EXISTS moderation_cases (
  id                  UUID                   PRIMARY KEY DEFAULT gen_random_uuid(),
  price_submission_id UUID                   NOT NULL REFERENCES price_submissions(id) ON DELETE CASCADE,

  case_type           VARCHAR(50)            NOT NULL,
  status              moderation_case_status NOT NULL DEFAULT 'pending',
  severity            severity_level         NOT NULL DEFAULT 'medium',

  case_note           TEXT,
  assigned_to         UUID                   REFERENCES users(id) ON DELETE SET NULL,
  resolved_by         UUID                   REFERENCES users(id) ON DELETE SET NULL,
  resolved_at         TIMESTAMPTZ,

  created_at          TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ            NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Price Anomalies
-- =========================================================

CREATE TABLE IF NOT EXISTS price_anomalies (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id            UUID            NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id          UUID            NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price_submission_id UUID            REFERENCES price_submissions(id) ON DELETE SET NULL,

  old_price_lbp       NUMERIC(12,2)   NOT NULL,
  new_price_lbp       NUMERIC(12,2)   NOT NULL,
  change_percent      NUMERIC(8,2)    NOT NULL,

  severity            severity_level  NOT NULL DEFAULT 'medium',
  status              anomaly_status  NOT NULL DEFAULT 'active',

  detected_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  investigated_by     UUID            REFERENCES users(id) ON DELETE SET NULL,
  investigated_at     TIMESTAMPTZ,
  resolution_note     TEXT,

  created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Admin Audit Logs
-- =========================================================

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  performed_by          UUID         REFERENCES users(id) ON DELETE SET NULL,

  action                audit_action NOT NULL,
  target_user_id        UUID         REFERENCES users(id) ON DELETE SET NULL,
  target_price_entry_id UUID         REFERENCES price_submissions(id) ON DELETE SET NULL,
  target_product_id     UUID         REFERENCES products(id) ON DELETE SET NULL,

  note                  TEXT,
  metadata              JSONB        NOT NULL DEFAULT '{}'::jsonb,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Notifications
-- =========================================================

CREATE TABLE IF NOT EXISTS notifications (
  id                     UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID               NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                   notification_type  NOT NULL DEFAULT 'system',

  title                  VARCHAR(255)       NOT NULL,
  message                TEXT               NOT NULL,

  related_price_entry_id UUID               REFERENCES price_submissions(id) ON DELETE SET NULL,
  related_store_id       UUID               REFERENCES stores(id) ON DELETE SET NULL,
  related_product_id     UUID               REFERENCES products(id) ON DELETE SET NULL,
  related_alert_id       UUID,              -- FK added after price_alerts

  is_read                BOOLEAN            NOT NULL DEFAULT FALSE,
  read_at                TIMESTAMPTZ,
  created_at             TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Price Alerts
-- =========================================================

CREATE TABLE IF NOT EXISTS price_alerts (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id    UUID         NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  threshold_lbp NUMERIC(12,2) NOT NULL CHECK (threshold_lbp >= 0),
  verified_only BOOLEAN      NOT NULL DEFAULT TRUE,
  status        alert_status NOT NULL DEFAULT 'active',

  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_alert_regions (
  alert_id  UUID NOT NULL REFERENCES price_alerts(id) ON DELETE CASCADE,
  region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
  PRIMARY KEY (alert_id, region_id)
);

-- Add FK from notifications to price_alerts now that the table exists
ALTER TABLE notifications
  ADD CONSTRAINT fk_notifications_alert
  FOREIGN KEY (related_alert_id) REFERENCES price_alerts(id) ON DELETE SET NULL;

-- =========================================================
-- Fuel Prices (official Ministry of Energy)
-- =========================================================

CREATE TABLE IF NOT EXISTS fuel_prices (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  fuel_type          fuel_type   NOT NULL,

  official_price_lbp NUMERIC(12,2) NOT NULL,
  reported_price_lbp NUMERIC(12,2),

  effective_from     TIMESTAMPTZ NOT NULL,
  effective_to       TIMESTAMPTZ,
  source             VARCHAR(255),

  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Station Reports (fuel availability at specific stores)
-- =========================================================

CREATE TABLE IF NOT EXISTS station_reports (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id         UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  fuel_type        fuel_type   NOT NULL,

  is_open          BOOLEAN     NOT NULL DEFAULT TRUE,
  has_stock        BOOLEAN     NOT NULL DEFAULT TRUE,
  queue_minutes    INTEGER     NOT NULL DEFAULT 0,
  queue_depth      INTEGER     NOT NULL DEFAULT 0,
  is_rationed      BOOLEAN     NOT NULL DEFAULT FALSE,
  limit_amount_lbp NUMERIC(12,2),

  reported_by      UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS station_report_confirmations (
  report_id  UUID NOT NULL REFERENCES station_reports(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (report_id, user_id)
);

-- =========================================================
-- Approval Requests
-- =========================================================

CREATE TABLE IF NOT EXISTS approval_requests (
  id           UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by UUID             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_by  UUID             REFERENCES users(id) ON DELETE SET NULL,

  action       VARCHAR(100)     NOT NULL,  -- e.g. 'account:delete', 'bulk:delete'
  label        VARCHAR(255)     NOT NULL,
  payload      JSONB            NOT NULL DEFAULT '{}'::jsonb,

  status       approval_status  NOT NULL DEFAULT 'pending',
  review_note  TEXT,

  created_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  resolved_at  TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Cart
-- =========================================================

CREATE TABLE IF NOT EXISTS carts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id    UUID        NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  store_id   UUID        REFERENCES stores(id) ON DELETE SET NULL,
  quantity   INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- System Broadcasts / Global Alerts
-- =========================================================

CREATE TABLE IF NOT EXISTS system_broadcasts (
  id         UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  type       broadcast_type     NOT NULL DEFAULT 'info',
  message    TEXT               NOT NULL,
  severity   broadcast_severity NOT NULL DEFAULT 'medium',
  is_active  BOOLEAN            NOT NULL DEFAULT TRUE,
  starts_at  TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  ends_at    TIMESTAMPTZ,
  priority   INTEGER            NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Indexes
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_users_role            ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status          ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_city            ON users(city);

CREATE INDEX IF NOT EXISTS idx_stores_status         ON stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_region         ON stores(region);
CREATE INDEX IF NOT EXISTS idx_stores_owner          ON stores(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_stores_city_district  ON stores(city, district);

CREATE INDEX IF NOT EXISTS idx_products_name         ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_barcode      ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category     ON products(category_id);

CREATE INDEX IF NOT EXISTS idx_catalog_store         ON store_catalog_items(store_id);
CREATE INDEX IF NOT EXISTS idx_catalog_product       ON store_catalog_items(product_id);

CREATE INDEX IF NOT EXISTS idx_discrepancy_status    ON catalog_discrepancy_reports(status);
CREATE INDEX IF NOT EXISTS idx_discrepancy_store     ON catalog_discrepancy_reports(store_id);

CREATE INDEX IF NOT EXISTS idx_missing_status        ON missing_product_requests(status);
CREATE INDEX IF NOT EXISTS idx_missing_store         ON missing_product_requests(store_id);

CREATE INDEX IF NOT EXISTS idx_promotions_store      ON store_promotions(store_id);
CREATE INDEX IF NOT EXISTS idx_promotions_product    ON store_promotions(product_id);
CREATE INDEX IF NOT EXISTS idx_promotions_status     ON store_promotions(status);

CREATE INDEX IF NOT EXISTS idx_submissions_store_product ON price_submissions(store_id, product_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status        ON price_submissions(submission_status);
CREATE INDEX IF NOT EXISTS idx_submissions_source        ON price_submissions(source);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at    ON price_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_mismatch      ON price_submissions(mismatch_detected);

CREATE INDEX IF NOT EXISTS idx_current_prices_store    ON current_store_product_prices(store_id);
CREATE INDEX IF NOT EXISTS idx_current_prices_product  ON current_store_product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_current_prices_verified ON current_store_product_prices(is_verified);

CREATE INDEX IF NOT EXISTS idx_feedback_entry        ON price_feedback(price_entry_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status       ON price_feedback(status);

CREATE INDEX IF NOT EXISTS idx_moderation_status     ON moderation_cases(status);
CREATE INDEX IF NOT EXISTS idx_moderation_severity   ON moderation_cases(severity);

CREATE INDEX IF NOT EXISTS idx_anomalies_status      ON price_anomalies(status);
CREATE INDEX IF NOT EXISTS idx_anomalies_detected    ON price_anomalies(detected_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_performer  ON admin_audit_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON admin_audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread  ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_alerts_user           ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_product        ON price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status         ON price_alerts(status);

CREATE INDEX IF NOT EXISTS idx_fuel_type             ON fuel_prices(fuel_type);
CREATE INDEX IF NOT EXISTS idx_fuel_effective        ON fuel_prices(effective_from DESC);

CREATE INDEX IF NOT EXISTS idx_station_store         ON station_reports(store_id);
CREATE INDEX IF NOT EXISTS idx_station_fuel          ON station_reports(fuel_type);

CREATE INDEX IF NOT EXISTS idx_approval_status       ON approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_approval_user         ON approval_requests(requested_by);

CREATE INDEX IF NOT EXISTS idx_broadcasts_active     ON system_broadcasts(is_active);

CREATE INDEX IF NOT EXISTS idx_onboarding_status     ON retailer_onboarding_applications(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_user       ON retailer_onboarding_applications(user_id);

-- =========================================================
-- updated_at triggers
-- =========================================================

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_stores_updated_at ON stores;
CREATE TRIGGER trg_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_store_catalog_items_updated_at ON store_catalog_items;
CREATE TRIGGER trg_store_catalog_items_updated_at BEFORE UPDATE ON store_catalog_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_store_promotions_updated_at ON store_promotions;
CREATE TRIGGER trg_store_promotions_updated_at BEFORE UPDATE ON store_promotions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_price_submissions_updated_at ON price_submissions;
CREATE TRIGGER trg_price_submissions_updated_at BEFORE UPDATE ON price_submissions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_moderation_cases_updated_at ON moderation_cases;
CREATE TRIGGER trg_moderation_cases_updated_at BEFORE UPDATE ON moderation_cases FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_price_anomalies_updated_at ON price_anomalies;
CREATE TRIGGER trg_price_anomalies_updated_at BEFORE UPDATE ON price_anomalies FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_price_alerts_updated_at ON price_alerts;
CREATE TRIGGER trg_price_alerts_updated_at BEFORE UPDATE ON price_alerts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_approval_requests_updated_at ON approval_requests;
CREATE TRIGGER trg_approval_requests_updated_at BEFORE UPDATE ON approval_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_carts_updated_at ON carts;
CREATE TRIGGER trg_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_cart_items_updated_at ON cart_items;
CREATE TRIGGER trg_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_retailer_onboarding_updated_at ON retailer_onboarding_applications;
CREATE TRIGGER trg_retailer_onboarding_updated_at BEFORE UPDATE ON retailer_onboarding_applications FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;