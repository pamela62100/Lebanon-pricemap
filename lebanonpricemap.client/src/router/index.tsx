import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';

// Layouts
import { DesktopLayout } from '@/layouts/DesktopLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Shopper pages
import { SearchPage } from '@/pages/shopper/SearchPage';
import { UploadReceiptPage } from '@/pages/shopper/UploadReceiptPage';
import { ProfilePage } from '@/pages/shopper/ProfilePage';
import { NotificationsPage } from '@/pages/shopper/NotificationsPage';
import { PriceDetailPage } from '@/pages/shopper/PriceDetailPage';

// Retailer pages
import { StoreDashboardPage } from '@/pages/retailer/StoreDashboardPage';
import { UpdatePricePage } from '@/pages/retailer/UpdatePricePage';
import { CompetitorInsightsPage } from '@/pages/retailer/CompetitorInsightsPage';
import { PromotionsPage } from '@/pages/retailer/PromotionsPage';

// Admin pages
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminActivityLogsPage } from '@/pages/admin/AdminActivityLogsPage';

// Shared
import { LoginPage } from '@/pages/shared/LoginPage';
import { NotFoundPage } from '@/pages/shared/NotFoundPage';

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
      <Route path="/login" element={<LoginPage />} />

      {/* Shopper & Retailer (Premium Desktop Layout) */}
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<DesktopLayout />}>
          <Route index element={<SearchPage />} />
          <Route path="upload" element={<UploadReceiptPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="price/:id" element={<PriceDetailPage />} />

          {/* Retailer nested under /app/retailer inside DesktopLayout */}
          <Route element={<ProtectedRoute allowedRoles={['retailer', 'admin']} />}>
            <Route path="retailer">
              <Route index element={<StoreDashboardPage />} />
              <Route path="price/:id/edit" element={<UpdatePricePage />} />
              <Route path="insights" element={<CompetitorInsightsPage />} />
              <Route path="promotions" element={<PromotionsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        {/* Admin (SaaS Dashboard Layout) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/app/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="logs" element={<AdminActivityLogsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
