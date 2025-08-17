import PushNotification from 'react-native-push-notification';
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

  configure() {
    if (this.initialized) return;

    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        
        // Handle notification tap
        if (notification.userInteraction) {
          // Navigate to appropriate screen based on notification data
          const { type, data } = notification.data || {};
          
          switch (type) {
            case 'post_meal_reflection':
              // Navigate to reflection screen
              // NavigationService.navigate('PostMealReflection', data);
              break;
            case 'breathing_reminder':
              // Navigate to breathing exercise
              // NavigationService.navigate('BreathingExercise', data);
              break;
          }
        }

        // Required on iOS only
        notification.finish('backgroundFetchResultNewData');
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channels for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'mindful-meals-default',
          channelName: 'MindfulMeals Notifications',
          channelDescription: 'Mindful reminders and reflections',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`createChannel returned '${created}'`)
      );

      PushNotification.createChannel(
        {
          channelId: 'mindful-meals-gentle',
          channelName: 'Gentle Reminders',
          channelDescription: 'Soft mindfulness prompts',
          soundName: 'gentle_chime.mp3',
          importance: 2,
          vibrate: false,
        },
        (created) => console.log(`createChannel returned '${created}'`)
      );
    }

    this.initialized = true;
  }

  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        if (!permissions.alert) {
          PushNotification.requestPermissions().then((granted) => {
            resolve(granted.alert === 1);
          });
        } else {
          resolve(true);
        }
      });
    });
  }

  schedulePostMealReflection(mealData: {
    mealId: string;
    mealName: string;
    mealTime: Date;
  }) {
    const notificationTime = new Date(mealData.mealTime);
    notificationTime.setMinutes(notificationTime.getMinutes() + 30);

    PushNotification.localNotificationSchedule({
      id: `meal-reflection-${mealData.mealId}`,
      channelId: 'mindful-meals-gentle',
      title: '🍽️ How was your meal?',
      message: `Take a moment to reflect on ${mealData.mealName}`,
      date: notificationTime,
      allowWhileIdle: true,
      data: {
        type: 'post_meal_reflection',
        data: mealData,
      },
      userInfo: {
        mealId: mealData.mealId,
      },
    });

    // Store scheduled notification info
    this.saveScheduledNotification({
      id: `meal-reflection-${mealData.mealId}`,
      type: 'post_meal_reflection',
      scheduledFor: notificationTime,
      data: mealData,
    });
  }

  scheduleBreathingReminder(context: string, delayMinutes: number = 5) {
    const notificationTime = new Date();
    notificationTime.setMinutes(notificationTime.getMinutes() + delayMinutes);

    PushNotification.localNotificationSchedule({
      id: `breathing-${context}-${Date.now()}`,
      channelId: 'mindful-meals-gentle',
      title: '🧘 Time for a mindful breath',
      message: "You've been busy. Let's take a moment to breathe together.",
      date: notificationTime,
      allowWhileIdle: true,
      data: {
        type: 'breathing_reminder',
        data: { context },
      },
    });
  }

  cancelNotification(notificationId: string) {
    PushNotification.cancelLocalNotification(notificationId);
    this.removeScheduledNotification(notificationId);
  }

  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
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