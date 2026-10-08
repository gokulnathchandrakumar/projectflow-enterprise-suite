import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types';
export * from './MobileThemeContext';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('projectflow_theme');
    return (saved as ThemeMode) || 'light';
  });

  const getIsDarkForMode = (mode: ThemeMode): boolean => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('projectflow_theme');
    const initialMode = (saved as ThemeMode) || 'light';
    return getIsDarkForMode(initialMode);
  });

  const applyThemeToDom = (dark: boolean) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    if (dark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      if (body) {
        body.classList.add('dark');
        body.classList.remove('light');
        body.setAttribute('data-theme', 'dark');
        body.style.colorScheme = 'dark';
      }
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      if (body) {
        body.classList.remove('dark');
        body.classList.add('light');
        body.setAttribute('data-theme', 'light');
        body.style.colorScheme = 'light';
      }
    }
  };

  useEffect(() => {
    const dark = getIsDarkForMode(themeMode);
    setIsDark(dark);
    applyThemeToDom(dark);
    localStorage.setItem('projectflow_theme', themeMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        setIsDark(e.matches);
        applyThemeToDom(e.matches);
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    const dark = getIsDarkForMode(mode);
    setIsDark(dark);
    applyThemeToDom(dark);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
