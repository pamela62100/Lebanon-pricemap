import type { User, Product, Store, PriceEntry, Feedback, Notification, AuditLog, Promotion, FuelPrice, StationReport, GlobalAlert } from '@/types';

// ─── Users ───────────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: "u1", name: "Layla Khoury",   email: "layla@test.com",   role: "shopper",  city: "Beirut",  trustScore: 91, trustLevel: 'high',   uploadCount: 42, verifiedCount: 38, avatarInitials: "LK", joinedAt: "2024-01-15", status: "active" },
  { id: "u2", name: "Rima Karam",     email: "rima@test.com",    role: "shopper",  city: "Tripoli", trustScore: 67, trustLevel: 'medium', uploadCount: 18, verifiedCount: 11, avatarInitials: "RK", joinedAt: "2024-03-10", status: "active" },
  { id: "u3", name: "Fouad Gemayel",  email: "fouad@test.com",   role: "shopper",  city: "Jounieh", trustScore: 25, trustLevel: 'low',    uploadCount: 6,  verifiedCount: 1,  avatarInitials: "FG", joinedAt: "2024-05-20", status: "warned" },
  { id: "u4", name: "Habib Nassar",   email: "habib@test.com",   role: "retailer", city: "Beirut",  trustScore: 92, trustLevel: 'high',   uploadCount: 0,  verifiedCount: 0,  avatarInitials: "HN", joinedAt: "2024-02-01", status: "active" },
  { id: "u5", name: "Admin User",     email: "admin@wein.app",   role: "admin",    city: "Beirut",  trustScore: 100, trustLevel: 'high',  uploadCount: 0, verifiedCount: 0,  avatarInitials: "AU", joinedAt: "2023-12-01", status: "active" },
];

// ─── Products ─────────────────────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  { id: "p1",  barcode: "6221012345001", name: "Whole Milk TL 1L",        nameAr: "حليب كامل الدسم ١ لتر",  category: "Dairy",    unit: "1L",     aliases: ["Milk TL 1L", "WholeMilk"],       uploadCount: 189, isArchived: false },
  { id: "p2",  barcode: "6221087654321", name: "Eggs 30 Pack",             nameAr: "بيض ٣٠ حبة",              category: "Dairy",    unit: "30 pcs", aliases: ["Eggs", "بيض"],                   uploadCount: 211, isArchived: false },
  { id: "p3",  barcode: "6221099887766", name: "Bread Standard Loaf",      nameAr: "خبز عربي رغيف",           category: "Bakery",   unit: "loaf",   aliases: ["Khobz", "Bread", "عيش"],         uploadCount: 302, isArchived: false },
  { id: "p4",  barcode: "6221055443322", name: "Olive Oil Extra 750ml",    nameAr: "زيت زيتون ممتاز ٧٥٠مل",  category: "Oil",      unit: "750ml",  aliases: ["Olive Oil 750", "زيت زيتون"],     uploadCount: 143, isArchived: false },
  { id: "p5",  barcode: "6221011223344", name: "Diesel Fuel per Liter",    nameAr: "ديزل لكل لتر",            category: "Fuel",     unit: "per L",  aliases: ["Mazout", "Diesel", "مازوت"],      uploadCount: 421, isArchived: false },
  { id: "p6",  barcode: "6221066778899", name: "Gasoline 95 Octane",       nameAr: "بنزين ٩٥ أوكتان",         category: "Fuel",     unit: "per L",  aliases: ["Benzine 95", "Gas 95", "بنزين"], uploadCount: 388, isArchived: false },
  { id: "p7",  barcode: "6221012345007", name: "Chicken per kg",           nameAr: "دجاج كيلو",               category: "Meat",     unit: "kg",     aliases: ["Chicken", "Djej", "دجاج"],        uploadCount: 167, isArchived: false },
  { id: "p8",  barcode: "6221012345008", name: "Egyptian White Rice 5kg",  nameAr: "أرز أبيض مصري ٥ كيلو",   category: "Grains",   unit: "5kg",    aliases: ["Rice 5kg", "أرز"],               uploadCount: 98,  isArchived: false },
  { id: "p9",  barcode: "6221012345009", name: "Water Bottle 1.5L",        nameAr: "مياه معبأة ١.٥ لتر",      category: "Beverages",unit: "1.5L",   aliases: ["Water", "Maye", "مياه"],          uploadCount: 275, isArchived: false },
  { id: "p10", barcode: null,            name: "Lemon per kg",             nameAr: "ليمون كيلو",              category: "Produce",  unit: "kg",     aliases: ["Lemon", "Laymoun", "ليمون"],     uploadCount: 84,  isArchived: false },
];

