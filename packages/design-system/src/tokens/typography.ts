/**
 * Typography tokens for Northern Variables design system
 * Using fluid typography with clamp() for responsive scaling
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(', '),
  },

  // Fluid font sizes using clamp()
  fontSize: {
    xs: 'clamp(0.75rem, 1.5vw, 0.875rem)',
    sm: 'clamp(0.875rem, 2vw, 1rem)',
    base: 'clamp(1rem, 2.5vw, 1.125rem)',
    lg: 'clamp(1.125rem, 2.75vw, 1.25rem)',
    xl: 'clamp(1.25rem, 3vw, 1.5rem)',
    '2xl': 'clamp(1.5rem, 3.5vw, 1.875rem)',
    '3xl': 'clamp(1.875rem, 4vw, 2.25rem)',
    '4xl': 'clamp(2.25rem, 5vw, 3rem)',
    '5xl': 'clamp(3rem, 6vw, 3.75rem)',
  },

  // Line heights
  lineHeight: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.6',
    loose: '2',
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.32em', // For uppercase labels
  },
} as const

export type TypographyToken = typeof typography
