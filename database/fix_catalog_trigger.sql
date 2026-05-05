-- Fix for error: record "new" has no field "updated_at" in store_catalog_items
BEGIN;

-- 1. Create a specific function for tables using 'last_updated_at' instead of 'updated_at'
CREATE OR REPLACE FUNCTION set_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Update the trigger on store_catalog_items to use this new function
DROP TRIGGER IF EXISTS trg_store_catalog_items_updated_at ON store_catalog_items;
CREATE TRIGGER trg_store_catalog_items_updated_at 
BEFORE UPDATE ON store_catalog_items 
FOR EACH ROW 
EXECUTE FUNCTION set_last_updated_at();

COMMIT;
