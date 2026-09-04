import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

const listeners = new Set<(theme: Theme) => void>();

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
  }
  return 'dark';
}

let currentTheme: Theme = getInitialTheme();

// Synchronize initial root class
if (typeof document !== 'undefined') {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(currentTheme);
}

function applyTheme(theme: Theme) {
  currentTheme = theme;
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
  listeners.forEach((listener) => listener(theme));
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme);

  useEffect(() => {
    listeners.add(setThemeState);
    return () => {
      listeners.delete(setThemeState);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }, []);

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
