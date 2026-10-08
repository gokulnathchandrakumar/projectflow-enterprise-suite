import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme/theme';
import { storage } from '../services/secureStore';

const THEME_STORAGE_KEY = 'projectflow_mobile_theme_mode';

const MobileThemeContext = createContext({
  themeMode: 'LIGHT',
  setThemeMode: () => {},
  theme: lightTheme,
  isDark: false,
});

export const MobileThemeProvider = ({ children }) => {
  const deviceScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState('LIGHT');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await storage.getItem(THEME_STORAGE_KEY);
        if (saved && ['LIGHT', 'DARK', 'SYSTEM'].includes(saved)) {
          setThemeModeState(saved);
        }
      } catch (e) {
        // default to LIGHT
      }
    };
    loadTheme();
  }, []);

  const setThemeMode = async (mode) => {
    setThemeModeState(mode);
    try {
      await storage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {}
  };

  const isDark =
    themeMode === 'DARK' || (themeMode === 'SYSTEM' && deviceScheme === 'dark');

  const activeTheme = isDark ? darkTheme : lightTheme;

  return (
    <MobileThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        theme: activeTheme,
        isDark,
      }}
    >
      {children}
    </MobileThemeContext.Provider>
  );
};

export const useMobileTheme = () => useContext(MobileThemeContext);
export const useTheme = useMobileTheme;
