export const fonts = {
  // Font families
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
  
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font weights
  weight: {
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
} as const;

export type FontSize = keyof typeof fonts;
export type FontWeight = keyof typeof fonts.weight;
