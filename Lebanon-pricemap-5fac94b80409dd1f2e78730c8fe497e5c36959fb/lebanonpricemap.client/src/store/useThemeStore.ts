import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggle: () => {
    // Light only mode — no operation
    console.log('System is locked to Light Editorial.');
  },
}));
