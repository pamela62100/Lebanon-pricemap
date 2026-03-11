BEGIN;

-- =========================================================
-- USERS
-- Password hash values below are placeholders.
-- Replace with real hashes from your auth system if needed.
-- =========================================================

INSERT INTO users (
  id, role, status, email, password_hash,
  first_name, last_name, display_name,
  city, district, avatar_initials, trust_score,
  upload_count, verified_count, email_verified_at, joined_at
)
VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'admin',
  'active',
  'admin@test.com',
  '$2b$10$adminplaceholderhash',
  'Admin',
  'User',
  'Admin User',
  'Beirut',
  'Achrafieh',
  'AU',
  100,
  0,
  0,
  NOW(),
  NOW() - INTERVAL '90 days'
),
(
  '22222222-2222-2222-2222-222222222222',
  'retailer',
  'active',
  'retailer@test.com',
  '$2b$10$retailerplaceholderhash',
  'Habib',
  'Nassar',
  'Habib Market Gemmayzeh',
  'Beirut',
  'Gemmayzeh',
  'HN',
  92,
  0,
  0,
  NOW(),
  NOW() - INTERVAL '60 days'
),
(
  '33333333-3333-3333-3333-333333333333',
  'retailer',
  'active',
  'retailer2@test.com',
  '$2b$10$retailerplaceholderhash2',
  'Michel',
  'Khoury',
  'Coop d''Etat Jounieh',
  'Jounieh',
  'Jounieh',
  'MK',
  82,
  0,
  0,
  NOW(),
  NOW() - INTERVAL '20 days'
),
(
  '44444444-4444-4444-4444-444444444444',
  'shopper',
  'active',
  'layla@test.com',
  '$2b$10$shopperplaceholderhash1',
  'Layla',
  'Khoury',
  'Layla Khoury',
  'Beirut',
  'Achrafieh',
  'LK',
  91,
  42,
  31,
  NOW(),
  NOW() - INTERVAL '120 days'
),
(
  '55555555-5555-5555-5555-555555555555',
  'shopper',
  'active',
  'rima@test.com',
  '$2b$10$shopperplaceholderhash2',
  'Rima',
  'Karam',
  'Rima Karam',
  'Tripoli',
  'Tripoli',
  'RK',
  67,
  18,
  10,
  NOW(),
  NOW() - INTERVAL '100 days'
),
(
  '66666666-6666-6666-6666-666666666666',
  'shopper',
  'warned',
  'fouad@test.com',
  '$2b$10$shopperplaceholderhash3',
  'Fouad',
  'Gemayel',
  'Fouad Gemayel',
  'Jounieh',
  'Jounieh',
  'FG',
  25,
  6,
  2,
  NOW(),
  NOW() - INTERVAL '40 days'
),
(
  '77777777-7777-7777-7777-777777777777',
  'shopper',
  'active',
  'rima2@test.com',
  '$2b$10$shopperplaceholderhash4',
  'Rima',
  'Nassif',
  'Rima Nassif',
  'Beirut',
  'Hamra',
  'RN',
  74,
  12,
  8,
  NOW(),
  NOW() - INTERVAL '30 days'
)
ON CONFLICT (email) DO NOTHING;

-- =========================================================
-- REGIONS
-- =========================================================

INSERT INTO regions (id, name)
VALUES
('10000000-0000-0000-0000-000000000001', 'Beirut'),
('10000000-0000-0000-0000-000000000002', 'Mount Lebanon'),
('10000000-0000-0000-0000-000000000003', 'North')
ON CONFLICT (name) DO NOTHING;

-- =========================================================
-- DISTRICTS
-- =========================================================

