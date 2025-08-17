import { Platform } from 'react-native';

// Using a dynamic import to handle the optional dependency
let HapticFeedback: any = null;

try {
  HapticFeedback = require('react-native-haptic-feedback').default;
} catch (error) {
  console.log('Haptic feedback not available');
}

export type HapticType = 
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'selection'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const haptic = {
  trigger: (type: HapticType = 'selection') => {
    if (!HapticFeedback || Platform.OS === 'web') return;
    
    try {
      HapticFeedback.trigger(type, hapticOptions);
    } catch (error) {
      console.log('Haptic feedback error:', error);
    }
  },
  
  impact: {
    light: () => haptic.trigger('impactLight'),
    medium: () => haptic.trigger('impactMedium'),
    heavy: () => haptic.trigger('impactHeavy'),
  },
  
  notification: {
    success: () => haptic.trigger('notificationSuccess'),
    warning: () => haptic.trigger('notificationWarning'),
    error: () => haptic.trigger('notificationError'),
  },
  
  selection: () => haptic.trigger('selection'),
};

// Convenience functions for common interactions
export const hapticFeedback = {
  // Button presses
  buttonPress: () => haptic.impact.light(),
  
  // Navigation
  navigate: () => haptic.selection(),
  tabSwitch: () => haptic.selection(),
  
  // Success states
  success: () => haptic.notification.success(),
  taskComplete: () => haptic.notification.success(),
  
  // Wellness interactions
  breathingStart: () => haptic.impact.medium(),
  breathingPhaseChange: () => haptic.impact.light(),
  breathingComplete: () => haptic.notification.success(),
  
  // Mindful interactions
  gratitudeSaved: () => haptic.notification.success(),
  reflectionComplete: () => haptic.notification.success(),
  milestoneAchieved: () => haptic.impact.heavy(),
  
  // UI feedback
  toggleSwitch: () => haptic.selection(),
  sliderChange: () => haptic.selection(),
  pullToRefresh: () => haptic.impact.light(),
  
  // Error states
  error: () => haptic.notification.error(),
  
  // Long press
  longPress: () => haptic.impact.medium(),
};