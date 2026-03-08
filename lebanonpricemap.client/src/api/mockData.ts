import type { User, Product, Store, PriceEntry, Feedback, Notification, AuditLog, Promotion } from '@/types';

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Layla Khoury",  email: "layla@test.com",  role: "shopper",  city: "Beirut",  trustScore: 87, uploadCount: 34, verifiedCount: 28, avatarInitials: "LK", joinedAt: "2024-01-15", status: "active" },
  { id: "u2", name: "Habib Nassar",  email: "habib@test.com",  role: "retailer", city: "Beirut",  trustScore: 92, uploadCount: 0,  verifiedCount: 0,  avatarInitials: "HN", joinedAt: "2024-02-01", status: "active" },
  { id: "u3", name: "Rima Karam",    email: "rima@test.com",   role: "shopper",  city: "Tripoli", trustScore: 61, uploadCount: 12, verifiedCount: 8,  avatarInitials: "RK", joinedAt: "2024-03-10", status: "active" },
  { id: "u4", name: "Admin User",    email: "admin@rakis.app", role: "admin",    city: "Beirut",  trustScore: 100,uploadCount: 0,  verifiedCount: 0,  avatarInitials: "AU", joinedAt: "2023-12-01", status: "active" },
  { id: "u5", name: "Fouad Gemayel", email: "fouad@test.com",  role: "shopper",  city: "Jounieh", trustScore: 23, uploadCount: 5,  verifiedCount: 1,  avatarInitials: "FG", joinedAt: "2024-05-20", status: "warned" },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Whole Milk TL 1L",      nameAr: "حليب كامل الدسم", category: "Dairy",  unit: "1L",    aliases: ["Milk TL 1L", "WholeMilk"],   uploadCount: 156, isArchived: false },
  { id: "p2", name: "Olive Oil Extra 750ml",  nameAr: "زيت زيتون",       category: "Oil",    unit: "750ml", aliases: ["Olive Oil 750"],              uploadCount: 98,  isArchived: false },
  { id: "p3", name: "Egyptian White Rice 5kg",nameAr: "أرز أبيض مصري",   category: "Grains", unit: "5kg",   aliases: ["Rice 5kg", "White Rice"],     uploadCount: 74,  isArchived: false },
  { id: "p4", name: "Sunflower Oil 1.5L",     nameAr: "زيت عباد الشمس",  category: "Oil",    unit: "1.5L",  aliases: ["Sunflower Oil"],              uploadCount: 55,  isArchived: false },
  { id: "p5", name: "Gasoline 95 Octane",     nameAr: "بنزين 95",        category: "Fuel",   unit: "per L", aliases: ["Benzine 95", "Gas 95"],       uploadCount: 210, isArchived: false },
  { id: "p6", name: "Premium Lentils 1kg",    nameAr: "عدس ممتاز",       category: "Grains", unit: "1kg",   aliases: ["Lentils 1kg"],               uploadCount: 42,  isArchived: false },
];

export const MOCK_STORES: Store[] = [
  { id: "s1", name: "Spinneys Achrafieh",  chain: "Spinneys", city: "Beirut", district: "Achrafieh",  latitude: 33.8886, longitude: 35.5160, isVerifiedRetailer: true,  ownerId: null, trustScore: 95, status: 'verified', region: 'Beirut' },
  { id: "s2", name: "Charcutier Aoun",     chain: null,       city: "Beirut", district: "Fassouh",    latitude: 33.8920, longitude: 35.5210, isVerifiedRetailer: false, ownerId: null, trustScore: 78, status: 'verified', region: 'Beirut' },
  { id: "s3", name: "Habib Market",        chain: null,       city: "Beirut", district: "Hamra",      latitude: 33.8950, longitude: 35.4850, isVerifiedRetailer: true,  ownerId: "u2", trustScore: 92, status: 'verified', region: 'Beirut' },
  { id: "s4", name: "Happy Supermarket",   chain: "Happy",    city: "Beirut", district: "Achrafieh",  latitude: 33.8870, longitude: 35.5140, isVerifiedRetailer: true,  ownerId: null, trustScore: 88, status: 'verified', region: 'Beirut' },
  { id: "s5", name: "Fadi Fruit Market",   chain: null,       city: "Beirut", district: "Mar Mkhael", latitude: 33.8840, longitude: 35.5120, isVerifiedRetailer: false, ownerId: null, trustScore: 45, status: 'pending', region: 'Beirut' },
];

