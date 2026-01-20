export type ThemeMode = 'light' | 'dark';

const baseTokens = {
  spacing: {
    xs: 4,
    xs2: 6,
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    xxl: 20,
    xxxl: 24,
    huge: 32,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 8,
    xl: 16,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 13,
    base: 14,
    lg: 18,
    xl: 16,
    xxl: 22,
    xxxl: 30,
  },
  iconSizes: {
    sm: 16,
    md: 20,
    lg: 24,
  },
  sizes: {
    avatar: 40,
    emoji: 44,
  },
  typography: {
    letterSpacingBase: 0.5,
    letterSpacingWide: 0.6,
  },
};

const lightColors = {
  textPrimary: '#111111',
  textSecondary: '#666666',
  textMuted: '#888888',
  textSubtle: '#999999',
  textDark: '#444444',
  brand: '#987E55',
  brandMuted: '#F5F3EF',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFAFA',
  borderLight: '#EEEEEE',
  borderMedium: '#DDDDDD',
  actionBackground: '#F0F0F0',
  actionBackgroundSubtle: '#F7F8FA',
  success: '#4A7C59',
  warning: '#B06E00',
  warningPending: '#FFC107',
  avatarBackground: '#D4C4B0',
  avatarText: '#6B5D47',
  onBrand: '#FFFFFF',
};

const darkColors = {
  textPrimary: '#E0E0E0',
  textSecondary: '#B0B0B0',
  textMuted: '#888888',
  textSubtle: '#888888',
  textDark: '#E0E0E0',
  brand: '#987E55',
  brandMuted: '#3A3327',
  surface: '#2E2E2E',
  surfaceAlt: '#323232',
  borderLight: '#38383A',
  borderMedium: '#444444',
  actionBackground: '#333333',
  actionBackgroundSubtle: '#1E1E1E',
  success: '#6FB382',
  warning: '#E1A850',
  warningPending: '#FFC107',
  avatarBackground: '#D4C4B0',
  avatarText: '#6B5D47',
  onBrand: '#FFFFFF',
};

export type Tokens = typeof baseTokens & {
  colors: typeof lightColors;
};

export const tokensByTheme: Record<ThemeMode, Tokens> = {
  light: {
    ...baseTokens,
    colors: lightColors,
  },
  dark: {
    ...baseTokens,
    colors: darkColors,
  },
};

export const getTokens = (mode: ThemeMode): Tokens => tokensByTheme[mode];
