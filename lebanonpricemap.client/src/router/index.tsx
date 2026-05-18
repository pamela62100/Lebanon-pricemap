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
import { ResetPasswordPage } from '@/pages/shared/ResetPasswordPage';

// Public (unauthenticated) detail pages
import { PublicMapPage }      from '@/pages/public/PublicMapPage';
import { ProductPublicPage }  from '@/pages/public/ProductPublicPage';
import { StorePublicPage }    from '@/pages/public/StorePublicPage';

// Shopper pages
import { SearchPage }         from '@/pages/shopper/SearchPage';
import { MapPage }            from '@/pages/shopper/MapPage';
import { CartPage }           from '@/pages/shopper/CartPage';
import { CartOptimizePage }   from '@/pages/shopper/CartOptimizePage';
import { BarcodeScannerPage } from '@/pages/shopper/BarcodeScannerPage';
import { ProfilePage }        from '@/pages/shopper/ProfilePage';
import { PriceDetailPage }    from '@/pages/shopper/PriceDetailPage';
import { AlertsPage }         from '@/pages/shopper/AlertsPage';
import { NotificationsPage }  from '@/pages/shopper/NotificationsPage';
import { RetailerCatalogPage } from '@/pages/shopper/RetailerCatalogPage';
import { RetailerCatalogDetailPage } from '@/pages/shopper/RetailerCatalogDetailPage';

// Retailer pages
import { StoreDashboardPage }     from '@/pages/retailer/StoreDashboardPage';
import { RetailerProductsPage }   from '@/pages/retailer/RetailerProductsPage';
import { PromotionsPage }         from '@/pages/retailer/PromotionsPage';
import { BulkUploadPage }         from '@/pages/retailer/BulkUploadPage';
import { UpdatePricePage }        from '@/pages/retailer/UpdatePricePage';

// Admin pages
import { AdminOverviewPage }       from '@/pages/admin/AdminOverviewPage';
import { AdminUsersPage }          from '@/pages/admin/AdminUsersPage';
import { AdminProductsPage }       from '@/pages/admin/AdminProductsPage';
import { AdminStoresPage }         from '@/pages/admin/AdminStoresPage';
import { AdminActivityLogsPage }   from '@/pages/admin/AdminActivityLogsPage';
import { AdminReportsPage }        from '@/pages/admin/AdminReportsPage';

function ProtectedRoute({ allowedRoles }: Readonly<{ allowedRoles: readonly UserRole[] }>) {
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
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/register"       element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/map"         element={<PublicMapPage />} />
      <Route path="/product/:id" element={<ProductPublicPage />} />
      <Route path="/store/:id"   element={<StorePublicPage />} />

      {/* ── Shopper stack ──────────────────────────────────────── */}
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<DesktopLayout />}>
          <Route index                element={<SearchPage />} />
          <Route path="map"           element={<MapPage />} />
          <Route path="list"          element={<CartPage />} />
          <Route path="list/optimize" element={<CartOptimizePage />} />
          <Route path="scan"          element={<BarcodeScannerPage />} />
          <Route path="fuel"          element={<Navigate to="/app" replace />} />
          <Route path="profile"       element={<ProfilePage />} />
          <Route path="price/:id"     element={<PriceDetailPage />} />
          <Route path="alerts"        element={<AlertsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
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
          <Route path="insights"     element={<Navigate to="/retailer" replace />} />
          <Route path="sync"         element={<Navigate to="/retailer" replace />} />
          <Route path="upload"       element={<BulkUploadPage />} />
          <Route path="price/:id/edit" element={<UpdatePricePage />} />
          <Route path="profile"      element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── Admin stack ────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index             element={<AdminOverviewPage />} />
          <Route path="users"      element={<AdminUsersPage />} />
          <Route path="products"   element={<AdminProductsPage />} />
          <Route path="stores"     element={<AdminStoresPage />} />
          <Route path="reports"    element={<AdminReportsPage />} />
          <Route path="logs"       element={<AdminActivityLogsPage />} />
        </Route>
      </Route>

      {/* ── Catch-all ──────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
