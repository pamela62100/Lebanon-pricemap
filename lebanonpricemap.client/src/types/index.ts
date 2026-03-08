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
  aliases: string[];
  uploadCount: number;
  isArchived: boolean;
}

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
