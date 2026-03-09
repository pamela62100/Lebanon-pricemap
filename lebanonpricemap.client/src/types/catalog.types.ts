// ─── Catalog-First Architecture Types ─────────────────────────────────────────
// These types implement the Catalog-First flow where verified store catalogs
// are the source of truth, and community users submit discrepancy reports.

export type DiscrepancyType =
  | 'price_higher'
  | 'price_lower'
  | 'out_of_stock'
  | 'product_removed'
  | 'wrong_unit'
  | 'duplicate_listing';

export type DiscrepancyStatus = 'pending' | 'approved' | 'rejected' | 'needs_info' | 'auto_closed';
export type MissingProductStatus = 'pending' | 'forwarded' | 'added' | 'declined' | 'rejected';
export type CatalogChangeReason = 'owner_update' | 'admin_correction' | 'promo_started' | 'promo_ended' | 'discrepancy_approved';

/**
 * One official price per (store, product) pair.
 * Only the store owner or an admin can write to this.
 * This is the single source of truth for what a product costs at a given store.
 */
export interface CatalogProduct {
  id: string;
  storeId: string;
  productId: string;
  productName: string;
  productCategory: string;
  productUnit: string;
  officialPriceLbp: number;
  isInStock: boolean;
  isPromotion: boolean;
  promoPriceLbp?: number;
  promoEndsAt?: string | null;
  lastUpdatedAt: string;
  lastUpdatedBy: string; // userId
  /** ISO date of when this entry was first created */
  createdAt: string;
}

/**
 * Created by a shopper when the shelf price differs from the catalog price.
 * Goes through an admin review → if approved, the catalog is updated atomically.
 */
export interface PriceDiscrepancyReport {
  id: string;
  catalogProductId: string;
  storeId: string;
  productId: string;
  reportedBy: string; // userId
  reporterTrustScore: number;
  reportType: DiscrepancyType;
  /** What the user actually saw on the shelf (if price-related) */
  observedPriceLbp?: number;
  note?: string;
  status: DiscrepancyStatus;
  /** Set by admin when approving — may differ from observedPriceLbp */
  approvedNewPriceLbp?: number;
  reviewNote?: string;
  reviewedBy?: string;
  createdAt: string;
  resolvedAt?: string | null;
  // Enriched
  reporter?: { id: string; name: string; avatarInitials: string; trustScore: number };
  catalogProduct?: CatalogProduct;
}

/**
 * Raised by a shopper when they see a product in the store that isn't in the catalog.
 * Admin can forward to the store owner, or decline/reject.
 */
export interface MissingProductRequest {
  id: string;
  storeId: string;
  /** May refer to an existing Product or be a free-text name if not in the DB */
  productId?: string;
  productNameFreeText?: string;
  requestedBy: string; // userId
  requesterTrustScore: number;
  note?: string;
  status: MissingProductStatus;
  reviewNote?: string;
  reviewedBy?: string;
  createdAt: string;
  resolvedAt?: string | null;
}

/**
 * Immutable audit trail. Every catalog change (price update, promo, correction)
 * adds one entry here. Never deleted.
 */
export interface CatalogAuditEntry {
  id: string;
  catalogProductId: string;
  storeId: string;
  productId: string;
  changedBy: string; // userId
  reason: CatalogChangeReason;
  relatedReportId?: string | null;
  previousPriceLbp: number;
  newPriceLbp: number;
  note?: string;
  createdAt: string;
}
