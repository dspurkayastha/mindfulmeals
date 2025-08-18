import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  private static instance: NotificationService;
  private initialized = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async configure() {
    if (this.initialized) return;
    // iOS foreground presentation options
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Android channels
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('mindful-meals-default', {
        name: 'MindfulMeals Notifications',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });

      await Notifications.setNotificationChannelAsync('mindful-meals-gentle', {
        name: 'Gentle Reminders',
        importance: Notifications.AndroidImportance.LOW,
        sound: 'gentle_chime.mp3',
        vibrationPattern: [0, 100],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    this.initialized = true;
  }

  async requestPermissions(): Promise<boolean> {
    const settings = await Notifications.getPermissionsAsync();
    if (!settings.granted) {
      const ask = await Notifications.requestPermissionsAsync();
      return !!ask.granted;
    }
    return true;
  }

  schedulePostMealReflection(mealData: {
    mealId: string;
    mealName: string;
    mealTime: Date;
  }) {
    const notificationTime = new Date(mealData.mealTime);
    notificationTime.setMinutes(notificationTime.getMinutes() + 30);

    Notifications.scheduleNotificationAsync({
      content: {
        title: '🍽️ How was your meal?',
        body: `Take a moment to reflect on ${mealData.mealName}`,
        data: { type: 'post_meal_reflection', data: mealData },
        sound: 'default',
      },
      trigger: notificationTime,
    });

    // Store scheduled notification info
    this.saveScheduledNotification({
      id: `meal-reflection-${mealData.mealId}`,
      type: 'post_meal_reflection',
      scheduledFor: notificationTime,
      data: mealData,
    });
  }

  scheduleBreathingReminder(options: string | {
    title: string;
    body: string;
    trigger: { seconds: number };
    data?: any;
  }, delayMinutes: number = 5) {
    if (typeof options === 'string') {
      // Legacy support
      const notificationTime = new Date();
      notificationTime.setMinutes(notificationTime.getMinutes() + delayMinutes);

      Notifications.scheduleNotificationAsync({
        content: {
          title: '🧘 Time for a mindful breath',
          body: "You've been busy. Let's take a moment to breathe together.",
          data: { type: 'breathing_reminder', data: { context: options } },
          sound: 'default',
        },
        trigger: notificationTime,
      });
    } else {
      // New interface
      const notificationTime = new Date();
      notificationTime.setSeconds(notificationTime.getSeconds() + options.trigger.seconds);

      Notifications.scheduleNotificationAsync({
        content: {
          title: options.title,
          body: options.body,
          data: { type: 'breathing_reminder', ...options.data },
          sound: 'default',
        },
        trigger: notificationTime,
      });
    }
  }

  cancelNotification(notificationId: string) {
    Notifications.cancelScheduledNotificationAsync(notificationId as unknown as string);
    this.removeScheduledNotification(notificationId);
  }

  cancelAllNotifications() {
    Notifications.cancelAllScheduledNotificationsAsync();
    AsyncStorage.removeItem('@scheduled_notifications');
  }

  private async saveScheduledNotification(notification: any) {
    try {
      const stored = await AsyncStorage.getItem('@scheduled_notifications');
      const notifications = stored ? JSON.parse(stored) : [];
      notifications.push(notification);
      await AsyncStorage.setItem(
        '@scheduled_notifications',
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error('Error saving scheduled notification:', error);
    }
  }

  private async removeScheduledNotification(notificationId: string) {
    try {
      const stored = await AsyncStorage.getItem('@scheduled_notifications');
      if (stored) {
        const notifications = JSON.parse(stored);
        const filtered = notifications.filter(
          (n: any) => n.id !== notificationId
        );
        await AsyncStorage.setItem(
          '@scheduled_notifications',
          JSON.stringify(filtered)
        );
      }
    } catch (error) {
      console.error('Error removing scheduled notification:', error);
    }
  }

  async getScheduledNotifications() {
    try {
      const stored = await AsyncStorage.getItem('@scheduled_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}

export default NotificationService.getInstance();