// ─── Stores ───────────────────────────────────────────────────────────────────
export const MOCK_STORES: Store[] = [
  { id: "s1", name: "Spinneys Achrafieh",          chain: "Spinneys", city: "Beirut", district: "Achrafieh",  latitude: 33.8886, longitude: 35.5160, isVerifiedRetailer: true,  ownerId: null, trustScore: 96, status: "verified", region: "Beirut", internalRateLbp: 91500, powerStatus: 'stable', logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Spinneys_logo.svg/1200px-Spinneys_logo.svg.png" },
  { id: "s2", name: "Charcutier Aoun Fassouh",     chain: null,       city: "Beirut", district: "Fassouh",    latitude: 33.8920, longitude: 35.5210, isVerifiedRetailer: false, ownerId: null, trustScore: 82, status: "verified", region: "Beirut", internalRateLbp: 89500, powerStatus: 'unstable' },
  { id: "s3", name: "Happy Supermarket Mar Mkhael",chain: "Happy",    city: "Beirut", district: "Mar Mkhael", latitude: 33.8840, longitude: 35.5130, isVerifiedRetailer: true,  ownerId: null, trustScore: 89, status: "verified", region: "Beirut", internalRateLbp: 92500, powerStatus: 'reported_warm', logoUrl: "https://happy.com.lb/logo.png" },
  { id: "s4", name: "Bou Khalil Hamra",            chain: "Bou Khalil",city: "Beirut",district: "Hamra",      latitude: 33.8950, longitude: 35.4850, isVerifiedRetailer: true,  ownerId: null, trustScore: 91, status: "verified", region: "Beirut", internalRateLbp: 90000, powerStatus: 'stable', logoUrl: "https://boukhalil.com/logo.png" },
  { id: "s5", name: "TSC Dbayeh",                  chain: "TSC",      city: "Dbayeh", district: "Dbayeh",     latitude: 33.9370, longitude: 35.5950, isVerifiedRetailer: true,  ownerId: null, trustScore: 94, status: "verified", region: "Metn",   internalRateLbp: 93000, powerStatus: 'stable', logoUrl: "https://tsc.com.lb/logo.png" },
  { id: "s6", name: "Carrefour Dora",              chain: "Carrefour",city: "Beirut", district: "Dora",       latitude: 33.9020, longitude: 35.5750, isVerifiedRetailer: true,  ownerId: null, trustScore: 97, status: "verified", region: "Beirut", internalRateLbp: 89600, powerStatus: 'stable', logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Carrefour_logo.svg/1200px-Carrefour_logo.svg.png" },
  { id: "s7", name: "Habib Market Gemmayzeh",      chain: null,       city: "Beirut", district: "Gemmayzeh",  latitude: 33.8900, longitude: 35.5180, isVerifiedRetailer: true,  ownerId: "u4", trustScore: 92, status: "verified", region: "Beirut", internalRateLbp: 89500, powerStatus: 'stable', logoUrl: "https://habibmarket.com/logo.png" },
];

// ─── Price Entries ────────────────────────────────────────────────────────────
// 1 USD ≈ 89,500 LBP. Realistic price spread across stores is the core feature.
export const MOCK_PRICE_ENTRIES: PriceEntry[] = [
  // Whole Milk TL 1L — noticeable spread across stores
  { id: "pe1",  productId: "p1", storeId: "s1", priceLbp: 128000, status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T08:00:00Z", verifiedAt: "2025-03-07T10:00:00Z", verifiedBy: "u5", upvotes: 14, downvotes: 0 },
  { id: "pe2",  productId: "p1", storeId: "s2", priceLbp: 141000, status: "verified", source: "community", submittedBy: "u2", submitterTrustScore: 67, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-06T14:00:00Z", verifiedAt: "2025-03-06T15:00:00Z", verifiedBy: "u5", upvotes: 9,  downvotes: 1, isDisputed: true, disputeReason: "Wrong price reported by owner" },
  { id: "pe3",  productId: "p1", storeId: "s4", priceLbp: 125000, status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: true,  promoEndsAt: "2025-03-20T00:00:00Z", createdAt: "2025-03-07T06:00:00Z", verifiedAt: "2025-03-07T07:00:00Z", verifiedBy: "u5", upvotes: 22, downvotes: 0 },
  { id: "pe4",  productId: "p1", storeId: "s6", priceLbp: 132000, status: "pending",  source: "community", submittedBy: "u3", submitterTrustScore: 25, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T11:00:00Z", verifiedAt: null, verifiedBy: null, upvotes: 2, downvotes: 0 },

  // Eggs 30 Pack — big spread (35% gap between cheapest and most expensive)
  { id: "pe5",  productId: "p2", storeId: "s5", priceLbp: 395000, status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-05T09:00:00Z", verifiedAt: "2025-03-05T10:00:00Z", verifiedBy: "u5", upvotes: 18, downvotes: 0 },
  { id: "pe6",  productId: "p2", storeId: "s3", priceLbp: 430000, status: "verified", source: "community", submittedBy: "u2", submitterTrustScore: 67, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-06T08:30:00Z", verifiedAt: "2025-03-06T09:00:00Z", verifiedBy: "u5", upvotes: 7,  downvotes: 0 },
  { id: "pe7",  productId: "p2", storeId: "s2", priceLbp: 535000, status: "flagged",  source: "community", submittedBy: "u3", submitterTrustScore: 25, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T12:00:00Z", verifiedAt: null, verifiedBy: null, upvotes: 0, downvotes: 9 },

  // Bread — tight spread, commodity pricing
  { id: "pe8",  productId: "p3", storeId: "s1", priceLbp: 89000,  status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-04T07:00:00Z", verifiedAt: "2025-03-04T08:00:00Z", verifiedBy: "u5", upvotes: 31, downvotes: 0 },
  { id: "pe9",  productId: "p3", storeId: "s7", priceLbp: 82000,  status: "verified", source: "official",  submittedBy: "u4", submitterTrustScore: 92, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T07:30:00Z", verifiedAt: "2025-03-07T08:00:00Z", verifiedBy: "u5", upvotes: 24, downvotes: 0 },
  { id: "pe10", productId: "p3", storeId: "s3", priceLbp: 95000,  status: "verified", source: "community", submittedBy: "u2", submitterTrustScore: 67, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-06T12:00:00Z", verifiedAt: "2025-03-06T13:00:00Z", verifiedBy: "u5", upvotes: 11, downvotes: 1 },

  // Olive Oil — luxury item, big spread
  { id: "pe11", productId: "p4", storeId: "s7", priceLbp: 458000, status: "verified", source: "official",  submittedBy: "u4", submitterTrustScore: 92, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T09:00:00Z", verifiedAt: "2025-03-07T09:30:00Z", verifiedBy: "u5", upvotes: 8,  downvotes: 0 },
  { id: "pe12", productId: "p4", storeId: "s1", priceLbp: 612000, status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-05T11:00:00Z", verifiedAt: "2025-03-05T12:00:00Z", verifiedBy: "u5", upvotes: 5,  downvotes: 0 },

  // Diesel — fuel, tightly regulated but varies slightly
  { id: "pe13", productId: "p5", storeId: "s5", priceLbp: 112000, status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T06:00:00Z", verifiedAt: "2025-03-07T06:30:00Z", verifiedBy: "u5", upvotes: 19, downvotes: 0 },
  { id: "pe14", productId: "p5", storeId: "s6", priceLbp: 116000, status: "verified", source: "community", submittedBy: "u2", submitterTrustScore: 67, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T07:00:00Z", verifiedAt: "2025-03-07T07:30:00Z", verifiedBy: "u5", upvotes: 12, downvotes: 0 },

  // Gasoline 95
  { id: "pe15", productId: "p6", storeId: "s5", priceLbp: 121000, status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T06:00:00Z", verifiedAt: "2025-03-07T06:30:00Z", verifiedBy: "u5", upvotes: 16, downvotes: 0 },
  { id: "pe16", productId: "p6", storeId: "s6", priceLbp: 126000, status: "pending",  source: "community", submittedBy: "u2", submitterTrustScore: 67, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T08:00:00Z", verifiedAt: null, verifiedBy: null, upvotes: 3, downvotes: 0 },

  // Chicken per kg — high variance, key consumer product
  { id: "pe17", productId: "p7", storeId: "s4", priceLbp: 385000, status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-06T10:00:00Z", verifiedAt: "2025-03-06T11:00:00Z", verifiedBy: "u5", upvotes: 21, downvotes: 0 },
  { id: "pe18", productId: "p7", storeId: "s3", priceLbp: 420000, status: "verified", source: "community", submittedBy: "u2", submitterTrustScore: 67, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-05T14:00:00Z", verifiedAt: "2025-03-05T15:00:00Z", verifiedBy: "u5", upvotes: 9,  downvotes: 1 },
  { id: "pe19", productId: "p7", storeId: "s1", priceLbp: 465000, status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-04T09:00:00Z", verifiedAt: "2025-03-04T10:00:00Z", verifiedBy: "u5", upvotes: 6,  downvotes: 2 },

  // Rice 5kg — older entries to trigger "Is this still correct?"
  { id: "pe20", productId: "p8", storeId: "s7", priceLbp: 410000, status: "verified", source: "official",  submittedBy: "u4", submitterTrustScore: 92, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-01T09:00:00Z", verifiedAt: "2025-03-01T09:30:00Z", verifiedBy: "u5", upvotes: 28, downvotes: 0 },
  { id: "pe21", productId: "p8", storeId: "s6", priceLbp: 448000, status: "verified", source: "community", submittedBy: "u2", submitterTrustScore: 67, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-02-28T14:00:00Z", verifiedAt: "2025-02-28T15:00:00Z", verifiedBy: "u5", upvotes: 15, downvotes: 3 },

  // Water bottle 1.5L
  { id: "pe22", productId: "p9", storeId: "s2", priceLbp: 52000,  status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T09:00:00Z", verifiedAt: "2025-03-07T09:30:00Z", verifiedBy: "u5", upvotes: 12, downvotes: 0 },
  { id: "pe23", productId: "p9", storeId: "s5", priceLbp: 45000,  status: "verified", source: "community", submittedBy: "u1", submitterTrustScore: 91, receiptImageUrl: null, isPromotion: true,  promoEndsAt: "2025-03-18T00:00:00Z", createdAt: "2025-03-07T07:00:00Z", verifiedAt: "2025-03-07T07:30:00Z", verifiedBy: "u5", upvotes: 33, downvotes: 0 },
  { id: "pe24", productId: "p9", storeId: "s1", priceLbp: 68000,  status: "verified", source: "community", submittedBy: "u2", submitterTrustScore: 67, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-05T10:00:00Z", verifiedAt: "2025-03-05T11:00:00Z", verifiedBy: "u5", upvotes: 8,  downvotes: 1 },

  // Lemon per kg — seasonal, high variance
  { id: "pe25", productId: "p10", storeId: "s7", priceLbp: 96000,  status: "verified", source: "official",  submittedBy: "u4", submitterTrustScore: 92, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T08:00:00Z", verifiedAt: "2025-03-07T08:30:00Z", verifiedBy: "u5", upvotes: 17, downvotes: 0 },
  { id: "pe26", productId: "p10", storeId: "s3", priceLbp: 145000, status: "pending",  source: "community", submittedBy: "u3", submitterTrustScore: 25, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-07T13:00:00Z", verifiedAt: null, verifiedBy: null, upvotes: 0, downvotes: 4, isDisputed: true, disputeReason: "Inflated price reported" },
  
  // Extra official entries for Spinneys (s1)
  { id: "pe27", productId: "p2", storeId: "s1", priceLbp: 415000, status: "verified", source: "official", submittedBy: "u5", submitterTrustScore: 100, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-08T09:00:00Z", verifiedAt: "2025-03-08T09:00:00Z", verifiedBy: "u5", upvotes: 5, downvotes: 0 },
  { id: "pe28", productId: "p4", storeId: "s1", priceLbp: 590000, status: "verified", source: "official", submittedBy: "u5", submitterTrustScore: 100, receiptImageUrl: null, isPromotion: false, promoEndsAt: null, createdAt: "2025-03-08T09:00:00Z", verifiedAt: "2025-03-08T09:00:00Z", verifiedBy: "u5", upvotes: 3, downvotes: 0 },
];

// ─── Feedback ─────────────────────────────────────────────────────────────────
export const MOCK_FEEDBACK: Feedback[] = [
  { id: "fb1", priceEntryId: "pe2",  submittedBy: "u1", type: "outdated",    note: "Checked today — it's LBP 148,000 now at Charcutier Aoun",  status: "open",     createdAt: "2025-03-07T07:00:00Z" },
  { id: "fb2", priceEntryId: "pe7",  submittedBy: "u2", type: "wrong_price", note: "535,000 is impossible for eggs, must be a mistake",         status: "reviewed", createdAt: "2025-03-07T13:00:00Z" },
  { id: "fb3", priceEntryId: "pe3",  submittedBy: "u3", type: "general",     note: "Confirmed the promo — Bou Khalil Hamra is definitely cheapest", status: "resolved", createdAt: "2025-03-07T08:00:00Z" },
  { id: "fb4", priceEntryId: "pe26", submittedBy: "u1", type: "wrong_price", note: "145,000 for lemons makes no sense — market rate is ~95,000", status: "open",     createdAt: "2025-03-07T14:00:00Z" },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "u1", type: "price_verified",  title: "Receipt Verified ✓",    message: "Your Spinneys submission for Whole Milk was verified",       isRead: false, createdAt: "2025-03-07T10:00:00Z", relatedPriceEntryId: "pe1"  },
  { id: "n2", userId: "u1", type: "trust_earned",    title: "Trust Point Earned 🌟", message: "You earned +5 trust for a confirmed upload at Bou Khalil",  isRead: false, createdAt: "2025-03-07T06:30:00Z", relatedPriceEntryId: "pe3"  },
  { id: "n3", userId: "u1", type: "price_alert",     title: "Price Drop Alert 📉",   message: "Water 1.5L dropped to LBP 45,000 at TSC Dbayeh — promo!",  isRead: true,  createdAt: "2025-03-07T07:10:00Z", relatedPriceEntryId: "pe23" },
  { id: "n4", userId: "u2", type: "price_flagged",   title: "Submission Flagged ⚠️",  message: "Your Eggs submission at Charcutier Aoun is under review",    isRead: false, createdAt: "2025-03-07T13:30:00Z", relatedPriceEntryId: "pe7"  },
  { id: "n5", userId: "u1", type: "price_alert",     title: "Price Drop Alert 📉",   message: "Whole Milk dropped to LBP 125,000 at Bou Khalil — promo!",  isRead: false, createdAt: "2025-03-07T06:05:00Z", relatedPriceEntryId: "pe3"  },
];

// ─── Promotions ───────────────────────────────────────────────────────────────
export const MOCK_PROMOTIONS: Promotion[] = [
  { id: "pr1", storeId: "s4", productId: "p1",  discountPercent: 12, originalPriceLbp: 142000, promoPriceLbp: 125000, startsAt: "2025-03-06T00:00:00Z", endsAt: "2025-03-20T00:00:00Z", isActive: true  },
  { id: "pr2", storeId: "s5", productId: "p9",  discountPercent: 18, originalPriceLbp: 55000,  promoPriceLbp: 45000,  startsAt: "2025-03-05T00:00:00Z", endsAt: "2025-03-18T00:00:00Z", isActive: true  },
  { id: "pr3", storeId: "s7", productId: "p4",  discountPercent: 10, originalPriceLbp: 510000, promoPriceLbp: 458000, startsAt: "2025-02-15T00:00:00Z", endsAt: "2025-03-01T00:00:00Z", isActive: false },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: "al1", performedBy: "u5", action: "approved", targetUserId: null, targetPriceEntryId: "pe1",  targetProductId: null, note: "Verified against uploaded receipt — Spinneys Achrafieh",       createdAt: "2025-03-07T10:00:00Z" },
  { id: "al2", performedBy: "u5", action: "rejected", targetUserId: null, targetPriceEntryId: "pe7",  targetProductId: null, note: "Eggs price of 535k is implausible — flagged for review",        createdAt: "2025-03-07T13:30:00Z" },
  { id: "al3", performedBy: "u5", action: "warned",   targetUserId: "u3", targetPriceEntryId: null,   targetProductId: null, note: "Third suspicious submission this week by Fouad G.",            createdAt: "2025-03-07T11:00:00Z" },
  { id: "al4", performedBy: "u5", action: "merged",   targetUserId: null, targetPriceEntryId: null,   targetProductId: "p1", note: "Merged 'Milk TL 1L' and 'WholeMilk' into canonical product",  createdAt: "2025-03-06T14:00:00Z" },
  { id: "al5", performedBy: "u5", action: "approved", targetUserId: null, targetPriceEntryId: "pe23", targetProductId: null, note: "TSC Dbayeh promo for Water confirmed via receipt scan",         createdAt: "2025-03-07T07:30:00Z" },
];

// ─── Enrichment helpers (simulate SQL JOINs) ──────────────────────────────────
export function getEnrichedPriceEntries(): PriceEntry[] {
  return MOCK_PRICE_ENTRIES.map(pe => ({
    ...pe,
    product: MOCK_PRODUCTS.find(p => p.id === pe.productId),
    store:   MOCK_STORES.find(s => s.id === pe.storeId),
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
    store:   MOCK_STORES.find(s => s.id === pr.storeId),
    product: MOCK_PRODUCTS.find(p => p.id === pr.productId),
  }));
}

export function getEnrichedNotifications(): Notification[] {
  return MOCK_NOTIFICATIONS.map(n => ({
    ...n,
    relatedPriceEntry: MOCK_PRICE_ENTRIES.find(pe => pe.id === n.relatedPriceEntryId),
  }));
}

export function getEnrichedStores(): Store[] { return MOCK_STORES; }
export function getEnrichedProducts(): Product[] { return MOCK_PRODUCTS; }
export function getEnrichedUsers(): User[] { return MOCK_USERS; }

// ─── Fuel Mock Data ───────────────────────────────────────────
export const MOCK_FUEL_PRICES: FuelPrice[] = [
  {
    id: "fp1",
    fuelType: "gasoline_95",
    officialPriceLbp: 894000,
    reportedPriceLbp: 910000,  // some stations overcharging
    effectiveFrom: "2025-03-06T00:00:00Z",
    effectiveTo: "2025-03-13T00:00:00Z",
    source: "Ministry of Energy Lebanon"
  },
  {
    id: "fp2",
    fuelType: "gasoline_98",
    officialPriceLbp: 952000,
    reportedPriceLbp: 952000,
    effectiveFrom: "2025-03-06T00:00:00Z",
    effectiveTo: "2025-03-13T00:00:00Z",
    source: "Ministry of Energy Lebanon"
  },
  {
    id: "fp3",
    fuelType: "diesel",
    officialPriceLbp: 756000,
    reportedPriceLbp: 756000,
    effectiveFrom: "2025-03-06T00:00:00Z",
    effectiveTo: "2025-03-13T00:00:00Z",
    source: "Ministry of Energy Lebanon"
  }
];

export const MOCK_STATION_REPORTS: StationReport[] = [
  {
    id: "sr1", storeId: "s1", fuelType: "gasoline_95",
    isOpen: true, hasStock: true, queueMinutes: 5, queueDepth: 2,
    isRationed: true, limitAmountLbp: 2000000,
    confirmedBy: ["u1", "u3", "u5"],
    reportedBy: "u1", createdAt: "2025-03-08T07:30:00Z"
  },
  {
    id: "sr2", storeId: "s2", fuelType: "gasoline_95",
    isOpen: false, hasStock: false, queueMinutes: 0, queueDepth: 0,
    isRationed: false,
    confirmedBy: ["u3"],
    reportedBy: "u3", createdAt: "2025-03-08T06:00:00Z"
  },
  {
    id: "sr3", storeId: "s4", fuelType: "diesel",
    isOpen: true, hasStock: true, queueMinutes: 20, queueDepth: 18,
    isRationed: true, limitAmountLbp: 1500000,
    confirmedBy: ["u1", "u2"],
    reportedBy: "u1", createdAt: "2025-03-08T08:00:00Z"
  },
  {
    id: "sr4", storeId: "s3", fuelType: "gasoline_95",
    isOpen: true, hasStock: false, queueMinutes: 0, queueDepth: 0,
    isRationed: false,
    confirmedBy: [],
    reportedBy: "u2", createdAt: "2025-03-08T05:00:00Z"
  }
];

// ─── Global Alerts ─────────────────────────────────────────────
export const MOCK_GLOBAL_ALERTS: GlobalAlert[] = [
  { 
    id: "ga1", 
    type: "stock_out", 
    message: "Warning: Bread is out of stock in 80% of Metn stores right now.", 
    severity: "high", 
    createdAt: new Date().toISOString() 
  },
  {
    id: "ga2",
    type: "news",
    message: "Ministry of Energy: Official fuel prices will be updated in 4 hours.",
    severity: "medium",
    createdAt: new Date().toISOString()
  }
];

export function getGlobalAlerts(): GlobalAlert[] { return MOCK_GLOBAL_ALERTS; }

// ─── Helper: join station reports with stores ─────────────────
export function getEnrichedStationReports(): StationReport[] {
  return MOCK_STATION_REPORTS.map(r => ({
    ...r,
    store: MOCK_STORES.find(s => s.id === r.storeId)
  }));
}
