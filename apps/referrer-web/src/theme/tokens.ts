import { getTokens, type ThemeMode } from '../../../../packages/shared/src/tokens';

const PREFIX = '--rave';

const setVar = (name: string, value: string) => {
  document.documentElement.style.setProperty(name, value);
};

const setTokenGroup = (groupName: string, tokens: Record<string, string | number>) => {
  Object.entries(tokens).forEach(([key, value]) => {
    const tokenName = `${PREFIX}-${groupName}-${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;
    const stringValue = typeof value === 'number' ? `${value}px` : value;
    setVar(tokenName, stringValue);
  });
};

export const applyThemeTokens = (mode: ThemeMode) => {
  const tokens = getTokens(mode);
  setTokenGroup('color', tokens.colors);
  setTokenGroup('space', tokens.spacing);
  setTokenGroup('radius', tokens.radii);
  setTokenGroup('font', tokens.fontSizes);
  setTokenGroup('icon', tokens.iconSizes);
  setTokenGroup('size', tokens.sizes);
  setTokenGroup('type', tokens.typography);
};

export const getPreferredTheme = (): ThemeMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
