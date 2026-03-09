import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (email: string, password: string, role: UserRole, name: string) => { success: boolean; error?: string };
}

function detectRole(email: string): UserRole {
  if (email.includes('@admin') || email.includes('admin@')) return 'admin';
  if (email.includes('retailer') || email.includes('@store')) return 'retailer';
  return 'shopper';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Start logged-out — users must authenticate
      user: null,
      isLoading: false,

      login: (email: string, password: string) => {
        if (!email || !password) {
          return { success: false, error: 'Please enter your email and password.' };
        }
        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters.' };
        }

        const role = detectRole(email);
        const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        set({
          user: {
            id: `user_${Date.now()}`,
            name,
            email,
            role,
            city: 'Beirut',
            trustScore: role === 'admin' ? 100 : role === 'retailer' ? 85 : 70,
            uploadCount: 0,
            verifiedCount: 0,
            avatarInitials: name.slice(0, 2).toUpperCase(),
            joinedAt: new Date().toISOString(),
            status: 'active',
            notifications: [],
            alerts: [],
          },
        });

        return { success: true };
      },

      logout: () => set({ user: null }),

      register: (email: string, password: string, role: UserRole, name: string) => {
        if (!email || !password || !name) {
          return { success: false, error: 'All fields are required.' };
        }
        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters.' };
        }

        set({
          user: {
            id: `user_${Date.now()}`,
            name: name.trim(),
            email,
            role,
            city: 'Beirut',
            trustScore: 0,
            uploadCount: 0,
            verifiedCount: 0,
            avatarInitials: name.trim().slice(0, 2).toUpperCase(),
            joinedAt: new Date().toISOString(),
            status: 'active',
            notifications: [],
            alerts: [],
          },
        });

        return { success: true };
      },
    }),
    { name: 'wein_auth_v2' }
  )
);