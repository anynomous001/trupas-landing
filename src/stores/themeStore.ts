import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Initialize theme on load
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  const theme = savedTheme || 'light';
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  return theme;
};

// Single source of truth for theme
const applyTheme = (theme: Theme) => {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  localStorage.setItem('theme', theme);
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initializeTheme(), // Runs once on store creation
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      return { theme: newTheme };
    });
  },
}));

