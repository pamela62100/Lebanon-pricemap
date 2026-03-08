import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: document.documentElement.classList.contains('dark'),
  toggle: () => set((state) => {
    const next = !state.isDark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('rakis-theme', next ? 'dark' : 'light');
    return { isDark: next };
  }),
}));
