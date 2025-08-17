export interface GratitudeEntry {
  id: string;
  text: string;
  mealId?: string;
  context: 'post-cooking' | 'post-meal' | 'daily' | 'spontaneous';
  timestamp: string;
  mood?: 'grateful' | 'peaceful' | 'joyful' | 'content';
  tags?: string[];
}

export interface MoodEntry {
  id: string;
  mood: string;
  context: 'post-meal' | 'morning' | 'evening' | 'general';
  mealId?: string;
  satisfaction?: number;
  notes?: string;
  timestamp: string;
  metadata?: {
    eatingDuration?: number;
    wasMindful?: boolean;
  };
}

export interface WellnessData {
  mood: {
    current: 'great' | 'good' | 'okay' | 'stressed' | 'anxious';
    history: Array<{
      mood: string;
      timestamp: string;
    }>;
  };
  mindfulness: {
    breathingSessions: number;
    meditationMinutes: number;
    gratitudeEntries: number;
    streak: number;
  };
  nutrition: {
    balancedMeals: number;
    mindfulEatingSessions: number;
    waterIntake: number;
  };
  insights: Array<{
    id: string;
    type: 'tip' | 'achievement' | 'recommendation';
    message: string;
    icon: string;
  }>;
}

export interface MindfulEatingSession {
  recipeId: string;
  duration: number; // in seconds
  startTime: Date;
  endTime: Date;
  completed: boolean;
  skipped?: boolean;
}