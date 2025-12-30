import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

export interface Theme {
  colors: typeof colors;
  fonts: typeof fonts;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export const lightTheme: Theme = {
  colors,
  fonts,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6.27,
      elevation: 10,
    },
  },
  breakpoints: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...colors,
    // Override colors for dark theme
    background: '#0F172A',
    surface: '#1E293B',
    surfaceVariant: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    border: '#334155',
    borderLight: '#475569',
    borderDark: '#1E293B',
  },
};

export type ThemeMode = 'light' | 'dark';

export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

// Theme context types
export interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

// Role-based theme colors
export const getRoleTheme = (role: string) => {
  switch (role) {
    case 'admin':
      return {
        primary: colors.admin,
        primaryLight: '#A78BFA',
        primaryDark: '#7C3AED',
      };
    case 'teacher':
      return {
        primary: colors.teacher,
        primaryLight: '#22D3EE',
        primaryDark: '#0891B2',
      };
    case 'student':
      return {
        primary: colors.student,
        primaryLight: '#34D399',
        primaryDark: '#059669',
      };
    default:
      return {
        primary: colors.primary,
        primaryLight: colors.primaryLight,
        primaryDark: colors.primaryDark,
      };
  }
};
