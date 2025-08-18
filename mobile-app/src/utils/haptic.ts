import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

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
    if (Platform.OS === 'web') return;
    switch (type) {
      case 'impactLight':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'impactMedium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'impactHeavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'notificationSuccess':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'notificationWarning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'notificationError':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
      default:
        Haptics.selectionAsync();
        break;
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