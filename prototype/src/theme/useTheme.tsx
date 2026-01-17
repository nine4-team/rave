import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  isDark: boolean;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    // Check localStorage first, then system preference
    const savedPreference = localStorage.getItem('themePreference') as ThemePreference | null;
    if (savedPreference === 'light' || savedPreference === 'dark' || savedPreference === 'system') {
      return savedPreference;
    }

    const legacyTheme = localStorage.getItem('theme');
    if (legacyTheme === 'light' || legacyTheme === 'dark') {
      return legacyTheme;
    }

    return 'system';
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemIsDark(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const isDark = useMemo(() => {
    if (themePreference === 'system') {
      return systemIsDark;
    }
    return themePreference === 'dark';
  }, [systemIsDark, themePreference]);

  useEffect(() => {
    // Update DOM and localStorage
    const html = document.documentElement;
    const body = document.body;
    // Ensure legacy body class does not keep dark styles active
    body.classList.remove('dark');
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('themePreference', themePreference);
  }, [isDark, themePreference]);

  return (
    <ThemeContext.Provider value={{ isDark, themePreference, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
