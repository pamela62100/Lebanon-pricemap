import {
  MOCK_CATALOG_PRODUCTS,
  MOCK_DISCREPANCY_REPORTS,
  MOCK_MISSING_PRODUCT_REQUESTS,
  MOCK_CATALOG_AUDIT,
} from './mockCatalogData';
import type {
  CatalogProduct,
  PriceDiscrepancyReport,
  MissingProductRequest,
  CatalogAuditEntry,
  DiscrepancyType,
} from '@/types/catalog.types';

// In-memory mutable state (simulates a backend store)
let catalogProducts = [...MOCK_CATALOG_PRODUCTS];
let discrepancyReports = [...MOCK_DISCREPANCY_REPORTS];
let missingProductRequests = [...MOCK_MISSING_PRODUCT_REQUESTS];
let auditLog = [...MOCK_CATALOG_AUDIT];

// ─── Catalog API ──────────────────────────────────────────────────────────────
export const catalogApi = {
  /** Get all catalog products for a given store */
  getByStore(storeId: string): CatalogProduct[] {
    return catalogProducts.filter(cp => cp.storeId === storeId);
  },

  /** Update a catalog product's price or stock status */
  updateProduct(id: string, patch: Partial<CatalogProduct>): CatalogProduct | null {
    const idx = catalogProducts.findIndex(cp => cp.id === id);
    if (idx === -1) return null;
    catalogProducts[idx] = {
      ...catalogProducts[idx],
      ...patch,
      lastUpdatedAt: new Date().toISOString(),
    };
    return catalogProducts[idx];
  },

  /** Get the full audit trail for a single catalog product */
  getAuditLog(catalogProductId: string): CatalogAuditEntry[] {
    return auditLog.filter(e => e.catalogProductId === catalogProductId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /** Get all catalog products (for admin) */
  getAll(): CatalogProduct[] {
    return catalogProducts;
  },
};

// ─── Discrepancy Report API ───────────────────────────────────────────────────
export const discrepancyApi = {
  getAll(): PriceDiscrepancyReport[] {
    return [...discrepancyReports].sort(
      (a, b) => b.reporterTrustScore - a.reporterTrustScore // High trust first
    );
  },

  getPending(): PriceDiscrepancyReport[] {
    return discrepancyReports
      .filter(r => r.status === 'pending')
      .sort((a, b) => b.reporterTrustScore - a.reporterTrustScore);
  },

  getByStore(storeId: string): PriceDiscrepancyReport[] {
    return discrepancyReports.filter(r => r.storeId === storeId);
  },

  submit(report: Omit<PriceDiscrepancyReport, 'id' | 'status' | 'createdAt'>): PriceDiscrepancyReport {
    const newReport: PriceDiscrepancyReport = {
      ...report,
      id: `dr${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    discrepancyReports = [newReport, ...discrepancyReports];
    return newReport;
  },

  /** Admin approves: optionally updates catalog price */
  approve(id: string, reviewNote?: string, newPriceLbp?: number): boolean {
    const idx = discrepancyReports.findIndex(r => r.id === id);
    if (idx === -1) return false;

    const report = discrepancyReports[idx];
    discrepancyReports[idx] = {
      ...report,
      status: 'approved',
      reviewNote,
      approvedNewPriceLbp: newPriceLbp ?? report.observedPriceLbp,
      resolvedAt: new Date().toISOString(),
    };

    // Atomically update the catalog if a new price is provided
    if (newPriceLbp) {
      const cpIdx = catalogProducts.findIndex(cp => cp.id === report.catalogProductId);
      if (cpIdx !== -1) {
        const prev = catalogProducts[cpIdx];
        catalogProducts[cpIdx] = {
          ...prev,
          officialPriceLbp: newPriceLbp,
          lastUpdatedAt: new Date().toISOString(),
          lastUpdatedBy: 'u5', // admin
        };
        // Create audit entry
        auditLog = [{
          id: `ca${Date.now()}`,
          catalogProductId: report.catalogProductId,
          storeId: report.storeId,
          productId: report.productId,
          changedBy: 'u5',
          reason: 'discrepancy_approved',
          relatedReportId: id,
          previousPriceLbp: prev.officialPriceLbp,
          newPriceLbp: newPriceLbp,
          note: reviewNote,
          createdAt: new Date().toISOString(),
        }, ...auditLog];
      }
    }

    // Handle out_of_stock type
    if (report.reportType === 'out_of_stock') {
      const cpIdx = catalogProducts.findIndex(cp => cp.id === report.catalogProductId);
      if (cpIdx !== -1) {
        catalogProducts[cpIdx] = { ...catalogProducts[cpIdx], isInStock: false, lastUpdatedAt: new Date().toISOString() };
      }
    }

    return true;
  },

  reject(id: string, reviewNote: string): boolean {
    const idx = discrepancyReports.findIndex(r => r.id === id);
    if (idx === -1) return false;
    discrepancyReports[idx] = {
      ...discrepancyReports[idx],
      status: 'rejected',
      reviewNote,
      resolvedAt: new Date().toISOString(),
    };
    return true;
  },

  pendingCount(): number {
    return discrepancyReports.filter(r => r.status === 'pending').length;
  },
};

// ─── Missing Product Request API ──────────────────────────────────────────────
export const missingProductApi = {
  getAll(): MissingProductRequest[] {
    return [...missingProductRequests].sort(
      (a, b) => b.requesterTrustScore - a.requesterTrustScore
    );
  },

  getPending(): MissingProductRequest[] {
    return missingProductRequests.filter(r => r.status === 'pending');
  },

  submit(req: Omit<MissingProductRequest, 'id' | 'status' | 'createdAt'>): MissingProductRequest {
    const newReq: MissingProductRequest = {
      ...req,
      id: `mp${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    missingProductRequests = [newReq, ...missingProductRequests];
    return newReq;
  },

  forward(id: string, note?: string): boolean {
    const idx = missingProductRequests.findIndex(r => r.id === id);
    if (idx === -1) return false;
    missingProductRequests[idx] = {
      ...missingProductRequests[idx],
      status: 'forwarded',
      reviewNote: note,
      resolvedAt: new Date().toISOString(),
    };
    return true;
  },

  decline(id: string, note?: string): boolean {
    const idx = missingProductRequests.findIndex(r => r.id === id);
    if (idx === -1) return false;
    missingProductRequests[idx] = {
      ...missingProductRequests[idx],
      status: 'declined',
      reviewNote: note,
      resolvedAt: new Date().toISOString(),
    };
    return true;
  },
};
