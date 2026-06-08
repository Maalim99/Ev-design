/**
 * LAMT Design System Theme
 *
 * This file contains the theme configuration migrated from @lamt/components
 * to be used with TailwindCSS and the new design system.
 */

export const colors = {
  // Primary - Orange
  primary: {
    DEFAULT: '#F5A623',
    medium: '#FBD89D',
    light: '#FEF3E2',
  },
  // Accent - Blue
  accent: {
    DEFAULT: '#07C1FF',
    medium: '#BAEEFF',
    light: '#F2FCFF',
  },
  // Semantic Colors
  danger: {
    DEFAULT: '#FF4507',
    medium: '#F49E8B',
    light: '#FBE0DA',
  },
  success: {
    DEFAULT: '#1D9E75',
    medium: '#9FE1CB',
    light: '#E1F5EE',
  },
  warning: {
    DEFAULT: '#FFEA30',
    medium: '#FFF27D',
    light: '#FFF8E7',
  },
  info: {
    DEFAULT: '#B247AE',
    medium: '#E5B8E4',
    light: '#FFF2FF',
  },
  // Neutral Colors
  neutral: {
    dark: '#11171E',
    'dark-medium': '#374A61',
    'dark-light': '#EDF1F5',
    DEFAULT: '#909AA7',
    medium: '#C9D0D9',
    light: '#FFFFFF',
  },
} as const

export const fontSizes = {
  h1: ['34.84px', { lineHeight: '56px' }],
  h2: ['30.6px', { lineHeight: '48px' }],
  h3: ['28.68px', { lineHeight: '40px' }],
  h4: ['26.88px', { lineHeight: '40px' }],
  h5: ['23.61px', { lineHeight: '32px' }],
  h6: ['16px', { lineHeight: '21px' }],
  text: ['14px', { lineHeight: '24px' }],
  'text-small': ['13.17px', { lineHeight: '16px' }],
  caption: ['13.17px', { lineHeight: '16px' }],
  'caption-small': ['11px', { lineHeight: '16px' }],
  small: ['12px', { lineHeight: '16px' }],
} as const

export const spacing = {
  spacer: '15px',
} as const

export const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xlg: '1024px',
  xl: '1200px',
} as const

/**
 * Utility functions for color manipulation
 * These are available for use in components if needed
 */
export const utils = {
  /**
   * Lighten a color by a given percentage
   */
  lighten: (color: string, _amount: number): string => {
    // For now, returns the color as-is
    // Can be enhanced with actual color manipulation if needed
    return color
  },

  /**
   * Darken a color by a given percentage
   */
  darken: (color: string, _amount: number): string => {
    // For now, returns the color as-is
    // Can be enhanced with actual color manipulation if needed
    return color
  },
}

export type ThemeColors = typeof colors
export type ThemeFontSizes = typeof fontSizes
export type ThemeSpacing = typeof spacing
export type ThemeBreakpoints = typeof breakpoints
