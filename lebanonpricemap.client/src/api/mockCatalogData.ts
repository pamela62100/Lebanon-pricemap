import type {
  CatalogProduct,
  PriceDiscrepancyReport,
  MissingProductRequest,
  CatalogAuditEntry,
} from '@/types/catalog.types';

// ─── Official Store Catalogs ──────────────────────────────────────────────────
// Each entry represents ONE official price for a product at a specific store.
// These are maintained by the store owner / admin — NOT community crowdsourced.

export const MOCK_CATALOG_PRODUCTS: CatalogProduct[] = [
  // ── Spinneys Achrafieh (s1) ────────────────────────────────────────────────
  {
    id: 'cp1', storeId: 's1', productId: 'p1',
    productName: 'Whole Milk TL 1L', productCategory: 'Dairy', productUnit: '1L',
    officialPriceLbp: 128000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-07T08:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'cp2', storeId: 's1', productId: 'p2',
    productName: 'Eggs 30 Pack', productCategory: 'Dairy', productUnit: '30 pcs',
    officialPriceLbp: 415000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-08T09:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'cp3', storeId: 's1', productId: 'p3',
    productName: 'Bread Standard Loaf', productCategory: 'Bakery', productUnit: 'loaf',
    officialPriceLbp: 89000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-04T07:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'cp4', storeId: 's1', productId: 'p4',
    productName: 'Olive Oil Extra 750ml', productCategory: 'Oil', productUnit: '750ml',
    officialPriceLbp: 590000, isInStock: true, isPromotion: true,
    promoPriceLbp: 520000, promoEndsAt: '2025-03-25T00:00:00Z',
    lastUpdatedAt: '2025-03-08T09:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'cp5', storeId: 's1', productId: 'p7',
    productName: 'Chicken per kg', productCategory: 'Meat', productUnit: 'kg',
    officialPriceLbp: 465000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-04T09:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'cp6', storeId: 's1', productId: 'p9',
    productName: 'Water Bottle 1.5L', productCategory: 'Beverages', productUnit: '1.5L',
    officialPriceLbp: 68000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-05T10:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-01-15T09:00:00Z',
  },

  // ── Habib Market Gemmayzeh (s7) — owner is u4 ─────────────────────────────
  {
    id: 'cp7', storeId: 's7', productId: 'p3',
    productName: 'Bread Standard Loaf', productCategory: 'Bakery', productUnit: 'loaf',
    officialPriceLbp: 82000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-07T07:30:00Z', lastUpdatedBy: 'u4', createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'cp8', storeId: 's7', productId: 'p4',
    productName: 'Olive Oil Extra 750ml', productCategory: 'Oil', productUnit: '750ml',
    officialPriceLbp: 458000, isInStock: true, isPromotion: true,
    promoPriceLbp: 440000, promoEndsAt: '2025-03-15T00:00:00Z',
    lastUpdatedAt: '2025-03-07T09:00:00Z', lastUpdatedBy: 'u4', createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'cp9', storeId: 's7', productId: 'p8',
    productName: 'Egyptian White Rice 5kg', productCategory: 'Grains', productUnit: '5kg',
    officialPriceLbp: 410000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-01T09:00:00Z', lastUpdatedBy: 'u4', createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'cp10', storeId: 's7', productId: 'p10',
    productName: 'Lemon per kg', productCategory: 'Produce', productUnit: 'kg',
    officialPriceLbp: 96000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-07T08:00:00Z', lastUpdatedBy: 'u4', createdAt: '2025-02-01T10:00:00Z',
  },

  // ── TSC Dbayeh (s5) ────────────────────────────────────────────────────────
  {
    id: 'cp11', storeId: 's5', productId: 'p2',
    productName: 'Eggs 30 Pack', productCategory: 'Dairy', productUnit: '30 pcs',
    officialPriceLbp: 395000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-05T09:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-02-10T08:00:00Z',
  },
  {
    id: 'cp12', storeId: 's5', productId: 'p9',
    productName: 'Water Bottle 1.5L', productCategory: 'Beverages', productUnit: '1.5L',
    officialPriceLbp: 45000, isInStock: true, isPromotion: true,
    promoPriceLbp: 38000, promoEndsAt: '2025-03-18T00:00:00Z',
    lastUpdatedAt: '2025-03-07T07:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-02-10T08:00:00Z',
  },
  {
    id: 'cp13', storeId: 's5', productId: 'p5',
    productName: 'Diesel Fuel per Liter', productCategory: 'Fuel', productUnit: 'per L',
    officialPriceLbp: 112000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-07T06:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-02-10T08:00:00Z',
  },

  // ── Bou Khalil Hamra (s4) ─────────────────────────────────────────────────
  {
    id: 'cp14', storeId: 's4', productId: 'p1',
    productName: 'Whole Milk TL 1L', productCategory: 'Dairy', productUnit: '1L',
    officialPriceLbp: 125000, isInStock: true, isPromotion: true,
    promoPriceLbp: 110000, promoEndsAt: '2025-03-20T00:00:00Z',
    lastUpdatedAt: '2025-03-07T06:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-02-15T09:00:00Z',
  },
  {
    id: 'cp15', storeId: 's4', productId: 'p7',
    productName: 'Chicken per kg', productCategory: 'Meat', productUnit: 'kg',
    officialPriceLbp: 385000, isInStock: false, isPromotion: false,
    lastUpdatedAt: '2025-03-06T10:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-02-15T09:00:00Z',
  },

  // ── Carrefour Dora (s6) ───────────────────────────────────────────────────
  {
    id: 'cp16', storeId: 's6', productId: 'p8',
    productName: 'Egyptian White Rice 5kg', productCategory: 'Grains', productUnit: '5kg',
    officialPriceLbp: 448000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-02-28T14:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-01-20T10:00:00Z',
  },
  {
    id: 'cp17', storeId: 's6', productId: 'p6',
    productName: 'Gasoline 95 Octane', productCategory: 'Fuel', productUnit: 'per L',
    officialPriceLbp: 126000, isInStock: true, isPromotion: false,
    lastUpdatedAt: '2025-03-07T08:00:00Z', lastUpdatedBy: 'u5', createdAt: '2025-01-20T10:00:00Z',
  },
];

