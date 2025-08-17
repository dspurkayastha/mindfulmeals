// MindfulMeals Theme Configuration
// Rustic Greek Sunset Aesthetic

export const colors = {
  // Primary Colors (Warm Earth Tones)
  terracotta: '#D2691E',      // Rustic clay
  olive: '#6B8E23',           // Greek olive groves
  sage: '#9CAF88',            // Mediterranean herbs
  
  // Secondary Colors (Sunset Hues)
  goldenAmber: '#FF8C00',     // Setting sun
  warmPeach: '#FFB6C1',       // Golden hour glow
  deepCoral: '#E9967A',       // Mediterranean sunset
  
  // Accent Colors (Natural Elements)
  warmBeige: '#F5DEB3',       // Sandstone
  softCream: '#FFF8DC',       // Aged parchment
  mutedBrown: '#8B4513',      // Weathered wood
  
  // Neutral Colors (Easy on Eyes)
  warmGray: '#F5F5DC',        // Beige-tinted white
  softTaupe: '#D2B48C',       // Natural linen
  mutedCharcoal: '#696969',   // Soft shadows
  
  // Semantic Colors
  success: '#6B8E23',         // Olive green
  warning: '#FF8C00',         // Golden amber
  error: '#E9967A',           // Deep coral
  info: '#9CAF88',            // Sage
  
  // Text Colors
  textPrimary: '#2F2F2F',     // Dark charcoal
  textSecondary: '#696969',   // Muted charcoal
  textTertiary: '#9CAF88',   // Sage
  textInverse: '#FFF8DC',     // Soft cream
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  round: 50,
};

export const shadows = {
  small: {
    shadowColor: colors.mutedBrown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.mutedBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.mutedBrown,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: colors.textTertiary,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: colors.textInverse,
  },
};

export const gradients = {
  primary: [colors.terracotta, colors.goldenAmber],
  secondary: [colors.olive, colors.sage],
  warm: [colors.warmBeige, colors.softCream],
  sunset: [colors.goldenAmber, colors.warmPeach],
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  gradients,
};
