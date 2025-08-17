// MindfulMeals Design System - Typography Tokens
// Font families: Poppins, Nunito, SF Pro Display

import { TextStyle } from 'react-native';

export const fontFamilies = {
  // Primary font for headings
  heading: {
    light: 'Poppins-Light',
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  // Secondary font for body text
  body: {
    light: 'Nunito-Light',
    regular: 'Nunito-Regular',
    medium: 'Nunito-Medium',
    semiBold: 'Nunito-SemiBold',
    bold: 'Nunito-Bold',
  },
  // System font fallback
  system: {
    ios: 'SF Pro Display',
    android: 'Roboto',
  },
};

export const fontSizes = {
  // Modular scale (1.2 ratio)
  xxxs: 10,
  xxs: 12,
  xs: 14,
  sm: 16,
  md: 18,
  lg: 22,
  xl: 26,
  xxl: 32,
  xxxl: 38,
  display: 48,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
};

export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

// Typography presets
export const typography: Record<string, TextStyle> = {
  // Display styles
  displayLarge: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: fontSizes.display,
    lineHeight: fontSizes.display * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    fontWeight: fontWeights.bold,
  },
  displaySmall: {
    fontFamily: fontFamilies.heading.semiBold,
    fontSize: fontSizes.xxxl,
    lineHeight: fontSizes.xxxl * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    fontWeight: fontWeights.semiBold,
  },
  
  // Heading styles
  h1: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: fontSizes.xxl,
    lineHeight: fontSizes.xxl * lineHeights.tight,
    fontWeight: fontWeights.bold,
  },
  h2: {
    fontFamily: fontFamilies.heading.semiBold,
    fontSize: fontSizes.xl,
    lineHeight: fontSizes.xl * lineHeights.tight,
    fontWeight: fontWeights.semiBold,
  },
  h3: {
    fontFamily: fontFamilies.heading.semiBold,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.normal,
    fontWeight: fontWeights.semiBold,
  },
  h4: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * lineHeights.normal,
    fontWeight: fontWeights.medium,
  },
  
  // Body styles
  bodyLarge: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * lineHeights.relaxed,
    fontWeight: fontWeights.regular,
  },
  bodyMedium: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.normal,
    fontWeight: fontWeights.regular,
  },
  bodySmall: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    fontWeight: fontWeights.regular,
  },
  
  // Special styles
  button: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * lineHeights.tight,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontFamily: fontFamilies.body.regular,
    fontSize: fontSizes.xxs,
    lineHeight: fontSizes.xxs * lineHeights.normal,
    fontWeight: fontWeights.regular,
  },
  overline: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xxxs,
    lineHeight: fontSizes.xxxs * lineHeights.normal,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.xs,
    lineHeight: fontSizes.xs * lineHeights.normal,
    fontWeight: fontWeights.medium,
  },
  
  // Mindful styles
  quote: {
    fontFamily: fontFamilies.body.light,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * lineHeights.relaxed,
    fontWeight: fontWeights.light,
    fontStyle: 'italic' as const,
  },
  gratitude: {
    fontFamily: fontFamilies.heading.medium,
    fontSize: fontSizes.lg,
    lineHeight: fontSizes.lg * lineHeights.relaxed,
    fontWeight: fontWeights.medium,
  },
};

export default typography;