/**
 * Color tokens for Northern Variables design system
 * Merges artifacts brand colors with WordPress main site colors
 */

export const colors = {
  // Northern Variables artifacts brand colors
  nv: {
    primary: '#0f2747',
    primaryDark: '#091a30',
    primaryMid: '#163b6b',
    accent: '#ff6719',
    accentDark: '#d85612',
    text: '#0f172a',
    soft: '#f1f5f9',
  },

  // WordPress main site brand colors
  brand: {
    primary: '#2563eb',
    secondary: '#ff6719', // Same as nv.accent
  },

  // Semantic colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Neutral scale
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
} as const

// Color utility functions
export const withAlpha = (hex: string, alpha: number = 0.12): string => {
  if (!hex || typeof hex !== 'string') {
    return `rgba(15, 23, 42, ${alpha})`
  }

  let normalized = hex.replace('#', '')
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((char) => char + char)
      .join('')
  }

  const value = parseInt(normalized.slice(0, 6), 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Type exports
export type ColorToken = typeof colors
export type NVColor = keyof typeof colors.nv
export type BrandColor = keyof typeof colors.brand
export type SemanticColor = keyof typeof colors.semantic
export type NeutralShade = keyof typeof colors.neutral
