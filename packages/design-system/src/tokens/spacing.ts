/**
 * Spacing tokens for Northern Variables design system
 * Based on a consistent scale for padding, margin, and gap
 */

export const spacing = {
  // Base spacing scale (rem units)
  0: '0',
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  '2xl': '4rem',  // 64px
  '3xl': '6rem',  // 96px
  '4xl': '8rem',  // 128px

  // Touch target minimum (WCAG 2.1 Level AAA)
  touch: '44px',
} as const

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px',
} as const

export type SpacingToken = typeof spacing
export type BorderRadiusToken = typeof borderRadius
