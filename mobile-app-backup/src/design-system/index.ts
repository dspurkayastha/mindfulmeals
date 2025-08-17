// MindfulMeals Design System
// Central export for all design tokens and utilities

// Design Tokens
export { default as colors } from './tokens/colors';
export { default as spacing } from './tokens/spacing';
export { default as typography } from './tokens/typography';
export { default as animations } from './tokens/animations';
export { default as haptics } from './tokens/haptics';

// Re-export specific token groups for convenience
export { 
  baseColors,
  semanticColors,
  mindfulGradients,
  transparentColors,
  darkModeColors,
  moodPalettes
} from './tokens/colors';

export {
  fontFamilies,
  fontSizes,
  lineHeights,
  letterSpacing,
  fontWeights
} from './tokens/typography';

export {
  durations,
  easings,
  springConfigs,
  reanimatedConfigs,
  animationSequences,
  gestureConfigs
} from './tokens/animations';

export {
  hapticTypes,
  hapticPatterns,
  hapticConfig,
  mindfulHapticSequences
} from './tokens/haptics';

// Utilities
export { haptic, useHaptic } from '../utils/haptics';

// Design System Configuration
export const designSystem = {
  colors: require('./tokens/colors').default,
  spacing: require('./tokens/spacing').default,
  typography: require('./tokens/typography').default,
  animations: require('./tokens/animations').default,
  haptics: require('./tokens/haptics').default,
};

// Theme helpers
export const getTheme = (mode: 'light' | 'dark' = 'light') => {
  return {
    ...designSystem,
    mode,
    isDark: mode === 'dark',
  };
};

// Mood-based theme helper
export const getMoodTheme = (mood: 'energetic' | 'calm' | 'grounded' | 'grateful') => {
  const { moods } = require('./tokens/colors');
  return moods[mood] || moods.calm;
};

export default designSystem;