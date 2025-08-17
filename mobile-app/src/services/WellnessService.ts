import AsyncStorage from '@react-native-async-storage/async-storage';
import MilestoneService from './MilestoneService';

interface MoodEntry {
  id: string;
  mood: 'stressed' | 'grateful' | 'energized' | 'calm' | 'neutral';
  timestamp: Date;
  note?: string;
  linkedMealId?: string;
}

interface GratitudeEntry {
  id: string;
  content: string;
  timestamp: Date;
  linkedMealId?: string;
}

interface BreathingSession {
  id: string;
  duration: number; // in seconds
  context: 'pantry' | 'meal' | 'stress' | 'manual';
  timestamp: Date;
  completed: boolean;
}

interface WellnessData {
  moodHistory: MoodEntry[];
  gratitudeEntries: GratitudeEntry[];
  breathingSessions: BreathingSession[];
  mindfulMealsCount: number;
  currentStreak: number;
  totalMindfulMinutes: number;
}

class WellnessService {
  private static instance: WellnessService;
  private wellnessData: WellnessData = {
    moodHistory: [],
    gratitudeEntries: [],
    breathingSessions: [],
    mindfulMealsCount: 0,
    currentStreak: 0,
    totalMindfulMinutes: 0,
  };

  private constructor() {
    this.loadData();
  }

  static getInstance(): WellnessService {
    if (!WellnessService.instance) {
      WellnessService.instance = new WellnessService();
    }
    return WellnessService.instance;
  }

  private async loadData() {
    try {
      const stored = await AsyncStorage.getItem('@wellness_data');
      if (stored) {
        this.wellnessData = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading wellness data:', error);
    }
  }

  private async saveData() {
    try {
      await AsyncStorage.setItem('@wellness_data', JSON.stringify(this.wellnessData));
    } catch (error) {
      console.error('Error saving wellness data:', error);
    }
  }

  async addMoodEntry(mood: MoodEntry['mood'], note?: string, linkedMealId?: string): Promise<void> {
    const entry: MoodEntry = {
      id: Date.now().toString(),
      mood,
      timestamp: new Date(),
      note,
      linkedMealId,
    };
    
    this.wellnessData.moodHistory.push(entry);
    await this.saveData();
    
    // Track milestone if this is part of a meal reflection
    if (linkedMealId) {
      await MilestoneService.getInstance().trackReflection();
      await MilestoneService.getInstance().trackWellnessActivity();
    }
  }

  async addGratitudeEntry(content: string, linkedMealId?: string): Promise<void> {
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      linkedMealId,
    };
    
    this.wellnessData.gratitudeEntries.push(entry);
    await this.saveData();
    
    // Track milestone
    await MilestoneService.getInstance().trackGratitude();
    await MilestoneService.getInstance().trackWellnessActivity();
  }

  async recordBreathingSession(duration: number, context: BreathingSession['context'], completed: boolean): Promise<void> {
    const session: BreathingSession = {
      id: Date.now().toString(),
      duration,
      context,
      timestamp: new Date(),
      completed,
    };
    
    this.wellnessData.breathingSessions.push(session);
    
    if (completed) {
      this.wellnessData.totalMindfulMinutes += Math.round(duration / 60);
      
      // Track milestone
      await MilestoneService.getInstance().trackBreathing();
      await MilestoneService.getInstance().trackWellnessActivity();
    }
    
    await this.saveData();
  }

  async incrementMindfulMeals(): Promise<void> {
    this.wellnessData.mindfulMealsCount++;
    await this.saveData();
  }

  async updateStreak(days: number): Promise<void> {
    this.wellnessData.currentStreak = days;
    await this.saveData();
  }

  getWellnessData(): WellnessData {
    return { ...this.wellnessData };
  }

  getRecentMood(): MoodEntry['mood'] | null {
    if (this.wellnessData.moodHistory.length === 0) return null;
    return this.wellnessData.moodHistory[this.wellnessData.moodHistory.length - 1].mood;
  }

  getTodayGratitude(): GratitudeEntry[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.wellnessData.gratitudeEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  }

  getWeeklyStats() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyMoods = this.wellnessData.moodHistory.filter(
      entry => new Date(entry.timestamp) > weekAgo
    );
    
    const weeklyBreathing = this.wellnessData.breathingSessions.filter(
      session => new Date(session.timestamp) > weekAgo
    );
    
    const weeklyGratitude = this.wellnessData.gratitudeEntries.filter(
      entry => new Date(entry.timestamp) > weekAgo
    );
    
    return {
      moodCount: weeklyMoods.length,
      breathingMinutes: weeklyBreathing.reduce((total, session) => 
        total + (session.completed ? Math.round(session.duration / 60) : 0), 0
      ),
      gratitudeCount: weeklyGratitude.length,
      mostFrequentMood: this.getMostFrequentMood(weeklyMoods),
    };
  }

  private getMostFrequentMood(moods: MoodEntry[]): MoodEntry['mood'] | null {
    if (moods.length === 0) return null;
    
    const counts = moods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<MoodEntry['mood'], number>);
    
    return Object.entries(counts).reduce((a, b) => 
      counts[a[0] as MoodEntry['mood']] > counts[b[0] as MoodEntry['mood']] ? a : b
    )[0] as MoodEntry['mood'];
  }
}

export default WellnessService;