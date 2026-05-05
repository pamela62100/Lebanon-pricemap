-- Fix for missing tables and enum values
DO $$
BEGIN
    -- Add 'running' to sync_status enum if not exists
    IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'sync_status' AND e.enumlabel = 'running') THEN
        ALTER TYPE sync_status ADD VALUE 'running' BEFORE 'ok';
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS store_api_keys (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id     UUID         NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  api_key_hash TEXT         NOT NULL,
  key_label    TEXT,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  created_by   UUID         REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  revoked_at   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS store_sync_runs (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id          UUID         NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  method            sync_method  NOT NULL,
  status            sync_status  NOT NULL DEFAULT 'running',
  records_received  INTEGER      DEFAULT 0,
  records_processed INTEGER      DEFAULT 0,
  records_failed    INTEGER      DEFAULT 0,
  message           TEXT,
  started_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  finished_at       TIMESTAMPTZ,
  created_by        UUID         REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS store_sync_items (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_run_id  UUID         NOT NULL REFERENCES store_sync_runs(id) ON DELETE CASCADE,
  product_id   UUID         REFERENCES products(id) ON DELETE SET NULL,
  raw_name     TEXT,
  raw_barcode  TEXT,
  raw_price    NUMERIC,
  status       TEXT         NOT NULL DEFAULT 'pending',
  fail_reason  TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_store   ON store_api_keys(store_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash    ON store_api_keys(api_key_hash);
CREATE INDEX IF NOT EXISTS idx_sync_runs_store  ON store_sync_runs(store_id);
CREATE INDEX IF NOT EXISTS idx_sync_runs_status ON store_sync_runs(status);
CREATE INDEX IF NOT EXISTS idx_sync_items_run   ON store_sync_items(sync_run_id);