// ─── Price Discrepancy Reports ────────────────────────────────────────────────
export const MOCK_DISCREPANCY_REPORTS: PriceDiscrepancyReport[] = [
  {
    id: 'dr1', catalogProductId: 'cp1', storeId: 's1', productId: 'p1',
    reportedBy: 'u1', reporterTrustScore: 91,
    reportType: 'price_higher', observedPriceLbp: 148000,
    note: 'Checked today — shelf sticker says 148,000 LBP',
    status: 'pending', createdAt: '2025-03-07T07:00:00Z',
    reporter: { id: 'u1', name: 'Layla Khoury', avatarInitials: 'LK', trustScore: 91 },
  },
  {
    id: 'dr2', catalogProductId: 'cp11', storeId: 's5', productId: 'p2',
    reportedBy: 'u2', reporterTrustScore: 67,
    reportType: 'price_lower', observedPriceLbp: 380000,
    note: 'I saw a discount sticker — 380k not 395k',
    status: 'approved', approvedNewPriceLbp: 380000,
    reviewNote: 'Confirmed via receipt scan. Catalog updated.', reviewedBy: 'u5',
    createdAt: '2025-03-06T08:30:00Z', resolvedAt: '2025-03-06T12:00:00Z',
    reporter: { id: 'u2', name: 'Rima Karam', avatarInitials: 'RK', trustScore: 67 },
  },
  {
    id: 'dr3', catalogProductId: 'cp15', storeId: 's4', productId: 'p7',
    reportedBy: 'u1', reporterTrustScore: 91,
    reportType: 'out_of_stock',
    note: 'Chicken section was completely empty when I visited',
    status: 'approved', reviewNote: 'Confirmed out of stock. Updated isInStock flag.', reviewedBy: 'u5',
    createdAt: '2025-03-06T09:00:00Z', resolvedAt: '2025-03-06T10:30:00Z',
    reporter: { id: 'u1', name: 'Layla Khoury', avatarInitials: 'LK', trustScore: 91 },
  },
  {
    id: 'dr4', catalogProductId: 'cp8', storeId: 's7', productId: 'p4',
    reportedBy: 'u3', reporterTrustScore: 25,
    reportType: 'price_higher', observedPriceLbp: 510000,
    note: 'Promo sign was there but cashier charged full price',
    status: 'rejected', reviewNote: 'Unable to verify. Low-trust reporter — no receipt.', reviewedBy: 'u5',
    createdAt: '2025-03-07T12:00:00Z', resolvedAt: '2025-03-07T14:00:00Z',
    reporter: { id: 'u3', name: 'Fouad Gemayel', avatarInitials: 'FG', trustScore: 25 },
  },
  {
    id: 'dr5', catalogProductId: 'cp16', storeId: 's6', productId: 'p8',
    reportedBy: 'u2', reporterTrustScore: 67,
    reportType: 'price_higher', observedPriceLbp: 470000,
    note: 'Old price on catalog — shelf shows 470k now',
    status: 'pending', createdAt: '2025-03-08T11:00:00Z',
    reporter: { id: 'u2', name: 'Rima Karam', avatarInitials: 'RK', trustScore: 67 },
  },
  {
    id: 'dr6', catalogProductId: 'cp3', storeId: 's1', productId: 'p3',
    reportedBy: 'u1', reporterTrustScore: 91,
    reportType: 'wrong_unit',
    note: "Catalog says 'loaf' but store sells bread by weight now",
    status: 'needs_info', reviewNote: 'Need clarification on the weight unit used.', reviewedBy: 'u5',
    createdAt: '2025-03-08T14:00:00Z',
    reporter: { id: 'u1', name: 'Layla Khoury', avatarInitials: 'LK', trustScore: 91 },
  },
];

