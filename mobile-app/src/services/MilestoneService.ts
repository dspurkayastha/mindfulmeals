import AsyncStorage from '@react-native-async-storage/async-storage';
import { CelebrationMilestone } from '../components/mindfulness/MicroCelebration';

interface MilestoneProgress {
  pantryItemCount: number;
  mealPlanCount: number;
  gratitudeCount: number;
  gratitudeStreak: number;
  breathingCount: number;
  breathingStreak: number;
  reflectionCount: number;
  lastGratitudeDate?: string;
  lastBreathingDate?: string;
  weeklyWellnessActivities: number;
}

class MilestoneService {
  private static instance: MilestoneService;
  private listeners: ((milestone: CelebrationMilestone) => void)[] = [];

  private constructor() {}

  static getInstance(): MilestoneService {
    if (!MilestoneService.instance) {
      MilestoneService.instance = new MilestoneService();
    }
    return MilestoneService.instance;
  }

  // Subscribe to milestone events
  subscribe(listener: (milestone: CelebrationMilestone) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(milestone: CelebrationMilestone) {
    this.listeners.forEach(listener => listener(milestone));
  }

  async getProgress(): Promise<MilestoneProgress> {
    try {
      const progress = await AsyncStorage.getItem('@milestone_progress');
      return progress ? JSON.parse(progress) : this.getDefaultProgress();
    } catch {
      return this.getDefaultProgress();
    }
  }

  private getDefaultProgress(): MilestoneProgress {
    return {
      pantryItemCount: 0,
      mealPlanCount: 0,
      gratitudeCount: 0,
      gratitudeStreak: 0,
      breathingCount: 0,
      breathingStreak: 0,
      reflectionCount: 0,
      weeklyWellnessActivities: 0,
    };
  }

  private async saveProgress(progress: MilestoneProgress) {
    try {
      await AsyncStorage.setItem('@milestone_progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving milestone progress:', error);
    }
  }

  // Track pantry items
  async trackPantryItem() {
    const progress = await this.getProgress();
    progress.pantryItemCount += 1;

    if (progress.pantryItemCount === 1) {
      this.notifyListeners('first_pantry_item');
    } else if (progress.pantryItemCount === 10) {
      this.notifyListeners('pantry_10_items');
    }

    await this.saveProgress(progress);
  }

  // Track meal plans
  async trackMealPlan() {
    const progress = await this.getProgress();
    progress.mealPlanCount += 1;

    if (progress.mealPlanCount === 1) {
      this.notifyListeners('first_meal_planned');
    }

    await this.saveProgress(progress);
  }

  // Track gratitude entries
  async trackGratitude() {
    const progress = await this.getProgress();
    const today = new Date().toDateString();
    
    progress.gratitudeCount += 1;

    // Check if this is first gratitude
    if (progress.gratitudeCount === 1) {
      this.notifyListeners('first_gratitude');
    }

    // Update streak
    if (progress.lastGratitudeDate) {
      const lastDate = new Date(progress.lastGratitudeDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        progress.gratitudeStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        progress.gratitudeStreak = 1;
      }
      // If same day, don't update streak
    } else {
      progress.gratitudeStreak = 1;
    }

    progress.lastGratitudeDate = today;

    // Check streak milestones
    if (progress.gratitudeStreak === 3) {
      this.notifyListeners('gratitude_streak_3');
    } else if (progress.gratitudeStreak === 7) {
      this.notifyListeners('gratitude_streak_7');
    }

    await this.saveProgress(progress);
  }

  // Track breathing exercises
  async trackBreathing() {
    const progress = await this.getProgress();
    const today = new Date().toDateString();
    
    progress.breathingCount += 1;

    // Update streak
    if (progress.lastBreathingDate) {
      const lastDate = new Date(progress.lastBreathingDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        progress.breathingStreak += 1;
      } else if (diffDays > 1) {
        progress.breathingStreak = 1;
      }
    } else {
      progress.breathingStreak = 1;
    }

    progress.lastBreathingDate = today;

    // Check streak milestones
    if (progress.breathingStreak === 3) {
      this.notifyListeners('breathing_streak_3');
    } else if (progress.breathingStreak === 7) {
      this.notifyListeners('breathing_streak_7');
    }

    await this.saveProgress(progress);
  }

  // Track meal reflections
  async trackReflection() {
    const progress = await this.getProgress();
    progress.reflectionCount += 1;

    if (progress.reflectionCount === 1) {
      this.notifyListeners('first_reflection');
    }

    // Increment weekly wellness activities
    progress.weeklyWellnessActivities += 1;
    await this.checkWeeklyWellness(progress);

    await this.saveProgress(progress);
  }

  // Track any wellness activity for weekly goal
  async trackWellnessActivity() {
    const progress = await this.getProgress();
    progress.weeklyWellnessActivities += 1;
    await this.checkWeeklyWellness(progress);
    await this.saveProgress(progress);
  }

  private async checkWeeklyWellness(progress: MilestoneProgress) {
    // Check if user has completed 7 wellness activities this week
    const weekStart = await this.getWeekStart();
    const lastCelebration = await AsyncStorage.getItem('@last_weekly_celebration');
    
    if (progress.weeklyWellnessActivities >= 7 && lastCelebration !== weekStart) {
      this.notifyListeners('weekly_wellness_complete');
      await AsyncStorage.setItem('@last_weekly_celebration', weekStart);
    }
  }

  private async getWeekStart(): Promise<string> {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff));
    return weekStart.toDateString();
  }

  // Reset weekly counter (call this on week start)
  async resetWeeklyProgress() {
    const progress = await this.getProgress();
    progress.weeklyWellnessActivities = 0;
    await this.saveProgress(progress);
  }

  // Get specific counts for display
  async getCounts() {
    const progress = await this.getProgress();
    return {
      pantryItems: progress.pantryItemCount,
      mealPlans: progress.mealPlanCount,
      gratitudeEntries: progress.gratitudeCount,
      gratitudeStreak: progress.gratitudeStreak,
      breathingSessions: progress.breathingCount,
      breathingStreak: progress.breathingStreak,
      reflections: progress.reflectionCount,
    };
  }
}

export default MilestoneService.getInstance();