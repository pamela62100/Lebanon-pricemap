import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';
import client from '@/api/axiosClient';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (email: string, password: string, role: UserRole, name: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (patch: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      token: null,

      login: async (email: string, password: string) => {
        if (!email || !password) {
          return { success: false, error: 'Please enter your email and password.' };
        }

        try {
          const response = await client.post('/auth/login', { email, password });
          const data = response.data;

          localStorage.setItem('rakis_token', data.token);

          set({
            token: data.token,
            user: {
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role,
              city: 'Beirut',
              trustScore: data.trustScore,
              trustLevel: data.trustLevel,
              uploadCount: 0,
              verifiedCount: 0,
              avatarInitials: data.avatarInitials ?? data.name.slice(0, 2).toUpperCase(),
              joinedAt: new Date().toISOString(),
              status: 'active',
              notifications: [],
              alerts: [],
            },
          });

          return { success: true };
        } catch (err: any) {
          const message = 
            err.response?.data?.errors 
              ? Object.values(err.response.data.errors).flat().join(' ') 
              : err.response?.data?.message || 'Invalid email or password.';
          return { success: false, error: message };
        }
      },

      logout: () => {
        localStorage.removeItem('rakis_token');
        set({ user: null, token: null });
      },

      updateUser: (patch) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...patch } : null,
        }));
      },

      register: async (email: string, password: string, role: UserRole, name: string) => {
        if (!email || !password || !name) {
          return { success: false, error: 'All fields are required.' };
        }
        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters.' };
        }

        try {
          const response = await client.post('/auth/register', { email, password, name, role });
          const data = response.data;

          localStorage.setItem('rakis_token', data.token);

          set({
            token: data.token,
            user: {
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role,
              city: 'Beirut',
              trustScore: data.trustScore,
              trustLevel: data.trustLevel,
              uploadCount: 0,
              verifiedCount: 0,
              avatarInitials: data.avatarInitials ?? name.trim().slice(0, 2).toUpperCase(),
              joinedAt: new Date().toISOString(),
              status: 'active',
              notifications: [],
              alerts: [],
            },
          });

          return { success: true };
        } catch (err: any) {
          const message = 
            err.response?.data?.errors 
              ? Object.values(err.response.data.errors).flat().join(' ') 
              : err.response?.data?.message || 'Registration failed. Please try again.';
          return { success: false, error: message };
        }
      },
    }),
    { name: 'wein_auth_v2' }
  )
);