import Toast from 'react-native-toast-message';
import { TIMINGS } from '@/config/constants';

interface ShowToastOptions {
  type?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
  position?: 'top' | 'bottom';
}

// Mindful toast messages helper
export const showToast = ({
  type = 'info',
  title,
  message,
  duration = TIMINGS.TOAST_DURATION,
  position = 'top',
}: ShowToastOptions) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position,
    visibilityTime: duration,
    autoHide: true,
    topOffset: 50,
    bottomOffset: 40,
  });
};

// Preset mindful toast messages
export const toastPresets = {
  // Success messages
  itemAdded: (itemName: string) => showToast({
    type: 'success',
    title: 'Added mindfully!',
    message: `${itemName} is now in your pantry`,
  }),

  mealPlanned: () => showToast({
    type: 'success',
    title: 'Meal planned!',
    message: 'Enjoy your mindful eating journey',
  }),

  gratitudeRecorded: () => showToast({
    type: 'success',
    title: 'Gratitude recorded 🙏',
    message: 'Thank you for practicing mindfulness',
  }),

  // Info messages
  breathingReminder: () => showToast({
    type: 'info',
    title: 'Take a mindful breath',
    message: 'Pause and center yourself',
  }),

  mealReminder: () => showToast({
    type: 'info',
    title: 'Time for your meal',
    message: 'Remember to eat mindfully',
  }),

  // Error messages
  networkError: () => showToast({
    type: 'error',
    title: 'Connection issue',
    message: 'Please check your internet and try again',
  }),

  validationError: (field: string) => showToast({
    type: 'error',
    title: 'Please check your input',
    message: `${field} is required`,
  }),

  // Encouragement messages
  streakCelebration: (days: number) => showToast({
    type: 'success',
    title: `${days} days of mindful eating! 🎉`,
    message: 'Keep up the wonderful practice',
    duration: 5000,
  }),

  wellnessImprovement: () => showToast({
    type: 'success',
    title: 'Your wellness is improving!',
    message: 'Your mindful choices are making a difference',
  }),
};

// Custom toast configuration
export const toastConfig = {
  success: (props: any) => (
    <Toast.BaseToast
      {...props}
      style={{
        borderLeftColor: '#4CAF50',
        backgroundColor: '#FFFFFF',
        elevation: 5,
        shadowOpacity: 0.1,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
      }}
      text2Style={{
        fontSize: 14,
        color: '#666666',
      }}
    />
  ),
  error: (props: any) => (
    <Toast.BaseToast
      {...props}
      style={{
        borderLeftColor: '#F44336',
        backgroundColor: '#FFFFFF',
        elevation: 5,
        shadowOpacity: 0.1,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
      }}
      text2Style={{
        fontSize: 14,
        color: '#666666',
      }}
    />
  ),
  info: (props: any) => (
    <Toast.BaseToast
      {...props}
      style={{
        borderLeftColor: '#2196F3',
        backgroundColor: '#FFFFFF',
        elevation: 5,
        shadowOpacity: 0.1,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
      }}
      text2Style={{
        fontSize: 14,
        color: '#666666',
      }}
    />
  ),
};