export type UserRole = 'shopper' | 'retailer' | 'admin';
export type PriceStatus = 'pending' | 'verified' | 'flagged';
export type FeedbackType = 'wrong_price' | 'wrong_store' | 'outdated' | 'fake_receipt' | 'general';
export type NotifType = 'price_verified' | 'price_flagged' | 'price_alert' | 'trust_earned' | 'feedback_received';
export type AuditAction = 'approved' | 'rejected' | 'warned' | 'banned' | 'edited' | 'merged';
export type FuelType = 'gasoline_95' | 'gasoline_98' | 'diesel';

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

export interface GlobalAlert {
  id: string;
  type: 'stock_out' | 'safety' | 'news';
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
}

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
  trustLevel?: 'low' | 'medium' | 'high';
  notifications?: Notification[];
  alerts?: GlobalAlert[];
}

export interface Store {
  id: string;
  name: string;
  chain?: string | null;
  city: string;
  district?: string;
  region?: string;
  latitude: number;
  longitude: number;
  isVerifiedRetailer: boolean;
  ownerId: string | null;
  trustScore: number;
  status: 'verified' | 'pending' | 'flagged';
  internalRateLbp: number;
  powerStatus: 'stable' | 'unstable' | 'reported_warm';
  logoUrl?: string;
}

export interface Product {
  id: string;
  barcode: string | null;
  name: string;
  nameAr?: string;
  category: string;
  unit: string;
  aliases: string[];
  uploadCount: number;
  isArchived: boolean;
}

export interface PriceEntry {
  id: string;
  productId: string;
  storeId: string;
  priceLbp: number;
  status: PriceStatus;
  submittedBy?: string;
  submitterTrustScore?: number;
  source: 'official' | 'community';
  isDisputed?: boolean;
  disputeReason?: string;
  receiptImageUrl?: string | null;
  isPromotion?: boolean;
  promoEndsAt?: string | null;
  createdAt: string;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  upvotes?: number;
  downvotes?: number;
  submitter?: {
    id: string;
    name: string;
    trustScore: number;
    avatarInitials: string;
  };
  store?: Store;
  product?: Product;
}

export interface Feedback {
  id: string;
  priceEntryId: string;
  submittedBy: string;
  type: FeedbackType;
  note: string;
  status: 'open' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  performedBy: string;
  action: AuditAction;
  targetUserId: string | null;
  targetPriceEntryId: string | null;
  targetProductId: string | null;
  note: string;
  createdAt: string;
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
}

export interface FuelPrice {
  id: string;
  fuelType: FuelType;
  officialPriceLbp: number;
  reportedPriceLbp: number;
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
  queueMinutes: number;
  queueDepth: number;
  isRationed: boolean;
  limitAmountLbp?: number;
  confirmedBy: string[];
  reportedBy: string;
  createdAt: string;
}

// ─── Approval Queue ────────────────────────────────────────────────────────────
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalRequest {
  id: string;
  requestedBy: string;
  action: string;
  label: string;
  payload: Record<string, unknown>;
  status: ApprovalStatus;
  reviewedBy: string | null;
  reviewNote: string | null;
  createdAt: string;
  resolvedAt: string | null;
  // Enriched at runtime
  requester?: {
    id: string;
    name: string;
    avatarInitials: string;
    trustScore: number;
    role: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}