export const MOCK_PRICE_ENTRIES: PriceEntry[] = [
  { id: "pe1", productId: "p1", storeId: "s4", priceLbp: 132000, status: "verified", submittedBy: "u1", submitterTrustScore: 87, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-06T08:00:00Z", verifiedAt: "2025-03-06T10:00:00Z", verifiedBy: "u4", upvotes: 12, downvotes: 0 },
  { id: "pe2", productId: "p1", storeId: "s2", priceLbp: 138500, status: "verified", submittedBy: "u3", submitterTrustScore: 61, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-05T14:00:00Z", verifiedAt: "2025-03-05T16:00:00Z", verifiedBy: "u4", upvotes: 8, downvotes: 1 },
  { id: "pe3", productId: "p1", storeId: "s1", priceLbp: 125000, status: "verified", submittedBy: "u1", submitterTrustScore: 87, receiptImageUrl: null, isPromotion: true,  promoEndsAt: "2025-03-15T00:00:00Z", createdAt: "2025-03-06T06:00:00Z", verifiedAt: "2025-03-06T07:00:00Z", verifiedBy: "u4", upvotes: 25, downvotes: 0 },
  { id: "pe4", productId: "p2", storeId: "s3", priceLbp: 185000, status: "verified", submittedBy: "u2", submitterTrustScore: 92, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T09:00:00Z", verifiedAt: "2025-03-07T09:30:00Z", verifiedBy: "u4", upvotes: 5, downvotes: 0 },
  { id: "pe5", productId: "p1", storeId: "s5", priceLbp: 142000, status: "pending",  submittedBy: "u5", submitterTrustScore: 23, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T11:00:00Z", verifiedAt: null, verifiedBy: null, upvotes: 2, downvotes: 1 },
  { id: "pe6", productId: "p3", storeId: "s3", priceLbp: 425000, status: "verified", submittedBy: "u2", submitterTrustScore: 92, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T09:00:00Z", verifiedAt: "2025-03-07T09:30:00Z", verifiedBy: "u4", upvotes: 10, downvotes: 0 },
  { id: "pe7", productId: "p4", storeId: "s1", priceLbp: 210000, status: "verified", submittedBy: "u3", submitterTrustScore: 61, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-04T15:00:00Z", verifiedAt: "2025-03-04T17:00:00Z", verifiedBy: "u4", upvotes: 15, downvotes: 0 },
  { id: "pe8", productId: "p5", storeId: "s4", priceLbp: 892000, status: "flagged",  submittedBy: "u5", submitterTrustScore: 23, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T12:00:00Z", verifiedAt: null, verifiedBy: null, upvotes: 0, downvotes: 12 },
];

export const MOCK_FEEDBACK: Feedback[] = [
  { id: "fb1", priceEntryId: "pe2", submittedBy: "u1", type: "outdated",    note: "Checked today — it's LBP 145,000 now", status: "open",     createdAt: "2025-03-07T07:00:00Z" },
  { id: "fb2", priceEntryId: "pe5", submittedBy: "u3", type: "wrong_price", note: "Receipt image doesn't match the price",  status: "reviewed", createdAt: "2025-03-07T10:00:00Z" },
  { id: "fb3", priceEntryId: "pe3", submittedBy: "u5", type: "general",     note: "Great deal, confirmed it myself!",       status: "resolved", createdAt: "2025-03-06T12:00:00Z" },
  { id: "fb4", priceEntryId: "pe8", submittedBy: "u1", type: "fake_receipt", note: "This looks like an edited screenshot",   status: "open",     createdAt: "2025-03-07T13:00:00Z" },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "u1", type: "price_verified", title: "Receipt Verified ✓",    message: "Your Spinneys receipt was verified by the community",   isRead: false, createdAt: "2025-03-07T10:00:00Z", relatedPriceEntryId: "pe3" },
  { id: "n2", userId: "u1", type: "trust_earned",   title: "Trust Point Earned 🌟", message: "You earned +5 trust for a confirmed upload",             isRead: false, createdAt: "2025-03-06T08:30:00Z", relatedPriceEntryId: "pe1" },
  { id: "n3", userId: "u1", type: "price_alert",    title: "Price Drop Alert 📉",   message: "Whole Milk TL 1L dropped to LBP 125,000 near Achrafieh", isRead: true,  createdAt: "2025-03-06T06:10:00Z", relatedPriceEntryId: "pe3" },
  { id: "n4", userId: "u3", type: "price_flagged",  title: "Submission Flagged ⚠️",  message: "Your Charcutier Aoun submission needs review",           isRead: false, createdAt: "2025-03-07T11:30:00Z", relatedPriceEntryId: "pe5" },
];

export const MOCK_PROMOTIONS: Promotion[] = [
  { id: "pr1", storeId: "s3", productId: "p1", discountPercent: 10, originalPriceLbp: 138000, promoPriceLbp: 125000, startsAt: "2025-03-06T00:00:00Z", endsAt: "2025-03-15T00:00:00Z", isActive: true },
  { id: "pr2", storeId: "s3", productId: "p2", discountPercent: 15, originalPriceLbp: 210000, promoPriceLbp: 185000, startsAt: "2025-03-01T00:00:00Z", endsAt: "2025-03-20T00:00:00Z", isActive: true },
  { id: "pr3", storeId: "s3", productId: "p6", discountPercent: 20, originalPriceLbp: 95000,  promoPriceLbp: 76000,  startsAt: "2025-02-15T00:00:00Z", endsAt: "2025-03-01T00:00:00Z", isActive: false },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: "al1", performedBy: "u4", action: "approved", targetUserId: null, targetPriceEntryId: "pe3", targetProductId: null, note: "Verified against uploaded receipt",              createdAt: "2025-03-07T09:30:00Z" },
  { id: "al2", performedBy: "u4", action: "warned",   targetUserId: "u5", targetPriceEntryId: null,  targetProductId: null, note: "Third suspicious submission this week",           createdAt: "2025-03-07T11:00:00Z" },
  { id: "al3", performedBy: "u4", action: "merged",   targetUserId: null, targetPriceEntryId: null,  targetProductId: "p1", note: "Merged 'Milk TL 1L' and 'WholeMilk' into canonical product", createdAt: "2025-03-06T14:00:00Z" },
  { id: "al4", performedBy: "u4", action: "rejected", targetUserId: null, targetPriceEntryId: "pe5", targetProductId: null, note: "Receipt image unreadable",                       createdAt: "2025-03-07T10:00:00Z" },
  { id: "al5", performedBy: "u4", action: "banned",   targetUserId: "u5", targetPriceEntryId: null,  targetProductId: null, note: "Repeated fake submissions after multiple warnings", createdAt: "2025-03-07T14:00:00Z" },
];

// Helper to join mock data (simulating API joins)
export function getEnrichedPriceEntries(): PriceEntry[] {
  return MOCK_PRICE_ENTRIES.map(pe => ({
    ...pe,
    product: MOCK_PRODUCTS.find(p => p.id === pe.productId),
    store: MOCK_STORES.find(s => s.id === pe.storeId),
    submitter: (() => {
      const u = MOCK_USERS.find(u => u.id === pe.submittedBy);
      return u ? { id: u.id, name: u.name, trustScore: u.trustScore, avatarInitials: u.avatarInitials } : undefined;
    })(),
  }));
}

export function getEnrichedFeedback(): Feedback[] {
  return MOCK_FEEDBACK.map(fb => ({
    ...fb,
    priceEntry: MOCK_PRICE_ENTRIES.find(pe => pe.id === fb.priceEntryId),
    submitter: (() => {
      const u = MOCK_USERS.find(u => u.id === fb.submittedBy);
      return u ? { id: u.id, name: u.name, avatarInitials: u.avatarInitials } : undefined;
    })(),
  }));
}

export function getEnrichedAuditLogs(): AuditLog[] {
  return MOCK_AUDIT_LOGS.map(al => ({
    ...al,
    performer: (() => {
      const u = MOCK_USERS.find(u => u.id === al.performedBy);
      return u ? { id: u.id, name: u.name, avatarInitials: u.avatarInitials } : undefined;
    })(),
  }));
}

export function getEnrichedPromotions(): Promotion[] {
  return MOCK_PROMOTIONS.map(pr => ({
    ...pr,
    store: MOCK_STORES.find(s => s.id === pr.storeId),
    product: MOCK_PRODUCTS.find(p => p.id === pr.productId),
  }));
}
export function getEnrichedNotifications(): Notification[] {
  return MOCK_NOTIFICATIONS.map(n => ({
    ...n,
    relatedPriceEntry: MOCK_PRICE_ENTRIES.find(pe => pe.id === n.relatedPriceEntryId)
  }));
}

export function getEnrichedStores(): Store[] {
  return MOCK_STORES;
}

export function getEnrichedProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function getEnrichedUsers(): User[] {
  return MOCK_USERS;
}
