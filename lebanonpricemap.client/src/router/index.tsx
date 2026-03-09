import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';

// Layouts
import { DesktopLayout }  from '@/layouts/DesktopLayout';
import { AdminLayout }    from '@/layouts/AdminLayout';
import { RetailerLayout } from '@/layouts/RetailerLayout';

// Public pages
import { LandingPage }  from '@/pages/LandingPage';
import { LoginPage }    from '@/pages/shared/LoginPage';
import { RegisterPage } from '@/pages/shared/RegisterPage';
import { NotFoundPage } from '@/pages/shared/NotFoundPage';

// Public (unauthenticated) detail pages
import { PublicMapPage }      from '@/pages/public/PublicMapPage';
import { ProductPublicPage }  from '@/pages/public/ProductPublicPage';
import { StorePublicPage }    from '@/pages/public/StorePublicPage';

// Shopper pages
import { SearchPage }         from '@/pages/shopper/SearchPage';
import { CartPage }           from '@/pages/shopper/CartPage';
import { CartOptimizePage }   from '@/pages/shopper/CartOptimizePage';
import { BarcodeScannerPage } from '@/pages/shopper/BarcodeScannerPage';
import { FuelTrackerPage }    from '@/pages/shopper/FuelTrackerPage';
import { ProfilePage }        from '@/pages/shopper/ProfilePage';
import { UploadReceiptPage }  from '@/pages/shopper/UploadReceiptPage';
import { PriceDetailPage }    from '@/pages/shopper/PriceDetailPage';
import { AlertsPage }         from '@/pages/shopper/AlertsPage';
import { NotificationsPage }  from '@/pages/shopper/NotificationsPage';
import { MyRequestsPage }     from '@/pages/shopper/MyRequestsPage';
import { RetailerCatalogPage } from '@/pages/shopper/RetailerCatalogPage';
import { RetailerCatalogDetailPage } from '@/pages/shopper/RetailerCatalogDetailPage';

// Retailer pages
import { StoreDashboardPage }     from '@/pages/retailer/StoreDashboardPage';
import { RetailerProductsPage }   from '@/pages/retailer/RetailerProductsPage';
import { PromotionsPage }         from '@/pages/retailer/PromotionsPage';
import { CompetitorInsightsPage } from '@/pages/retailer/CompetitorInsightsPage';
import { RetailerSyncPage }       from '@/pages/retailer/RetailerSyncPage';
import { BulkUploadPage }         from '@/pages/retailer/BulkUploadPage';
import { UpdatePricePage }        from '@/pages/retailer/UpdatePricePage';

// Admin pages
import { AdminOverviewPage }       from '@/pages/admin/AdminOverviewPage';
import { AdminApprovalQueuePage }  from '@/pages/admin/AdminApprovalQueuePage';
import { AdminUsersPage }          from '@/pages/admin/AdminUsersPage';
import { AdminProductsPage }       from '@/pages/admin/AdminProductsPage';
import { AdminStoresPage }         from '@/pages/admin/AdminStoresPage';
import { AdminFlaggedPricesPage }  from '@/pages/admin/AdminFlaggedPricesPage';
import { AdminAnomaliesPage }      from '@/pages/admin/AdminAnomaliesPage';
import { AdminActivityLogsPage }   from '@/pages/admin/AdminActivityLogsPage';
import { AdminOnboardingPage }     from '@/pages/admin/AdminOnboardingPage';

function ProtectedRoute({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/app" replace />;
  return <Outlet />;
}

function RequireAuth() {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function AppRouter() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────────── */}
      <Route path="/"            element={<LandingPage />} />
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/register"    element={<RegisterPage />} />
      <Route path="/map"         element={<PublicMapPage />} />
      <Route path="/product/:id" element={<ProductPublicPage />} />
      <Route path="/store/:id"   element={<StorePublicPage />} />

      {/* ── Shopper stack ──────────────────────────────────────── */}
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<DesktopLayout />}>
          <Route index                element={<SearchPage />} />
          <Route path="cart"          element={<CartPage />} />
          <Route path="cart/optimize" element={<CartOptimizePage />} />
          <Route path="scan"          element={<BarcodeScannerPage />} />
          <Route path="fuel"          element={<FuelTrackerPage />} />
          <Route path="profile"       element={<ProfilePage />} />
          <Route path="upload"        element={<UploadReceiptPage />} />
          <Route path="price/:id"     element={<PriceDetailPage />} />
          <Route path="alerts"        element={<AlertsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="requests"      element={<MyRequestsPage />} />
          <Route path="catalog"       element={<RetailerCatalogPage />} />
          <Route path="catalog/:storeId" element={<RetailerCatalogDetailPage />} />
        </Route>
      </Route>

      {/* ── Retailer stack ─────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['retailer', 'admin']} />}>
        <Route path="/retailer" element={<RetailerLayout />}>
          <Route index               element={<StoreDashboardPage />} />
          <Route path="products"     element={<RetailerProductsPage />} />
          <Route path="promotions"   element={<PromotionsPage />} />
          <Route path="insights"     element={<CompetitorInsightsPage />} />
          <Route path="sync"         element={<RetailerSyncPage />} />
          <Route path="upload"       element={<BulkUploadPage />} />
          <Route path="price/:id/edit" element={<UpdatePricePage />} />
          <Route path="profile"      element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── Admin stack ────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index             element={<AdminOverviewPage />} />
          <Route path="approvals"  element={<AdminApprovalQueuePage />} />
          <Route path="users"      element={<AdminUsersPage />} />
          <Route path="products"   element={<AdminProductsPage />} />
          <Route path="stores"     element={<AdminStoresPage />} />
          <Route path="flagged"    element={<AdminFlaggedPricesPage />} />
          <Route path="anomalies"  element={<AdminAnomaliesPage />} />
          <Route path="logs"       element={<AdminActivityLogsPage />} />
          <Route path="onboarding" element={<AdminOnboardingPage />} />
        </Route>
      </Route>

      {/* ── Catch-all ──────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
