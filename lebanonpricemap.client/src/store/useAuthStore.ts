import { create } from 'zustand';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  register: (email: string, password: string, role: UserRole, name: string) => void; // ← ADD
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: '123',
    name: 'Dev Tester',
    email: 'dev@test.com',
    role: 'shopper',
    city: 'Beirut',
    trustScore: 80,
    uploadCount: 10,
    verifiedCount: 5,
    avatarInitials: 'DT',
    joinedAt: new Date().toISOString(),
    status: 'active',
    notifications: [
      { id: 1, userId: '123', type: 'price_alert', title: 'Price drop', message: 'Price drop on Milk!', isRead: false, createdAt: new Date().toISOString(), relatedPriceEntryId: null },
      { id: 2, userId: '123', type: 'price_verified', title: 'Order shipped', message: 'Your order has shipped', isRead: false, createdAt: new Date().toISOString(), relatedPriceEntryId: null },
    ],
    alerts: [
      { id: 1, type: 'stock_out', message: 'New promotion nearby', severity: 'medium', createdAt: new Date().toISOString() },
    ],
  },

  login: (role: UserRole) =>
    set((state) => ({ user: { ...state.user!, role } })),

  logout: () => set({ user: null }),

  // ── ADD THIS ──────────────────────────────────────────
  register: (email: string, _password: string, role: UserRole, name: string) =>
    set({
      user: {
        id: Date.now().toString(),
        name: name || email.split('@')[0],
        email,
        role,
        city: 'Beirut',
        trustScore: 0,
        uploadCount: 0,
        verifiedCount: 0,
        avatarInitials: (name || email).slice(0, 2).toUpperCase(),
        joinedAt: new Date().toISOString(),
        status: 'active',
      },
    }),
}));