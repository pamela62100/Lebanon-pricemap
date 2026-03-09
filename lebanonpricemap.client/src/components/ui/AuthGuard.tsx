import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

const ROLE_HOME: Record<string, string> = {
  shopper:  '/app',
  retailer: '/retailer',
  admin:    '/admin',
};

export function AuthGuard({ children, requiredRole, redirectTo = '/login' }: AuthGuardProps) {
  const user = useAuthStore(s => s.user);

  // Not authenticated at all → go to login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Role check
  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(user.role as UserRole)) {
      // Redirect them to their correct home
      const home = ROLE_HOME[user.role] ?? '/app';
      return <Navigate to={home} replace />;
    }
  }

  return <>{children}</>;
}
