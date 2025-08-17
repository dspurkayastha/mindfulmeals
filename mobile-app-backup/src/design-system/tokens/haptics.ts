// MindfulMeals Design System - Haptic Feedback Tokens
// Patterns for mindful tactile interactions

import { Platform } from 'react-native';

// Note: Requires react-native-haptic-feedback to be installed
// npm install react-native-haptic-feedback

export const hapticTypes = {
  // Impact feedback (iOS and Android)
  impact: {
    light: 'impactLight',
    medium: 'impactMedium',
    heavy: 'impactHeavy',
    rigid: 'rigid',      // iOS 13+
    soft: 'soft',        // iOS 13+
  },
  
  // Notification feedback (iOS only)
  notification: {
    success: 'notificationSuccess',
    warning: 'notificationWarning',
    error: 'notificationError',
  },
  
  // Selection feedback
  selection: 'selection',
  
  // Android specific
  android: {
    tick: 'tick',                     // Android only
    click: 'click',                   // Android only
    virtualKey: 'virtualKey',         // Android only
    keyboardTap: 'keyboardTap',       // Android only
    keyboardPress: 'keyboardPress',   // Android only
    keyboardRelease: 'keyboardRelease', // Android only
    textHandleMove: 'textHandleMove', // Android only
    virtualKeyRelease: 'virtualKeyRelease', // Android only
    confirm: 'confirm',               // Android only
    reject: 'reject',                 // Android only
  },
};

// Haptic patterns for mindful interactions
export const hapticPatterns = {
  // Basic interactions
  buttonPress: hapticTypes.impact.light,
  buttonRelease: hapticTypes.impact.soft,
  toggle: hapticTypes.selection,
  
  // Navigation
  screenTransition: hapticTypes.impact.light,
  tabSwitch: hapticTypes.selection,
  modalOpen: hapticTypes.impact.medium,
  modalClose: hapticTypes.impact.light,
  
  // Form interactions
  inputFocus: hapticTypes.selection,
  inputError: hapticTypes.notification.error,
  formSubmit: hapticTypes.notification.success,
  
  // Mindful interactions
  gratitudeEntry: hapticTypes.notification.success,
  meditationStart: hapticTypes.impact.soft,
  meditationEnd: hapticTypes.notification.success,
  breathingPulse: hapticTypes.impact.light,
  
  // Achievements
  streakCelebration: hapticTypes.notification.success,
  levelUp: hapticTypes.impact.heavy,
  badgeUnlock: hapticTypes.notification.success,
  
  // Food interactions
  addIngredient: hapticTypes.impact.medium,
  mealComplete: hapticTypes.notification.success,
  expiryWarning: hapticTypes.notification.warning,
  
  // Gestures
  swipeAction: hapticTypes.impact.light,
  longPressStart: hapticTypes.impact.medium,
  dragStart: hapticTypes.selection,
  dragEnd: hapticTypes.impact.light,
  
  // Error states
  error: hapticTypes.notification.error,
  warning: hapticTypes.notification.warning,
  
  // Custom patterns (arrays of haptic types with delays)
  celebration: [
    { type: hapticTypes.impact.light, delay: 0 },
    { type: hapticTypes.impact.medium, delay: 100 },
    { type: hapticTypes.notification.success, delay: 200 },
  ],
  
  mindfulBreathing: [
    { type: hapticTypes.impact.light, delay: 0 },
    { type: hapticTypes.impact.soft, delay: 2000 },
    { type: hapticTypes.impact.light, delay: 4000 },
  ],
};

// Haptic configuration
export const hapticConfig = {
  // Enable/disable haptics globally
  enabled: true,
  
  // Platform-specific settings
  ios: {
    ignoreAndroidPatterns: true,
  },
  android: {
    enableVibrate: true,
    ignoreNotificationPatterns: true,
  },
};

// Mindful haptic sequences
export const mindfulHapticSequences = {
  // Breathing exercise haptics (4-7-8 pattern)
  breathing478: {
    inhale: [
      { type: hapticTypes.impact.light, delay: 0 },
      { type: hapticTypes.impact.soft, delay: 1000 },
      { type: hapticTypes.impact.soft, delay: 2000 },
      { type: hapticTypes.impact.soft, delay: 3000 },
    ],
    hold: [
      { type: hapticTypes.selection, delay: 0 },
      { type: hapticTypes.selection, delay: 2000 },
      { type: hapticTypes.selection, delay: 4000 },
      { type: hapticTypes.selection, delay: 6000 },
    ],
    exhale: [
      { type: hapticTypes.impact.soft, delay: 0 },
      { type: hapticTypes.impact.light, delay: 2000 },
      { type: hapticTypes.impact.light, delay: 4000 },
      { type: hapticTypes.impact.light, delay: 6000 },
      { type: hapticTypes.impact.light, delay: 7000 },
    ],
  },
  
  // Gratitude moment
  gratitudeMoment: [
    { type: hapticTypes.impact.soft, delay: 0 },
    { type: hapticTypes.impact.medium, delay: 200 },
    { type: hapticTypes.notification.success, delay: 400 },
  ],
  
  // Meal completion celebration
  mealCompleteCelebration: [
    { type: hapticTypes.impact.light, delay: 0 },
    { type: hapticTypes.impact.medium, delay: 150 },
    { type: hapticTypes.impact.heavy, delay: 300 },
    { type: hapticTypes.notification.success, delay: 450 },
  ],
};

// Helper to check if haptic is available
export const isHapticAvailable = () => {
  if (Platform.OS === 'ios') {
    return Platform.Version >= 10;
  }
  if (Platform.OS === 'android') {
    return Platform.Version >= 23; // Android 6.0+
  }
  return false;
};

export default {
  types: hapticTypes,
  patterns: hapticPatterns,
  config: hapticConfig,
  sequences: mindfulHapticSequences,
  isAvailable: isHapticAvailable,
};