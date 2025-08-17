import { Platform, AccessibilityInfo } from 'react-native';

/**
 * Accessibility utility functions for MindfulMeals
 */

// Minimum touch target size (48x48 for Android, 44x44 for iOS)
export const MIN_TOUCH_TARGET = Platform.OS === 'android' ? 48 : 44;

// Check if screen reader is enabled
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch (error) {
    console.error('Error checking screen reader status:', error);
    return false;
  }
};

// Announce message to screen reader
export const announceForAccessibility = (message: string) => {
  if (Platform.OS === 'ios') {
    AccessibilityInfo.announceForAccessibility(message);
  } else {
    // Android requires a slight delay
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(message);
    }, 100);
  }
};

// Focus on element for accessibility
export const setAccessibilityFocus = (ref: any) => {
  if (ref && ref.current) {
    const reactTag = ref.current._nativeTag || ref.current.getNativeId?.();
    if (reactTag) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  }
};

// Get appropriate hit slop for touch targets
export const getHitSlop = (currentSize: number = 0) => {
  const targetSize = MIN_TOUCH_TARGET;
  const padding = Math.max(0, (targetSize - currentSize) / 2);
  
  return {
    top: padding,
    bottom: padding,
    left: padding,
    right: padding,
  };
};

// Format time for screen readers
export const formatTimeForScreenReader = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} seconds`;
  } else if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} seconds`;
  }
};

// Format percentage for screen readers
export const formatPercentageForScreenReader = (value: number, max: number): string => {
  const percentage = Math.round((value / max) * 100);
  return `${percentage} percent`;
};

// Get mood description for screen readers
export const getMoodAccessibilityLabel = (mood: string): string => {
  const moodDescriptions: Record<string, string> = {
    happy: 'Happy, feeling joyful and content',
    calm: 'Calm, feeling peaceful and relaxed',
    energized: 'Energized, feeling active and motivated',
    grateful: 'Grateful, feeling thankful and appreciative',
    stressed: 'Stressed, feeling tense or overwhelmed',
    tired: 'Tired, feeling low energy or fatigued',
    anxious: 'Anxious, feeling worried or uneasy',
    neutral: 'Neutral, feeling balanced',
  };
  
  return moodDescriptions[mood.toLowerCase()] || mood;
};

// Get nutrition info accessibility label
export const getNutritionAccessibilityLabel = (
  name: string,
  calories?: number,
  protein?: number,
  carbs?: number,
  fat?: number
): string => {
  let label = name;
  
  if (calories) {
    label += `, ${calories} calories`;
  }
  
  if (protein || carbs || fat) {
    label += ' with';
    if (protein) label += ` ${protein} grams of protein`;
    if (carbs) label += `${protein ? ',' : ''} ${carbs} grams of carbohydrates`;
    if (fat) label += `${protein || carbs ? ',' : ''} ${fat} grams of fat`;
  }
  
  return label;
};

// Common accessibility props for interactive elements
export const getAccessibleProps = (
  label: string,
  hint?: string,
  role: 'button' | 'link' | 'text' | 'header' | 'image' = 'button'
) => ({
  accessible: true,
  accessibilityLabel: label,
  accessibilityHint: hint,
  accessibilityRole: role,
});

// Accessibility props for form inputs
export const getInputAccessibilityProps = (
  label: string,
  error?: string,
  required?: boolean
) => ({
  accessible: true,
  accessibilityLabel: `${label}${required ? ', required' : ''}`,
  accessibilityHint: error || `Enter ${label.toLowerCase()}`,
  accessibilityState: {
    disabled: false,
    selected: false,
    ...(error && { invalid: true }),
  },
});

// Accessibility props for loading states
export const getLoadingAccessibilityProps = (loadingMessage: string = 'Loading') => ({
  accessible: true,
  accessibilityLabel: loadingMessage,
  accessibilityRole: 'progressbar' as const,
  accessibilityState: {
    busy: true,
  },
});

// Export all functions
export default {
  MIN_TOUCH_TARGET,
  isScreenReaderEnabled,
  announceForAccessibility,
  setAccessibilityFocus,
  getHitSlop,
  formatTimeForScreenReader,
  formatPercentageForScreenReader,
  getMoodAccessibilityLabel,
  getNutritionAccessibilityLabel,
  getAccessibleProps,
  getInputAccessibilityProps,
  getLoadingAccessibilityProps,
};