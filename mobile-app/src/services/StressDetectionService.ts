import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationState } from '@react-navigation/native';
import NotificationService from './NotificationService';

interface UserActivity {
  timestamp: number;
  type: 'navigation' | 'scroll' | 'tap' | 'screen_time';
  screen?: string;
  metadata?: any;
}

interface StressIndicators {
  navigationSpeed: number; // taps per minute
  scrollVelocity: number; // pixels per second
  screenTime: { [screen: string]: number }; // time spent on each screen
  decisionFatigue: boolean; // 10+ minutes on same screen
  rushPattern: boolean; // rapid navigation between screens
}

class StressDetectionService {
  private static instance: StressDetectionService;
  private activities: UserActivity[] = [];
  private currentScreen: string = '';
  private screenStartTime: number = Date.now();
  private lastScrollTime: number = Date.now();
  private scrollVelocities: number[] = [];
  private isMonitoring: boolean = false;
  private currentStressLevel: number = 0;
  private stressChangeCallbacks: ((level: number) => void)[] = [];

  private readonly STRESS_THRESHOLDS = {
    highNavigationSpeed: 30, // taps per minute
    highScrollVelocity: 500, // pixels per second
    decisionFatigueTime: 600000, // 10 minutes
    rushPatternTime: 5000, // 5 seconds between screens
    activityWindowSize: 60000, // 1 minute window for analysis
    meditationTriggerLevel: 0.7, // Stress level threshold for meditation
  };

  private readonly SMART_TRIGGER_TIMES = {
    afternoon: { hour: 15, minute: 0 }, // 3 PM
    preLunch: { hour: 11, minute: 30 }, // 11:30 AM
    postLunch: { hour: 13, minute: 30 }, // 1:30 PM
    evening: { hour: 18, minute: 30 }, // 6:30 PM
  };

  private constructor() {}

  static getInstance(): StressDetectionService {
    if (!StressDetectionService.instance) {
      StressDetectionService.instance = new StressDetectionService();
    }
    return StressDetectionService.instance;
  }

  startMonitoring() {
    this.isMonitoring = true;
    this.setupTimeBasedTriggers();
    this.cleanOldActivities();
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }

  getCurrentStressLevel(): number {
    return this.currentStressLevel;
  }

