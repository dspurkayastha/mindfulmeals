// MindfulMeals Design System - Spacing Tokens
// 8pt Grid System for Consistent Spacing

export const spacing = {
  // Base unit: 8px
  xxs: 4,   // 0.5x - Tight spacing
  xs: 8,    // 1x   - Extra small
  sm: 12,   // 1.5x - Small
  md: 16,   // 2x   - Medium (default)
  lg: 24,   // 3x   - Large
  xl: 32,   // 4x   - Extra large
  xxl: 40,  // 5x   - Extra extra large
  xxxl: 48, // 6x   - Maximum spacing
  
  // Special spacing
  none: 0,
  hairline: 1,
  thin: 2,
  
  // Component-specific spacing
  buttonPadding: {
    horizontal: 24,
    vertical: 12,
  },
  cardPadding: {
    small: 12,
    medium: 16,
    large: 20,
  },
  screenPadding: {
    horizontal: 20,
    vertical: 16,
  },
  
  // Grid spacing
  gridGap: {
    small: 8,
    medium: 16,
    large: 24,
  },
  
  // List spacing
  listItemGap: 12,
  sectionGap: 32,
};

// Responsive spacing multipliers
export const responsiveSpacing = {
  small: 0.8,   // Small devices
  medium: 1,    // Default
  large: 1.2,   // Tablets
  xlarge: 1.5,  // Large tablets
};

export default spacing;