import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { getTokens, type ThemeMode, type Tokens } from './tokens';

export type ThemePreference = ThemeMode | 'system';

type ThemeContextValue = {
  tokens: Tokens;
  themePreference: ThemePreference;
  resolvedTheme: ThemeMode;
  setThemePreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');

  const resolvedTheme: ThemeMode =
    themePreference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themePreference;

  const tokens = useMemo(() => getTokens(resolvedTheme), [resolvedTheme]);

  const value = useMemo(
    () => ({
      tokens,
      themePreference,
      resolvedTheme,
      setThemePreference,
    }),
    [resolvedTheme, themePreference, tokens],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
