/**
 * Color theme for Rave application.
 * Aligned with Minimum Standards aesthetic: warm, professional, earthy, minimal.
 */

export interface ColorTheme {
  // Primary colors (warm brown)
  primary: {
    main: string;
    light: string;
    dark: string;
  };

  // Status colors
  status: {
    draft: {
      background: string;
      text: string;
      badge: string;
    };
    sent: {
      background: string;
      text: string;
      badge: string;
    };
    completed: {
      background: string;
      text: string;
      badge: string;
    };
    abandoned: {
      background: string;
      text: string;
      badge: string;
    };
  };

  // Background colors
  background: {
    screen: string;
    surface: string;
    tertiary: string;
  };

  // Text colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };

  // Border colors
  border: {
    primary: string;
    secondary: string;
  };

  // Button colors
  button: {
    primary: {
      background: string;
      text: string;
    };
    secondary: {
      background: string;
      text: string;
    };
    disabled: {
      background: string;
      text: string;
    };
    destructive: {
      background: string;
      text: string;
    };
  };

  // Input colors
  input: {
    background: string;
    border: string;
    borderError: string;
    text: string;
    placeholder: string;
  };

  // Divider
  divider: string;

  // Shadow
  shadow: string;
}

export const lightTheme: ColorTheme = {
  primary: {
    main: '#987e55',
    light: '#D4C4B0',
    dark: '#6B5D47',
  },
  status: {
    draft: {
      background: '#F5F3EF',
      text: '#666666',
      badge: '#F5F3EF',
    },
    sent: {
      background: '#FFF8E1',
      text: '#B06E00',
      badge: '#FFF8E1',
    },
    completed: {
      background: '#F5F3EF',
      text: '#4A7C59',
      badge: '#F5F3EF',
    },
    abandoned: {
      background: '#FCE8E6',
      text: '#C5221F',
      badge: '#FCE8E6',
    },
  },
  background: {
    screen: '#f7f8fa',
    surface: '#ffffff',
    tertiary: '#fafafa',
  },
  text: {
    primary: '#111111',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#ffffff',
  },
  border: {
    primary: '#dddddd',
    secondary: '#eeeeee',
  },
  button: {
    primary: {
      background: '#987e55',
      text: '#ffffff',
    },
    secondary: {
      background: '#f0f0f0',
      text: '#333333',
    },
    disabled: {
      background: '#cccccc',
      text: '#ffffff',
    },
    destructive: {
      background: '#c00000',
      text: '#ffffff',
    },
  },
  input: {
    background: '#ffffff',
    border: '#dddddd',
    borderError: '#c00000',
    text: '#333333',
    placeholder: '#999999',
  },
  divider: '#eeeeee',
  shadow: '#000000',
};

export const darkTheme: ColorTheme = {
  primary: {
    main: '#987e55',
    light: '#B0A896',
    dark: '#6B5D47',
  },
  status: {
    draft: {
      background: '#D4C4B0',
      text: '#6B5D47',
      badge: '#D4C4B0',
    },
    sent: {
      background: '#D4C4B0',
      text: '#6B5D47',
      badge: '#D4C4B0',
    },
    completed: {
      background: '#D4C4B0',
      text: '#4A7C59',
      badge: '#D4C4B0',
    },
    abandoned: {
      background: '#D4C4B0',
      text: '#6B5D47',
      badge: '#D4C4B0',
    },
  },
  background: {
    screen: '#1E1E1E',
    surface: '#2E2E2E',
    tertiary: '#323232',
  },
  text: {
    primary: '#E0E0E0',
    secondary: '#B0B0B0',
    tertiary: '#888888',
    inverse: '#111111',
  },
  border: {
    primary: '#38383A',
    secondary: '#38383A',
  },
  button: {
    primary: {
      background: '#987e55',
      text: '#ffffff',
    },
    secondary: {
      background: '#333333',
      text: '#E0E0E0',
    },
    disabled: {
      background: '#666666',
      text: '#B0B0B0',
    },
    destructive: {
      background: '#EF5350',
      text: '#ffffff',
    },
  },
  input: {
    background: '#2E2E2E',
    border: '#38383A',
    borderError: '#EF5350',
    text: '#E0E0E0',
    placeholder: '#888888',
  },
  divider: '#38383A',
  shadow: '#000000',
};

export function getStatusColor(
  theme: ColorTheme,
  status: 'draft' | 'sent' | 'completed' | 'abandoned'
) {
  return theme.status[status];
}
