export type UserRole = 'shopper' | 'retailer' | 'admin';
export type PriceStatus = 'pending' | 'verified' | 'flagged';
export type FeedbackType = 'wrong_price' | 'wrong_store' | 'outdated' | 'fake_receipt' | 'general';
export type NotifType = 'price_verified' | 'price_flagged' | 'price_alert' | 'trust_earned' | 'feedback_received';
export type AuditAction = 'approved' | 'rejected' | 'warned' | 'banned' | 'edited' | 'merged';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  trustScore: number;
  uploadCount: number;
  verifiedCount: number;
  avatarInitials: string;
  joinedAt: string;
  status: 'active' | 'warned' | 'suspended' | 'banned';
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  unit: string;
  barcode: string | null;
  aliases: string[];
  uploadCount: number;
  isArchived: boolean;
}

export type PowerStatus = 'stable' | 'unstable' | 'reported_warm';

export interface Store {
  id: string;
  name: string;
  chain: string | null;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  isVerifiedRetailer: boolean;
  ownerId: string | null;
  trustScore: number;
  status: 'pending' | 'verified' | 'flagged';
  region: string;
  internalRateLbp?: number; // Store's own USD->LBP rate
  powerStatus?: PowerStatus;
}

export interface PriceEntry {
  id: string;
  productId: string;
  storeId: string;
  priceLbp: number;
  status: PriceStatus;
  submittedBy: string;
  submitterTrustScore: number;
  receiptImageUrl: string | null;
  isPromotion: boolean;
  promoEndsAt: string | null;
  createdAt: string;
  verifiedAt: string | null;
  verifiedBy: string | null;
  upvotes: number;
  downvotes: number;
  product?: Product;
  store?: Store;
  submitter?: Pick<User, 'id' | 'name' | 'trustScore' | 'avatarInitials'>;
}

export interface Feedback {
  id: string;
  priceEntryId: string;
  submittedBy: string;
  type: FeedbackType;
  note: string | null;
  status: 'open' | 'reviewed' | 'resolved';
  createdAt: string;
  priceEntry?: PriceEntry;
  submitter?: Pick<User, 'id' | 'name' | 'avatarInitials'>;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotifType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedPriceEntryId: string | null;
}

export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  thresholdLbp: number;
  regions: string[];
  verifiedOnly: boolean;
  isActive: boolean;
  createdAt: string;
  product?: Product;
}

export interface Promotion {
  id: string;
  storeId: string;
  productId: string;
  discountPercent: number;
  originalPriceLbp: number;
  promoPriceLbp: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  store?: Store;
  product?: Product;
}

export interface AuditLog {
  id: string;
  performedBy: string;
  action: AuditAction;
  targetUserId: string | null;
  targetPriceEntryId: string | null;
  targetProductId: string | null;
  note: string | null;
  createdAt: string;
  performer?: Pick<User, 'id' | 'name' | 'avatarInitials'>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── New Features ─────────────────────────────────────────────────────────────

// ─── Exchange Rate ───────────────────────────────────────────
export interface ExchangeRate {
  rateLbpPerUsd: number;
  lastUpdated: string;
  source: string;
}

// ─── Cart ────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface CartStoreComparison {
  store: Store;
  totalLbp: number;
  totalUsd: number;
  itemsFound: number;
  itemsTotal: number;
  coverage: number; // 0–1 percentage
  missingItems: string[]; // product names not found at this store
}

// ─── Fuel ────────────────────────────────────────────────────
export type FuelType = 'gasoline_95' | 'gasoline_98' | 'diesel';

export interface FuelPrice {
  id: string;
  fuelType: FuelType;
  officialPriceLbp: number;   // per 20L — government official
  reportedPriceLbp?: number;  // what stations actually charge
  effectiveFrom: string;
  effectiveTo: string;
  source: string;
}

export interface StationReport {
  id: string;
  storeId: string;
  fuelType: FuelType;
  isOpen: boolean;
  hasStock: boolean;
  queueMinutes?: number;
  queueDepth?: number;   // number of cars
  isRationed: boolean;
  limitAmountLbp?: number;
  confirmedBy: string[];  // array of userIds who confirmed this
  reportedBy: string;
  createdAt: string;
  store?: Store;
}

// ─── Approval Workflow ────────────────────────────────────────
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRequest {
  id: string;
  requestedBy: string;                    // userId
  action: string;                          // e.g. 'account:delete', 'bulk:delete'
  label: string;                           // human-readable action name
  payload: Record<string, unknown>;       // data snapshot for diff view
  status: ApprovalStatus;
  reviewedBy: string | null;
  reviewNote: string | null;
  createdAt: string;
  resolvedAt: string | null;
  // Enriched (joined):
  requester?: Pick<User, 'id' | 'name' | 'avatarInitials' | 'trustScore' | 'role'>;
}

export interface GlobalAlert {
  id: string;
  type: 'stock_out' | 'safety' | 'news';
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
}