  onStressLevelChange(callback: (level: number) => void) {
    this.stressChangeCallbacks.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.stressChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this.stressChangeCallbacks.splice(index, 1);
      }
    };
  }

  private updateStressLevel(level: number) {
    const previousLevel = this.currentStressLevel;
    
    if (Math.abs(previousLevel - level) > 0.05) { // Only update if significant change
      this.currentStressLevel = level;
      this.stressChangeCallbacks.forEach(cb => cb(level));
      
      // Check if we've crossed the meditation threshold
      if (level >= this.STRESS_THRESHOLDS.meditationTriggerLevel && 
          previousLevel < this.STRESS_THRESHOLDS.meditationTriggerLevel) {
        this.triggerMeditationIntervention(level);
      }
    }
  }

  // Track screen navigation
  trackNavigation(state: NavigationState) {
    if (!this.isMonitoring) return;

    const currentRoute = this.getActiveRouteName(state);
    const now = Date.now();

    if (currentRoute !== this.currentScreen) {
      // Track time spent on previous screen
      const timeSpent = now - this.screenStartTime;
      this.recordActivity({
        timestamp: now,
        type: 'screen_time',
        screen: this.currentScreen,
        metadata: { duration: timeSpent },
      });

      // Check for rush pattern
      if (timeSpent < this.STRESS_THRESHOLDS.rushPatternTime) {
        this.recordActivity({
          timestamp: now,
          type: 'navigation',
          screen: currentRoute,
          metadata: { rushPattern: true },
        });
      }

      this.currentScreen = currentRoute;
      this.screenStartTime = now;
    }

    this.analyzeStressPatterns();
  }

  // Track scroll behavior
  trackScroll(velocity: number, screen: string) {
    if (!this.isMonitoring) return;

    const now = Date.now();
    this.scrollVelocities.push(Math.abs(velocity));
    
    // Keep only recent velocities (last 5 seconds)
    if (this.scrollVelocities.length > 50) {
      this.scrollVelocities.shift();
    }

    this.recordActivity({
      timestamp: now,
      type: 'scroll',
      screen,
      metadata: { velocity: Math.abs(velocity) },
    });

    this.lastScrollTime = now;
  }

  // Track tap events
  trackTap(screen: string) {
    if (!this.isMonitoring) return;

    this.recordActivity({
      timestamp: Date.now(),
      type: 'tap',
      screen,
    });
  }

  private recordActivity(activity: UserActivity) {
    this.activities.push(activity);
    this.saveActivities();
  }

  private async saveActivities() {
    try {
      await AsyncStorage.setItem(
        '@stress_activities',
        JSON.stringify(this.activities.slice(-100)) // Keep last 100 activities
      );
    } catch (error) {
      console.error('Error saving stress activities:', error);
    }
  }

  private analyzeStressPatterns() {
    const indicators = this.calculateStressIndicators();
    
    // Calculate stress level (0-1)
    let stressLevel = 0;
    if (indicators.navigationSpeed > this.STRESS_THRESHOLDS.highNavigationSpeed) {
      stressLevel += 0.3;
    }
    if (indicators.scrollVelocity > this.STRESS_THRESHOLDS.highScrollVelocity) {
      stressLevel += 0.2;
    }
    if (indicators.rushPattern) {
      stressLevel += 0.3;
    }
    if (indicators.decisionFatigue) {
      stressLevel += 0.2;
    }
    
    // Update stress level
    this.updateStressLevel(Math.min(stressLevel, 1));
    
    // Check for high stress patterns
    if (stressLevel > 0.5) {
      this.triggerStressIntervention(indicators);
    }
  }

  private calculateStressIndicators(): StressIndicators {
    const now = Date.now();
    const recentActivities = this.activities.filter(
      (a) => now - a.timestamp < this.STRESS_THRESHOLDS.activityWindowSize
    );

    // Navigation speed (taps per minute)
    const taps = recentActivities.filter((a) => a.type === 'tap').length;
    const navigationSpeed = taps;

    // Average scroll velocity
    const avgScrollVelocity =
      this.scrollVelocities.length > 0
        ? this.scrollVelocities.reduce((a, b) => a + b, 0) / this.scrollVelocities.length
        : 0;

    // Screen time analysis
    const screenTime: { [screen: string]: number } = {};
    recentActivities
      .filter((a) => a.type === 'screen_time')
      .forEach((a) => {
        if (a.screen && a.metadata?.duration) {
          screenTime[a.screen] = (screenTime[a.screen] || 0) + a.metadata.duration;
        }
      });

    // Decision fatigue (spending too long on one screen)
    const currentScreenTime = now - this.screenStartTime;
    const decisionFatigue = currentScreenTime > this.STRESS_THRESHOLDS.decisionFatigueTime;

    // Rush pattern detection
    const rushPattern = recentActivities.some(
      (a) => a.type === 'navigation' && a.metadata?.rushPattern
    );

    return {
      navigationSpeed,
      scrollVelocity: avgScrollVelocity,
      screenTime,
      decisionFatigue,
      rushPattern,
    };
  }

  private async triggerStressIntervention(indicators: StressIndicators) {
    // Check if user has disabled stress interventions
    const skipPrefs = await this.checkSkipPreference('stress_intervention');
    if (skipPrefs?.permanentlyDismissed) {
      return;
    }

    const lastIntervention = await this.getLastInterventionTime();
    const now = Date.now();

    // Don't trigger too frequently (minimum 30 minutes between interventions)
    if (lastIntervention && now - lastIntervention < 1800000) {
      return;
    }

    // Determine intervention type based on indicators
    let interventionType = 'general';
    let message = "You seem busy. Let's take a mindful moment together.";

    if (indicators.rushPattern) {
      interventionType = 'rush_pattern';
      message = 'Slow down and breathe. Your meals will wait for you.';
    } else if (indicators.decisionFatigue) {
      interventionType = 'decision_fatigue';
      message = 'Having trouble deciding? A clear mind makes better choices.';
    } else if (indicators.scrollVelocity > this.STRESS_THRESHOLDS.highScrollVelocity) {
      interventionType = 'fast_scrolling';
      message = 'Scrolling quickly? Pause and center yourself.';
    }

    // Schedule breathing reminder
    NotificationService.getInstance().scheduleBreathingReminder({
      title: 'Time for a Mindful Moment',
      body: message,
      trigger: { seconds: 30 },
      data: { 
        interventionType,
        navigateTo: 'BreathingExercise',
        context: 'stress'
      }
    });

    // Save intervention time
    await AsyncStorage.setItem('@last_stress_intervention', now.toString());

    // Log stress event for insights
    await this.logStressEvent(indicators, interventionType);
  }

  private async triggerMeditationIntervention(stressLevel: number) {
    // Check if user has disabled meditation interventions
    const skipPrefs = await this.checkSkipPreference('meditation_intervention');
    if (skipPrefs?.permanentlyDismissed) {
      return;
    }

    const lastMeditation = await this.getLastMeditationTime();
    const now = Date.now();
    
    // Don't trigger too frequently (minimum 1 hour between meditation prompts)
    if (lastMeditation && now - lastMeditation < 3600000) {
      return;
    }
    
    const context = this.getCurrentContext();
    const duration = this.calculateOptimalDuration(stressLevel);
    
    // Determine the message based on stress level
    let message = 'Your stress level is elevated. Let\'s take a mindful break.';
    if (stressLevel > 0.85) {
      message = 'High stress detected. A meditation session can help restore your calm.';
    } else if (stressLevel > 0.75) {
      message = 'Feeling stressed? Let\'s practice some mindful breathing together.';
    }
    
    // Trigger meditation notification
    NotificationService.getInstance().scheduleBreathingReminder({
      title: '🧘 Time for Meditation',
      body: message,
      trigger: { seconds: 5 }, // Show quickly for high stress
      data: {
        type: 'meditation_trigger',
        stressLevel,
        context: context.currentScreen,
        suggestedDuration: duration,
        navigateTo: 'BreathingExercise',
        navigationParams: {
          context: 'stress',
          returnScreen: context.currentScreen,
          duration,
        },
      },
    });
    
    // Save meditation time
    await AsyncStorage.setItem('@last_meditation_trigger', now.toString());
    
    // Log meditation trigger
    await this.logStressEvent({
      navigationSpeed: 0,
      scrollVelocity: 0,
      screenTime: {},
      decisionFatigue: false,
      rushPattern: false,
      stressLevel,
    }, 'meditation_triggered');
  }

  private async getLastMeditationTime(): Promise<number | null> {
    try {
      const time = await AsyncStorage.getItem('@last_meditation_trigger');
      return time ? parseInt(time) : null;
    } catch {
      return null;
    }
  }

  private getCurrentContext() {
    return {
      currentScreen: this.currentScreen,
      timeOnScreen: Date.now() - this.screenStartTime,
      recentActivities: this.activities.slice(-5).map(a => a.type),
    };
  }

  private calculateOptimalDuration(stressLevel: number): number {
    // Calculate meditation duration based on stress level (in minutes)
    if (stressLevel > 0.85) {
      return 10; // High stress: 10 minutes
    } else if (stressLevel > 0.75) {
      return 7; // Moderate-high stress: 7 minutes
    } else {
      return 5; // Moderate stress: 5 minutes
    }
  }

  private async checkSkipPreference(promptId: string): Promise<any> {
    try {
      const prefs = await AsyncStorage.getItem('@mindful_skip_preferences');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        return parsed[promptId];
      }
    } catch (error) {
      console.error('Error checking skip preference:', error);
    }
    return null;
  }

  private async getLastInterventionTime(): Promise<number | null> {
    try {
      const time = await AsyncStorage.getItem('@last_stress_intervention');
      return time ? parseInt(time) : null;
    } catch {
      return null;
    }
  }

  private async logStressEvent(indicators: StressIndicators, intervention: string) {
    try {
      const events = await AsyncStorage.getItem('@stress_events');
      const stressEvents = events ? JSON.parse(events) : [];
      
      stressEvents.push({
        timestamp: Date.now(),
        indicators,
        intervention,
      });

      // Keep last 50 events for insights
      await AsyncStorage.setItem(
        '@stress_events',
        JSON.stringify(stressEvents.slice(-50))
      );
    } catch (error) {
      console.error('Error logging stress event:', error);
    }
  }

  private setupTimeBasedTriggers() {
    // Check every minute for time-based triggers
    setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      Object.entries(this.SMART_TRIGGER_TIMES).forEach(([trigger, time]) => {
        if (currentHour === time.hour && currentMinute === time.minute) {
          this.triggerTimedMeditation(trigger);
        }
      });
    }, 60000); // Check every minute
  }

  private async triggerTimedMeditation(trigger: string) {
    // Check if user has this trigger enabled
    const settings = await this.getMeditationSettings();
    if (!settings[trigger]) return;

    let message = '';
    switch (trigger) {
      case 'afternoon':
        message = "It's 3 PM. Time for your afternoon energy boost.";
        break;
      case 'preLunch':
        message = 'Prepare your body and mind for lunch.';
        break;
      case 'postLunch':
        message = 'Aid your digestion with mindful breathing.';
        break;
      case 'evening':
        message = 'Transition into a peaceful evening.';
        break;
    }

    NotificationService.scheduleBreathingReminder(`timed_${trigger}`, 1);
  }

  private async getMeditationSettings() {
    try {
      const settings = await AsyncStorage.getItem('@meditation_settings');
      return settings ? JSON.parse(settings) : {
        afternoon: true,
        preLunch: true,
        postLunch: true,
        evening: true,
      };
    } catch {
      return {
        afternoon: true,
        preLunch: true,
        postLunch: true,
        evening: true,
      };
    }
  }

  async updateMeditationSettings(settings: any) {
    try {
      await AsyncStorage.setItem('@meditation_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error updating meditation settings:', error);
    }
  }

  private cleanOldActivities() {
    // Remove activities older than 1 hour
    const oneHourAgo = Date.now() - 3600000;
    this.activities = this.activities.filter((a) => a.timestamp > oneHourAgo);
  }

  private getActiveRouteName(state: NavigationState): string {
    const route = state.routes[state.index];
    if (route.state) {
      return this.getActiveRouteName(route.state as NavigationState);
    }
    return route.name;
  }

  async getStressInsights() {
    try {
      const events = await AsyncStorage.getItem('@stress_events');
      const stressEvents = events ? JSON.parse(events) : [];
      
      // Calculate insights
      const totalEvents = stressEvents.length;
      const rushPatterns = stressEvents.filter((e: any) => 
        e.intervention === 'rush_pattern'
      ).length;
      const decisionFatigue = stressEvents.filter((e: any) => 
        e.intervention === 'decision_fatigue'
      ).length;
      
      // Time-based patterns
      const hourlyDistribution = stressEvents.reduce((acc: any, event: any) => {
        const hour = new Date(event.timestamp).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      return {
        totalStressEvents: totalEvents,
        rushPatterns,
        decisionFatigue,
        hourlyDistribution,
        peakStressHour: Object.entries(hourlyDistribution).sort(
          (a: any, b: any) => b[1] - a[1]
        )[0]?.[0] || null,
      };
    } catch {
      return null;
    }
  }
}

export default StressDetectionService.getInstance();