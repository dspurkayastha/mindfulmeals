// MindfulMeals Design System - Color Tokens
// Rustic Greek Sunset Aesthetic with Mindful Enhancements

export const baseColors = {
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
  
  // Pure Values
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const semanticColors = {
  // Status Colors
  success: baseColors.olive,
  warning: baseColors.goldenAmber,
  error: baseColors.deepCoral,
  info: baseColors.sage,
  
  // Text Colors
  textPrimary: '#2F2F2F',
  textSecondary: '#696969',
  textTertiary: baseColors.sage,
  textInverse: baseColors.softCream,
  
  // Background Colors
  backgroundPrimary: baseColors.warmGray,
  backgroundSecondary: baseColors.softCream,
  backgroundTertiary: baseColors.warmBeige,
  
  // Surface Colors
  surface: baseColors.white,
  surfaceElevated: baseColors.softCream,
  
  // Border Colors
  borderLight: 'rgba(214, 180, 140, 0.3)',
  borderMedium: 'rgba(214, 180, 140, 0.5)',
  borderDark: 'rgba(214, 180, 140, 0.7)',
};

export const mindfulGradients = {
  // Time of Day Gradients
  sunrise: ['#FFB6C1', '#FF8C00', '#D2691E'],
  sunset: ['#E9967A', '#FF8C00', '#FFB6C1'],
  twilight: ['#9CAF88', '#D2B48C', '#E9967A'],
  
  // Natural Gradients
  sage: ['#9CAF88', '#6B8E23', '#9CAF88'],
  earth: ['#F5DEB3', '#D2B48C', '#8B4513'],
  sand: ['#FFF8DC', '#F5DEB3', '#D2B48C'],
  
  // Mood Gradients
  calm: ['#F5F5DC', '#FFF8DC', '#F5DEB3'],
  energized: ['#FF8C00', '#FFB6C1', '#FFF8DC'],
  grounded: ['#8B4513', '#D2691E', '#D2B48C'],
  grateful: ['#FFB6C1', '#E9967A', '#FF8C00'],
  
  // Wellness Gradients
  meditation: ['#9CAF88', '#F5F5DC', '#9CAF88'],
  breathing: ['#F5DEB3', '#FFF8DC', '#F5DEB3'],
  mindful: ['#D2B48C', '#F5DEB3', '#FFF8DC'],
};

export const transparentColors = {
  // Overlay Colors
  blackOverlay: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
  },
  whiteOverlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.3)',
    dark: 'rgba(255, 255, 255, 0.5)',
  },
  
  // Mindful Overlays
  sageOverlay: 'rgba(156, 175, 136, 0.1)',
  terracottaOverlay: 'rgba(210, 105, 30, 0.1)',
  peachOverlay: 'rgba(255, 182, 193, 0.1)',
};

// Dark Mode Colors (Future Enhancement)
export const darkModeColors = {
  // Inverted earth tones for night mode
  background: '#1A1A1A',
  surface: '#2F2F2F',
  textPrimary: baseColors.softCream,
  textSecondary: baseColors.warmBeige,
  // Preserve warm accent colors for consistency
  accent: baseColors.terracotta,
  secondary: baseColors.olive,
};

// Mood-Based Color Palettes
export const moodPalettes = {
  energetic: {
    primary: baseColors.goldenAmber,
    secondary: baseColors.warmPeach,
    gradient: mindfulGradients.energized,
  },
  calm: {
    primary: baseColors.sage,
    secondary: baseColors.warmBeige,
    gradient: mindfulGradients.calm,
  },
  grounded: {
    primary: baseColors.terracotta,
    secondary: baseColors.mutedBrown,
    gradient: mindfulGradients.grounded,
  },
  grateful: {
    primary: baseColors.warmPeach,
    secondary: baseColors.deepCoral,
    gradient: mindfulGradients.grateful,
  },
};

// Export all color tokens
export const colors = {
  ...baseColors,
  ...semanticColors,
  gradients: mindfulGradients,
  transparent: transparentColors,
  dark: darkModeColors,
  moods: moodPalettes,
};

export default colors;