// ─── Missing Product Requests ─────────────────────────────────────────────────
export const MOCK_MISSING_PRODUCT_REQUESTS: MissingProductRequest[] = [
  {
    id: 'mp1', storeId: 's1', productId: 'p10',
    requestedBy: 'u1', requesterTrustScore: 91,
    note: 'Spinneys Achrafieh now sells lemons — not in their catalog yet',
    status: 'pending', createdAt: '2025-03-08T15:00:00Z',
  },
  {
    id: 'mp2', storeId: 's7',
    productNameFreeText: 'Labneh TL 500g',
    requestedBy: 'u2', requesterTrustScore: 67,
    note: 'New labneh product on the shelf',
    status: 'forwarded', reviewNote: 'Forwarded to Habib Market owner for catalog update.', reviewedBy: 'u5',
    createdAt: '2025-03-06T09:00:00Z', resolvedAt: '2025-03-06T11:00:00Z',
  },
  {
    id: 'mp3', storeId: 's5',
    productNameFreeText: 'Energy Drink "Monster"',
    requestedBy: 'u3', requesterTrustScore: 25,
    note: 'They sell it at the cashier',
    status: 'rejected', reviewNote: 'Not a primary staple — outside catalog scope.', reviewedBy: 'u5',
    createdAt: '2025-03-07T10:00:00Z', resolvedAt: '2025-03-07T12:00:00Z',
  },
];

// ─── Catalog Audit Entries ────────────────────────────────────────────────────
export const MOCK_CATALOG_AUDIT: CatalogAuditEntry[] = [
  {
    id: 'ca1', catalogProductId: 'cp11', storeId: 's5', productId: 'p2',
    changedBy: 'u5', reason: 'discrepancy_approved', relatedReportId: 'dr2',
    previousPriceLbp: 395000, newPriceLbp: 380000,
    note: 'Community report confirmed via receipt scan.',
    createdAt: '2025-03-06T12:00:00Z',
  },
  {
    id: 'ca2', catalogProductId: 'cp4', storeId: 's1', productId: 'p4',
    changedBy: 'u5', reason: 'promo_started', relatedReportId: null,
    previousPriceLbp: 590000, newPriceLbp: 520000,
    note: 'Promo activated for Olive Oil at Spinneys.',
    createdAt: '2025-03-08T09:00:00Z',
  },
  {
    id: 'ca3', catalogProductId: 'cp1', storeId: 's1', productId: 'p1',
    changedBy: 'u5', reason: 'owner_update', relatedReportId: null,
    previousPriceLbp: 122000, newPriceLbp: 128000,
    note: 'Regular weekly price update by store manager.',
    createdAt: '2025-03-07T08:00:00Z',
  },
];
