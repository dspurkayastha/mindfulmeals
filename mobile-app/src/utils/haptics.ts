// MindfulMeals Haptic Feedback Utility
// Provides easy-to-use haptic feedback functions

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import hapticTokens from '../design-system/tokens/haptics';

// Bridges token names to expo-haptics API
const trigger = (type: string) => {
  try {
    switch (type) {
      case 'impactLight':
      case 'impactSoft':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
      case 'impactMedium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
      case 'impactHeavy':
      case 'impactRigid':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); break;
      case 'notificationSuccess':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
      case 'notificationWarning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); break;
      case 'notificationError':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
      case 'selection':
      default:
        Haptics.selectionAsync(); break;
    }
  } catch {}
};

const defaultOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

class HapticUtility {
  private enabled: boolean = true;
  
  constructor() {
    this.enabled = hapticTokens.config.enabled && hapticTokens.isAvailable();
  }
  
  // Enable/disable haptics globally
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
  
  // Basic haptic trigger
  private trigger(type: string, options = {}) {
    if (!this.enabled) return;
    
    trigger(type);
  }
  
  // Impact feedback
  impact(type: 'light' | 'medium' | 'heavy' | 'soft' | 'rigid' = 'medium') {
    const hapticType = hapticTokens.types.impact[type];
    if (hapticType) {
      this.trigger(hapticType);
    }
  }
  
  // Notification feedback (iOS only)
  notification(type: 'success' | 'warning' | 'error') {
    if (Platform.OS === 'ios') {
      const hapticType = hapticTokens.types.notification[type];
      if (hapticType) {
        this.trigger(hapticType);
      }
    } else {
      // Fallback for Android
      this.impact(type === 'error' ? 'heavy' : 'medium');
    }
  }
  
  // Selection feedback
  selection() {
    this.trigger(hapticTokens.types.selection);
  }
  
  // Button interactions
  buttonPress() {
    this.trigger(hapticTokens.patterns.buttonPress);
  }
  
  buttonRelease() {
    if (Platform.OS === 'ios') {
      this.trigger(hapticTokens.patterns.buttonRelease);
    }
  }
  
  // Toggle switch
  toggle() {
    this.trigger(hapticTokens.patterns.toggle);
  }
  
  // Navigation
  navigate() {
    this.trigger(hapticTokens.patterns.screenTransition);
  }
  
  tabSwitch() {
    this.trigger(hapticTokens.patterns.tabSwitch);
  }
  
  // Modal interactions
  modalOpen() {
    this.trigger(hapticTokens.patterns.modalOpen);
  }
  
  modalClose() {
    this.trigger(hapticTokens.patterns.modalClose);
  }
  
  // Form interactions
  inputFocus() {
    this.trigger(hapticTokens.patterns.inputFocus);
  }
  
  inputError() {
    this.trigger(hapticTokens.patterns.inputError);
  }
  
  formSuccess() {
    this.trigger(hapticTokens.patterns.formSubmit);
  }
  
  // Mindful interactions
  gratitude() {
    this.trigger(hapticTokens.patterns.gratitudeEntry);
  }
  
  meditationStart() {
    this.trigger(hapticTokens.patterns.meditationStart);
  }
  
  meditationEnd() {
    this.trigger(hapticTokens.patterns.meditationEnd);
  }
  
  breathingPulse() {
    this.trigger(hapticTokens.patterns.breathingPulse);
  }
  
  // Achievement celebrations
  achievement() {
    this.trigger(hapticTokens.patterns.badgeUnlock);
  }
  
  streak() {
    this.trigger(hapticTokens.patterns.streakCelebration);
  }
  
  levelUp() {
    this.trigger(hapticTokens.patterns.levelUp);
  }
  
  // Food interactions
  addIngredient() {
    this.trigger(hapticTokens.patterns.addIngredient);
  }
  
  mealComplete() {
    this.trigger(hapticTokens.patterns.mealComplete);
  }
  
  // Warning
  warning() {
    this.notification('warning');
  }
  
  // Error
  error() {
    this.notification('error');
  }
  
  // Success
  success() {
    this.notification('success');
  }
  
  // Execute haptic sequence
  async sequence(sequence: Array<{ type: string; delay: number }>) {
    if (!this.enabled) return;
    
    for (const step of sequence) {
      if (step.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }
      this.trigger(step.type);
    }
  }
  
  // Mindful breathing haptic sequence
  async breathingSequence(pattern: '478' | 'box' | 'calm' = '478') {
    if (pattern === '478') {
      // 4-7-8 breathing pattern
      await this.sequence(hapticTokens.sequences.breathing478.inhale);
      await this.sequence(hapticTokens.sequences.breathing478.hold);
      await this.sequence(hapticTokens.sequences.breathing478.exhale);
    }
    // Add more patterns as needed
  }
  
  // Celebration sequence
  async celebrate() {
    await this.sequence(hapticTokens.sequences.mealCompleteCelebration);
  }
  
  // Gratitude moment sequence
  async gratitudeMoment() {
    await this.sequence(hapticTokens.sequences.gratitudeMoment);
  }
}

// Export singleton instance
export const haptic = new HapticUtility();

// Export hook for React components
export const useHaptic = () => {
  return haptic;
};

export default haptic;