INSERT INTO districts (id, region_id, name)
VALUES
('11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Achrafieh'),
('11000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Hamra'),
('11000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Gemmayzeh'),
('11000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Jounieh'),
('11000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'Tripoli')
ON CONFLICT (region_id, name) DO NOTHING;

-- =========================================================
-- STORES
-- =========================================================

INSERT INTO stores (
  id, owner_user_id, name, slug, arabic_name,
  city, district, district_id, region_id,
  address_line_1, latitude, longitude,
  trust_score, status, is_verified_partner,
  sync_method, api_enabled, internal_rate_lbp,
  created_at
)
VALUES
(
  '20000000-0000-0000-0000-000000000001',
  '22222222-2222-2222-2222-222222222222',
  'Habib Market Gemmayzeh',
  'habib-market-gemmayzeh',
  'حبيب ماركت الجميزة',
  'Beirut',
  'Gemmayzeh',
  '11000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  'Gemmayzeh Main Street',
  33.8959000,
  35.5177000,
  89,
  'active',
  TRUE,
  'api',
  TRUE,
  89541.00,
  NOW() - INTERVAL '60 days'
),
(
  '20000000-0000-0000-0000-000000000002',
  '33333333-3333-3333-3333-333333333333',
  'Coop d''Etat Jounieh',
  'coop-etat-jounieh',
  'تعاونية الدولة جونية',
  'Jounieh',
  'Jounieh',
  '11000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000002',
  'Jounieh Highway',
  33.9808000,
  35.6171000,
  82,
  'pending',
  FALSE,
  'manual',
  FALSE,
  89541.00,
  NOW() - INTERVAL '10 days'
),
(
  '20000000-0000-0000-0000-000000000003',
  NULL,
  'Spinneys Achrafieh',
  'spinneys-achrafieh',
  'سبينس الأشرفية',
  'Beirut',
  'Achrafieh',
  '11000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Achrafieh Center',
  33.8860000,
  35.5240000,
  96,
  'active',
  TRUE,
  'api',
  TRUE,
  89541.00,
  NOW() - INTERVAL '180 days'
),
(
  '20000000-0000-0000-0000-000000000004',
  NULL,
  'Carrefour Dora',
  'carrefour-dora',
  'كارفور الدورة',
  'Beirut',
  'Dora',
  NULL,
  '10000000-0000-0000-0000-000000000001',
  'Dora Highway',
  33.8933000,
  35.5471000,
  97,
  'active',
  TRUE,
  'api',
  TRUE,
  89541.00,
  NOW() - INTERVAL '200 days'
),
(
  '20000000-0000-0000-0000-000000000005',
  NULL,
  'TSC Dbayeh',
  'tsc-dbayeh',
  'تي اس سي ضبية',
  'Dbayeh',
  'Dbayeh',
  NULL,
  '10000000-0000-0000-0000-000000000002',
  'Dbayeh Highway',
  33.9315000,
  35.5890000,
  94,
  'active',
  TRUE,
  'api',
  TRUE,
  89541.00,
  NOW() - INTERVAL '160 days'
)
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- STORE API KEYS
-- =========================================================

INSERT INTO store_api_keys (
  id, store_id, api_key_hash, key_label, is_active, created_by, created_at
)
VALUES
(
  '21000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'hash_habib_api_key_1',
  'Primary Production Key',
  TRUE,
  '11111111-1111-1111-1111-111111111111',
  NOW() - INTERVAL '45 days'
)
ON CONFLICT (api_key_hash) DO NOTHING;

-- =========================================================
-- RETAILER ONBOARDING APPLICATIONS
-- =========================================================

INSERT INTO retailer_onboarding_applications (
  id, user_id, store_id,
  contact_name, email, phone,
  proposed_store_name, city, district, region_id,
  address_text, latitude, longitude,
  current_step, total_steps, status,
  admin_notes, applied_at, reviewed_at, reviewed_by
)
VALUES
(
  '30000000-0000-0000-0000-000000000001',
  '33333333-3333-3333-3333-333333333333',
  '20000000-0000-0000-0000-000000000002',
  'Michel Khoury',
  'retailer2@test.com',
  '+96170000001',
  'Coop d''Etat Jounieh',
  'Jounieh',
  'Jounieh',
  '10000000-0000-0000-0000-000000000002',
  'Jounieh Main Road',
  33.9808000,
  35.6171000,
  2,
  5,
  'in_progress',
  'Waiting for location confirmation.',
  NOW() - INTERVAL '2 days',
  NULL,
  NULL
),
(
  '30000000-0000-0000-0000-000000000002',
  NULL,
  NULL,
  'Ahmad Nassar',
  'alpha@test.com',
  '+96170000002',
  'Alpha Supermarket Tripoli',
  'Tripoli',
  'Tripoli',
  '10000000-0000-0000-0000-000000000003',
  'Tripoli Center',
  34.4335000,
  35.8442000,
  4,
  5,
  'in_progress',
  NULL,
  NOW() - INTERVAL '5 days',
  NULL,
  NULL
),
(
  '30000000-0000-0000-0000-000000000003',
  NULL,
  NULL,
  'Nadia Fares',
  'marche@test.com',
  '+96170000003',
  'Le Marché Saida',
  'Saida',
  'Saida',
  NULL,
  'Saida Main Street',
  NULL,
  NULL,
  1,
  5,
  'pending',
  NULL,
  NOW() - INTERVAL '1 day',
  NULL,
  NULL
)
ON CONFLICT DO NOTHING;

INSERT INTO retailer_onboarding_documents (
  id, application_id, document_type, file_url, uploaded_at
)
VALUES
(
  '31000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'trade_license',
  'https://example.com/docs/coop-trade-license.pdf',
  NOW() - INTERVAL '2 days'
),
(
  '31000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000001',
  'business_registration',
  'https://example.com/docs/coop-business-registration.pdf',
  NOW() - INTERVAL '2 days'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- CATEGORIES
-- =========================================================

INSERT INTO categories (id, name, arabic_name, sort_order)
VALUES
('40000000-0000-0000-0000-000000000001', 'Dairy', 'ألبان', 1),
('40000000-0000-0000-0000-000000000002', 'Bakery', 'مخبوزات', 2),
('40000000-0000-0000-0000-000000000003', 'Oil', 'زيوت', 3),
('40000000-0000-0000-0000-000000000004', 'Fuel', 'وقود', 4),
('40000000-0000-0000-0000-000000000005', 'Produce', 'خضار وفواكه', 5),
('40000000-0000-0000-0000-000000000006', 'Meat', 'لحوم', 6)
ON CONFLICT (name) DO NOTHING;

-- =========================================================
-- PRODUCTS
-- =========================================================

INSERT INTO products (
  id, category_id, name, arabic_name, description, unit, brand, barcode, is_active, created_by
)
VALUES
(
  '50000000-0000-0000-0000-000000000001',
  '40000000-0000-0000-0000-000000000001',
  'Whole Milk TL 1L',
  'حليب كامل الدسم ١ لتر',
  'Whole milk tetra pack 1 liter',
  '1L',
  'Generic',
  '6221012345001',
  TRUE,
  '11111111-1111-1111-1111-111111111111'
),
(
  '50000000-0000-0000-0000-000000000002',
  '40000000-0000-0000-0000-000000000001',
  'Eggs 30 Pack',
  'بيض ٣٠ حبة',
  'Egg tray pack of 30',
  '30 pcs',
  'Generic',
  '6221012345002',
  TRUE,
  '11111111-1111-1111-1111-111111111111'
),
(
  '50000000-0000-0000-0000-000000000003',
  '40000000-0000-0000-0000-000000000002',
  'Bread Standard Loaf',
  'خبز عربي رغيف',
  'Standard loaf bread',
  'loaf',
  'Generic',
  '6221012345003',
  TRUE,
  '11111111-1111-1111-1111-111111111111'
),
(
  '50000000-0000-0000-0000-000000000004',
  '40000000-0000-0000-0000-000000000003',
  'Olive Oil Extra 750ml',
  'زيت زيتون ممتاز ٧٥٠مل',
  'Extra olive oil bottle',
  '750ml',
  'Generic',
  '6221012345004',
  TRUE,
  '11111111-1111-1111-1111-111111111111'
),
(
  '50000000-0000-0000-0000-000000000005',
  '40000000-0000-0000-0000-000000000004',
  'Diesel Fuel per Liter',
  'ديزل لكل لتر',
  'Diesel fuel price per liter',
  'per L',
  NULL,
  '6221012345005',
  TRUE,
  '11111111-1111-1111-1111-111111111111'
),
(
  '50000000-0000-0000-0000-000000000006',
  '40000000-0000-0000-0000-000000000004',
  'Gasoline 95 Octane',
  'بنزين ٩٥ أوكتان',
  'Gasoline 95 octane',
  'per L',
  NULL,
  '6221012345006',
  TRUE,
  '11111111-1111-1111-1111-111111111111'
),
(
  '50000000-0000-0000-0000-000000000007',
  '40000000-0000-0000-0000-000000000006',
  'Chicken per kg',
  'دجاج كيلو',
  'Fresh chicken per kilogram',
  'kg',
  NULL,
  '6221012345007',
  TRUE,
  '11111111-1111-1111-1111-111111111111'
),
(
  '50000000-0000-0000-0000-000000000008',
  '40000000-0000-0000-0000-000000000004',
  'Rice 5kg Bag',
  'رز ٥ كيلو',
  'Rice bag 5kg',
  '5kg',
  NULL,
  '6221012345008',
  TRUE,
  '11111111-1111-1111-1111-111111111111'
)
ON CONFLICT (barcode) DO NOTHING;

INSERT INTO product_aliases (id, product_id, alias, language_code)
VALUES
('51000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'WholeMilk', 'en'),
('51000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 'بيض', 'ar'),
('51000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000003', 'Khobz', 'en')
ON CONFLICT DO NOTHING;

-- =========================================================
-- STORE CATALOG ITEMS
-- =========================================================

INSERT INTO store_catalog_items (
  id, store_id, product_id, listed_name, listed_unit,
  official_price_lbp, is_in_stock, is_active, updated_by, last_synced_at
)
VALUES
(
  '60000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000001',
  'Whole Milk TL 1L',
  '1L',
  128000,
  TRUE,
  TRUE,
  '22222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '1 day'
),
(
  '60000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000002',
  'Eggs 30 Pack',
  '30 pcs',
  550000,
  TRUE,
  TRUE,
  '22222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '1 day'
),
(
  '60000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000003',
  'Bread Standard Loaf',
  'loaf',
  75000,
  TRUE,
  TRUE,
  '22222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '1 day'
),
(
  '60000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000004',
  'Olive Oil Extra 750ml',
  '750ml',
  410000,
  TRUE,
  TRUE,
  '22222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '1 day'
),
(
  '60000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000005',
  'Diesel Fuel per Liter',
  'per L',
  148000,
  TRUE,
  TRUE,
  '22222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (store_id, product_id) DO NOTHING;

-- =========================================================
-- STORE PROMOTIONS
-- =========================================================

INSERT INTO store_promotions (
  id, store_id, product_id, title, promo_price_lbp, regular_price_lbp,
  starts_at, ends_at, status, created_by
)
VALUES
(
  '70000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000001',
  'Whole Milk Promo',
  85000,
  105000,
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '1 day 23 hours',
  'active',
  '22222222-2222-2222-2222-222222222222'
),
(
  '70000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000002',
  'Eggs Promo',
  420000,
  480000,
  NOW() - INTERVAL '1 minute',
  NOW() + INTERVAL '23 hours 59 minutes',
  'active',
  '22222222-2222-2222-2222-222222222222'
),
(
  '70000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000003',
  'Bread Week Promo',
  65000,
  75000,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '1 hour',
  'expired',
  '22222222-2222-2222-2222-222222222222'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- STORE SYNC RUNS
-- =========================================================

INSERT INTO store_sync_runs (
  id, store_id, method, status,
  records_received, records_processed, records_failed,
  message, started_at, finished_at, created_by
)
VALUES
(
  '80000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'api',
  'ok',
  47,
  47,
  0,
  'API Sync completed successfully',
  NOW() - INTERVAL '369 days',
  NOW() - INTERVAL '369 days' + INTERVAL '2 minutes',
  '22222222-2222-2222-2222-222222222222'
),
(
  '80000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000001',
  'api',
  'ok',
  51,
  51,
  0,
  'API Sync completed successfully',
  NOW() - INTERVAL '369 days 1 hour',
  NOW() - INTERVAL '369 days 58 minutes',
  '22222222-2222-2222-2222-222222222222'
),
(
  '80000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000001',
  'csv',
  'ok',
  120,
  120,
  0,
  'CSV Upload imported',
  NOW() - INTERVAL '370 days',
  NOW() - INTERVAL '370 days' + INTERVAL '5 minutes',
  '22222222-2222-2222-2222-222222222222'
),
(
  '80000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000001',
  'api',
  'fail',
  0,
  0,
  0,
  'Authentication failed',
  NOW() - INTERVAL '370 days 1 hour',
  NOW() - INTERVAL '370 days 59 minutes',
  '22222222-2222-2222-2222-222222222222'
),
(
  '80000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000001',
  'manual',
  'ok',
  3,
  3,
  0,
  'Manual entries saved',
  NOW() - INTERVAL '370 days 2 hours',
  NOW() - INTERVAL '370 days 1 hour 55 minutes',
  '22222222-2222-2222-2222-222222222222'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- PRICE SUBMISSIONS
-- =========================================================

INSERT INTO price_submissions (
  id, store_id, product_id, submitted_by,
  source, submission_status, price_lbp,
  quantity_value, quantity_unit,
  receipt_image_url, note,
  ocr_store_name, ocr_product_name, ocr_barcode, ocr_price_lbp,
  mismatch_detected, mismatch_reason,
  trust_snapshot, submitted_at,
  verified_by, verified_at
)
VALUES
(
  '90000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000003',
  '50000000-0000-0000-0000-000000000001',
  '44444444-4444-4444-4444-444444444444',
  'community',
  'verified',
  145000,
  1,
  '1L',
  'https://example.com/receipts/milk1.jpg',
  'Seen today at Spinneys Achrafieh',
  'Spinneys Achrafieh',
  'Whole Milk TL 1L',
  '6221012345001',
  145000,
  FALSE,
  NULL,
  91,
  NOW() - INTERVAL '3 hours',
  '11111111-1111-1111-1111-111111111111',
  NOW() - INTERVAL '2 hours'
),
(
  '90000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '50000000-0000-0000-0000-000000000002',
  '44444444-4444-4444-4444-444444444444',
  'community',
  'verified',
  415000,
  30,
  'pcs',
  'https://example.com/receipts/eggs1.jpg',
  'Receipt matched',
  'Spinneys Achrafieh',
  'Eggs 30 Pack',
  '6221012345002',
  415000,
  FALSE,
  NULL,
  91,
  NOW() - INTERVAL '2 days',
  '11111111-1111-1111-1111-111111111111',
  NOW() - INTERVAL '2 days' + INTERVAL '2 hours'
),
(
  '90000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '50000000-0000-0000-0000-000000000002',
  '66666666-6666-6666-6666-666666666666',
  'community',
  'flagged',
  420000,
  30,
  'pcs',
  'https://example.com/receipts/eggs2.jpg',
  'Receipt looks suspicious',
  'Carrefour Dora',
  'Eggs 30 Pack',
  '6221012345002',
  480000,
  TRUE,
  'Submitted price differs from OCR extracted price',
  25,
  NOW() - INTERVAL '2 hours',
  NULL,
  NULL
),
(
  '90000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000004',
  '50000000-0000-0000-0000-000000000006',
  '55555555-5555-5555-5555-555555555555',
  'community',
  'verified',
  185000,
  1,
  'L',
  'https://example.com/receipts/fuel1.jpg',
  'Big spike today',
  'Carrefour Dora',
  'Gasoline 95 Octane',
  '6221012345006',
  185000,
  FALSE,
  NULL,
  67,
  NOW() - INTERVAL '1 hour',
  '11111111-1111-1111-1111-111111111111',
  NOW() - INTERVAL '30 minutes'
),
(
  '90000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000005',
  '50000000-0000-0000-0000-000000000005',
  '77777777-7777-7777-7777-777777777777',
  'community',
  'verified',
  148000,
  1,
  'L',
  'https://example.com/receipts/diesel1.jpg',
  'Verified only',
  'TSC Dbayeh',
  'Diesel Fuel per Liter',
  '6221012345005',
  148000,
  FALSE,
  NULL,
  74,
  NOW() - INTERVAL '2 hours',
  '11111111-1111-1111-1111-111111111111',
  NOW() - INTERVAL '1 hour'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- CURRENT STORE PRODUCT PRICES
-- =========================================================

INSERT INTO current_store_product_prices (
  id, store_id, product_id, latest_submission_id,
  current_price_lbp, source, confidence_score,
  confirmation_count, trust_level, is_verified, is_in_stock, updated_at
)
VALUES
(
  '91000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000003',
  '50000000-0000-0000-0000-000000000001',
  '90000000-0000-0000-0000-000000000001',
  145000,
  'community',
  91,
  3,
  'high',
  TRUE,
  TRUE,
  NOW() - INTERVAL '2 hours'
),
(
  '91000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  '50000000-0000-0000-0000-000000000002',
  '90000000-0000-0000-0000-000000000002',
  415000,
  'community',
  92,
  5,
  'high',
  TRUE,
  TRUE,
  NOW() - INTERVAL '2 days'
),
(
  '91000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  '50000000-0000-0000-0000-000000000006',
  '90000000-0000-0000-0000-000000000004',
  185000,
  'community',
  88,
  2,
  'high',
  TRUE,
  TRUE,
  NOW() - INTERVAL '30 minutes'
),
(
  '91000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000005',
  '50000000-0000-0000-0000-000000000005',
  '90000000-0000-0000-0000-000000000005',
  148000,
  'community',
  85,
  2,
  'high',
  TRUE,
  TRUE,
  NOW() - INTERVAL '1 hour'
)
ON CONFLICT (store_id, product_id) DO NOTHING;

-- =========================================================
-- PRICE CONFIRMATIONS
-- =========================================================

INSERT INTO price_confirmations (id, price_submission_id, user_id, created_at)
VALUES
('92000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '2 hours'),
('92000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000001', '77777777-7777-7777-7777-777777777777', NOW() - INTERVAL '90 minutes'),
('92000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '40 hours'),
('92000000-0000-0000-0000-000000000004', '90000000-0000-0000-0000-000000000002', '77777777-7777-7777-7777-777777777777', NOW() - INTERVAL '39 hours')
ON CONFLICT (price_submission_id, user_id) DO NOTHING;

-- =========================================================
-- PRICE REPORTS
-- =========================================================

INSERT INTO price_reports (id, price_submission_id, user_id, report_type, note, created_at)
VALUES
(
  '93000000-0000-0000-0000-000000000001',
  '90000000-0000-0000-0000-000000000003',
  '44444444-4444-4444-4444-444444444444',
  'wrong_price',
  'Receipt image and number do not match.',
  NOW() - INTERVAL '90 minutes'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- PRICE NOTES
-- =========================================================

INSERT INTO price_notes (id, price_submission_id, user_id, note, created_at)
VALUES
(
  '94000000-0000-0000-0000-000000000001',
  '90000000-0000-0000-0000-000000000002',
  '44444444-4444-4444-4444-444444444444',
  'Price seemed stable compared to last week.',
  NOW() - INTERVAL '47 hours'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- MODERATION CASES
-- =========================================================

INSERT INTO moderation_cases (
  id, price_submission_id, case_type, status, severity,
  submitted_price_lbp, extracted_price_lbp,
  submitted_product_label, extracted_product_label,
  case_note, assigned_to, created_at
)
VALUES
(
  '95000000-0000-0000-0000-000000000001',
  '90000000-0000-0000-0000-000000000003',
  'receipt_mismatch',
  'pending',
  'high',
  420000,
  480000,
  'Eggs 30 Pack',
  'Eggs 30 Pack',
  'Price mismatch detected — submitted vs OCR extracted differ.',
  '11111111-1111-1111-1111-111111111111',
  NOW() - INTERVAL '2 hours'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- PRICE ANOMALIES
-- =========================================================

INSERT INTO price_anomalies (
  id, store_id, product_id, price_submission_id,
  old_price_lbp, new_price_lbp, change_percent,
  severity, status, region_id, detected_at
)
VALUES
(
  '96000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000004',
  '50000000-0000-0000-0000-000000000006',
  '90000000-0000-0000-0000-000000000004',
  121000,
  185000,
  52.89,
  'critical',
  'active',
  '10000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '1 hour'
),
(
  '96000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000005',
  '50000000-0000-0000-0000-000000000005',
  '90000000-0000-0000-0000-000000000005',
  105000,
  148000,
  40.95,
  'high',
  'active',
  '10000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '2 hours'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- PRICE ALERTS
-- =========================================================

INSERT INTO price_alerts (
  id, user_id, product_id, threshold_lbp, verified_only, status, created_at
)
VALUES
(
  '97000000-0000-0000-0000-000000000001',
  '44444444-4444-4444-4444-444444444444',
  '50000000-0000-0000-0000-000000000005',
  105000,
  TRUE,
  'active',
  NOW() - INTERVAL '10 days'
),
(
  '97000000-0000-0000-0000-000000000002',
  '44444444-4444-4444-4444-444444444444',
  '50000000-0000-0000-0000-000000000001',
  120000,
  FALSE,
  'active',
  NOW() - INTERVAL '8 days'
),
(
  '97000000-0000-0000-0000-000000000003',
  '44444444-4444-4444-4444-444444444444',
  '50000000-0000-0000-0000-000000000002',
  380000,
  TRUE,
  'paused',
  NOW() - INTERVAL '4 days'
)
ON CONFLICT DO NOTHING;

INSERT INTO price_alert_regions (alert_id, region_id)
VALUES
('97000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
('97000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'),
('97000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001'),
('97000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),
('97000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- =========================================================
-- CARTS
-- =========================================================

INSERT INTO carts (id, user_id, created_at, updated_at)
VALUES
(
  '98000000-0000-0000-0000-000000000001',
  '44444444-4444-4444-4444-444444444444',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 hour'
)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO cart_items (id, cart_id, product_id, store_id, quantity, created_at, updated_at)
VALUES
(
  '98100000-0000-0000-0000-000000000001',
  '98000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000003',
  1,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),
(
  '98100000-0000-0000-0000-000000000002',
  '98000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003',
  1,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- NOTIFICATIONS
-- =========================================================

INSERT INTO notifications (
  id, user_id, type, title, message,
  related_store_id, related_product_id, related_price_submission_id, related_alert_id,
  is_read, created_at
)
VALUES
(
  '99000000-0000-0000-0000-000000000001',
  '44444444-4444-4444-4444-444444444444',
  'price_verified',
  'Price verified',
  'Your price submission for Whole Milk TL 1L was verified.',
  '20000000-0000-0000-0000-000000000003',
  '50000000-0000-0000-0000-000000000001',
  '90000000-0000-0000-0000-000000000001',
  NULL,
  FALSE,
  NOW() - INTERVAL '2 hours'
),
(
  '99000000-0000-0000-0000-000000000002',
  '44444444-4444-4444-4444-444444444444',
  'price_alert',
  'Alert triggered',
  'Whole Milk TL 1L is below 120,000 LBP in one of your selected areas.',
  '20000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000001',
  NULL,
  '97000000-0000-0000-0000-000000000002',
  FALSE,
  NOW() - INTERVAL '30 minutes'
),
(
  '99000000-0000-0000-0000-000000000003',
  '22222222-2222-2222-2222-222222222222',
  'store_update',
  'Promotion expiring soon',
  'Your Eggs Promo will expire in less than 24 hours.',
  '20000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000002',
  NULL,
  NULL,
  FALSE,
  NOW() - INTERVAL '10 minutes'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- APPROVAL REQUESTS
-- =========================================================

INSERT INTO approval_requests (
  id, requested_by, reviewed_by,
  approval_type, label, action_key, payload, status,
  review_note, created_at, reviewed_at, updated_at
)
VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  '44444444-4444-4444-4444-444444444444',
  NULL,
  'account_delete',
  'Delete Account',
  'account:delete',
  '{"reason":"User requested account deletion"}'::jsonb,
  'pending',
  NULL,
  NOW() - INTERVAL '1 hour',
  NULL,
  NOW() - INTERVAL '1 hour'
),
(
  'a0000000-0000-0000-0000-000000000002',
  '55555555-5555-5555-5555-555555555555',
  NULL,
  'bulk_delete_prices',
  'Bulk Delete Price Submissions',
  'bulk:delete',
  '{"count":12}'::jsonb,
  'pending',
  NULL,
  NOW() - INTERVAL '1 hour',
  NULL,
  NOW() - INTERVAL '1 hour'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- ADMIN ACTIVITY LOGS
-- =========================================================

INSERT INTO admin_activity_logs (
  id, admin_user_id, action, entity_type, entity_id,
  title, description, metadata, created_at
)
VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'approved',
  'price_submission',
  '90000000-0000-0000-0000-000000000002',
  'Approved',
  'Verified against uploaded receipt — Spinneys Achrafieh',
  '{"price_submission_id":"90000000-0000-0000-0000-000000000002"}'::jsonb,
  NOW() - INTERVAL '4 days'
),
(
  'b0000000-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'rejected',
  'price_submission',
  '90000000-0000-0000-0000-000000000003',
  'Rejected',
  'Eggs price flagged for review due to mismatch.',
  '{"price_submission_id":"90000000-0000-0000-0000-000000000003"}'::jsonb,
  NOW() - INTERVAL '3 days'
),
(
  'b0000000-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'warned',
  'user',
  '66666666-6666-6666-6666-666666666666',
  'Warned',
  'Third suspicious submission this week by Fouad G.',
  '{"user_id":"66666666-6666-6666-6666-666666666666"}'::jsonb,
  NOW() - INTERVAL '2 days'
),
(
  'b0000000-0000-0000-0000-000000000004',
  '11111111-1111-1111-1111-111111111111',
  'approved_store',
  'store',
  '20000000-0000-0000-0000-000000000001',
  'Approved Store',
  'Activated Habib Market Gemmayzeh.',
  '{"store_id":"20000000-0000-0000-0000-000000000001"}'::jsonb,
  NOW() - INTERVAL '30 days'
)
ON CONFLICT DO NOTHING;

-- =========================================================
-- SYSTEM BROADCASTS
-- =========================================================

INSERT INTO system_broadcasts (
  id, message, is_active, starts_at, ends_at, priority, created_at
)
VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'MARKET UPDATES',
  TRUE,
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '30 days',
  10,
  NOW() - INTERVAL '7 days'
),
(
  'c0000000-0000-0000-0000-000000000002',
  'WARNING: BREAD IS OUT OF STOCK IN 80% OF METN STORES RIGHT NOW.',
  TRUE,
  NOW() - INTERVAL '1 hour',
  NOW() + INTERVAL '6 hours',
  8,
  NOW() - INTERVAL '1 hour'
),
(
  'c0000000-0000-0000-0000-000000000003',
  'MINISTRY OF ENERGY: OFFICIAL FUEL PRICES WILL BE UPDATED IN 4 HOURS.',
  TRUE,
  NOW() - INTERVAL '30 minutes',
  NOW() + INTERVAL '4 hours',
  9,
  NOW() - INTERVAL '30 minutes'
)
ON CONFLICT DO NOTHING;

COMMIT;