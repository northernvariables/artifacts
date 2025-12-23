/**
 * Design tokens for Northern Variables
 * Export all design tokens (colors, typography, spacing)
 */

export * from './colors'
export * from './typography'
export * from './spacing'

import { colors } from './colors'
import { typography } from './typography'
import { spacing, borderRadius } from './spacing'

export const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
} as const

export type DesignTokens = typeof tokens
