import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/api/mockData';

interface AuthState {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    const saved = localStorage.getItem('wein_user_role');
    if (saved) return MOCK_USERS.find(u => u.role === saved) || null;
    return null;
  })(),
  login: (role) => {
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    localStorage.setItem('wein_user_role', role);
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('wein_user_role');
    localStorage.removeItem('wein_token');
    set({ user: null });
  },
}));
