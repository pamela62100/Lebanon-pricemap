export type UserRole = 'shopper' | 'retailer' | 'admin';
export type PriceStatus = 'pending' | 'verified' | 'flagged';
export type FeedbackType = 'wrong_price' | 'wrong_store' | 'outdated' | 'fake_receipt' | 'general';
export type NotifType = 'price_verified' | 'price_flagged' | 'price_alert' | 'trust_earned' | 'feedback_received';
export type AuditAction = 'approved' | 'rejected' | 'warned' | 'banned' | 'edited' | 'merged';
export type FuelType = 'gasoline_95' | 'gasoline_98' | 'diesel'; // ← ADD

export interface Notification {
  id: number;
  userId: string;
  type: NotifType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedPriceEntryId: string | null;
}

export interface GlobalAlert {
  id: number;
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
  notifications?: Notification[];
  alerts?: GlobalAlert[];
}

export interface Store {
  id: string;
  name: string;
  district?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  internalRateLbp?: number;
  powerStatus?: 'stable' | 'unstable';
  trustScore?: number;        // ← ADD
  status?: 'verified' | 'pending' | 'flagged';  // ← ADD
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string;           // ← ADD
  category?: string;
  unit?: string;             // ← ADD
}

export interface PriceEntry {
  id: string;
  productId: string;
  storeId: string;
  priceLbp: number;
  status: PriceStatus;
  createdAt: string;
  submittedBy?: string;      // ← ADD
  isPromotion?: boolean;     // ← ADD
  upvotes?: number;          // ← ADD
  store?: Store;
  product?: Product;
}