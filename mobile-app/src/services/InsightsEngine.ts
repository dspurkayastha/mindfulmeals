import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseISO, differenceInDays, format, startOfWeek, endOfWeek } from 'date-fns';

interface MealReflection {
  mealId: string;
  mealName: string;
  mood: string;
  energyLevel: number;
  timestamp: string;
}

interface BreathingSession {
  context: string;
  cycles: number;
  timestamp: string;
}

interface StressEvent {
  timestamp: number;
  indicators: any;
  intervention: string;
}

interface WellnessInsight {
  id: string;
  type: 'meal_mood' | 'energy_pattern' | 'stress_trigger' | 'gratitude_impact' | 'breathing_benefit';
  title: string;
  message: string;
  confidence: number; // 0-1
  actionable?: string;
  data?: any;
}

class InsightsEngine {
  private static instance: InsightsEngine;

  private constructor() {}

  static getInstance(): InsightsEngine {
    if (!InsightsEngine.instance) {
      InsightsEngine.instance = new InsightsEngine();
    }
    return InsightsEngine.instance;
  }

  async generateInsights(): Promise<WellnessInsight[]> {
    const insights: WellnessInsight[] = [];

    // Analyze meal mood patterns
    const mealMoodInsights = await this.analyzeMealMoods();
    insights.push(...mealMoodInsights);

    // Analyze energy patterns
    const energyInsights = await this.analyzeEnergyPatterns();
    insights.push(...energyInsights);

    // Analyze stress patterns
    const stressInsights = await this.analyzeStressPatterns();
    insights.push(...stressInsights);

    // Analyze gratitude impact
    const gratitudeInsights = await this.analyzeGratitudeImpact();
    insights.push(...gratitudeInsights);

    // Analyze breathing benefits
    const breathingInsights = await this.analyzeBreathingBenefits();
    insights.push(...breathingInsights);

    // Sort by confidence and return top insights
    return insights
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  private async analyzeMealMoods(): Promise<WellnessInsight[]> {
    const insights: WellnessInsight[] = [];
    
    try {
      const reflections = await this.getMealReflections();
      if (reflections.length < 5) return insights;

      // Group by meal type and analyze mood patterns
      const mealMoodMap: { [key: string]: { moods: string[], energy: number[] } } = {};
      
      reflections.forEach((reflection) => {
        const mealType = this.getMealType(reflection.mealName);
        if (!mealMoodMap[mealType]) {
          mealMoodMap[mealType] = { moods: [], energy: [] };
        }
        mealMoodMap[mealType].moods.push(reflection.mood);
        mealMoodMap[mealType].energy.push(reflection.energyLevel);
      });

      // Find patterns
      Object.entries(mealMoodMap).forEach(([mealType, data]) => {
        if (data.moods.length >= 3) {
          const mostCommonMood = this.getMostCommon(data.moods);
          const avgEnergy = data.energy.reduce((a, b) => a + b, 0) / data.energy.length;

          if (mostCommonMood === 'energized' && avgEnergy >= 4) {
            insights.push({
              id: `meal_mood_${mealType}`,
              type: 'meal_mood',
              title: `${mealType} meals boost your energy!`,
              message: `You consistently feel energized after ${mealType.toLowerCase()} meals. Keep including these in your meal plans.`,
              confidence: 0.8,
              actionable: `Plan more ${mealType.toLowerCase()} meals this week`,
            });
          } else if (mostCommonMood === 'heavy' && avgEnergy <= 2) {
            insights.push({
              id: `meal_mood_${mealType}_heavy`,
              type: 'meal_mood',
              title: `${mealType} meals may be too heavy`,
              message: `You often feel heavy after ${mealType.toLowerCase()} meals. Consider lighter portions or different ingredients.`,
              confidence: 0.7,
              actionable: 'Try smaller portions or add more vegetables',
            });
          }
        }
      });
    } catch (error) {
      console.error('Error analyzing meal moods:', error);
    }

    return insights;
  }

  private async analyzeEnergyPatterns(): Promise<WellnessInsight[]> {
    const insights: WellnessInsight[] = [];
    
    try {
      const reflections = await this.getMealReflections();
      if (reflections.length < 7) return insights;

      // Group by hour of day
      const hourlyEnergy: { [hour: number]: number[] } = {};
      
      reflections.forEach((reflection) => {
        const hour = new Date(reflection.timestamp).getHours();
        if (!hourlyEnergy[hour]) {
          hourlyEnergy[hour] = [];
        }
        hourlyEnergy[hour].push(reflection.energyLevel);
      });

      // Find energy dips
      let lowestEnergyHour = -1;
      let lowestAvgEnergy = 5;

      Object.entries(hourlyEnergy).forEach(([hour, energyLevels]) => {
        const avgEnergy = energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length;
        if (avgEnergy < lowestAvgEnergy && energyLevels.length >= 2) {
          lowestAvgEnergy = avgEnergy;
          lowestEnergyHour = parseInt(hour);
        }
      });

      if (lowestEnergyHour !== -1 && lowestAvgEnergy < 3) {
        const timeString = lowestEnergyHour > 12 
          ? `${lowestEnergyHour - 12} PM` 
          : `${lowestEnergyHour} ${lowestEnergyHour === 12 ? 'PM' : 'AM'}`;
        
        insights.push({
          id: 'energy_dip_pattern',
          type: 'energy_pattern',
          title: `Energy dip around ${timeString}`,
          message: `Your energy tends to drop around ${timeString}. A breathing exercise or light snack might help.`,
          confidence: 0.75,
          actionable: 'Schedule a mindful break at this time',
          data: { hour: lowestEnergyHour, avgEnergy: lowestAvgEnergy },
        });
      }
    } catch (error) {
      console.error('Error analyzing energy patterns:', error);
    }

    return insights;
  }

  private async analyzeStressPatterns(): Promise<WellnessInsight[]> {
    const insights: WellnessInsight[] = [];
    
    try {
      const stressEvents = await this.getStressEvents();
      if (stressEvents.length < 3) return insights;

      // Count intervention types
      const interventionCounts: { [key: string]: number } = {};
      stressEvents.forEach((event) => {
        interventionCounts[event.intervention] = (interventionCounts[event.intervention] || 0) + 1;
      });

      // Find most common stress pattern
      const mostCommon = Object.entries(interventionCounts)
        .sort(([, a], [, b]) => b - a)[0];

      if (mostCommon && mostCommon[1] >= 3) {
        const [pattern, count] = mostCommon;
        let message = '';
        let actionable = '';

        switch (pattern) {
          case 'rush_pattern':
            message = 'You often rush between screens. Try to slow down and be more intentional.';
            actionable = 'Take 3 deep breaths before switching tasks';
            break;
          case 'decision_fatigue':
            message = 'You sometimes get stuck making decisions. Simplifying choices might help.';
            actionable = 'Plan meals in advance to reduce daily decisions';
            break;
          case 'fast_scrolling':
            message = 'Fast scrolling detected frequently. This might indicate stress or overwhelm.';
            actionable = 'Try the 4-4-4 breathing exercise when feeling rushed';
            break;
        }

        insights.push({
          id: `stress_pattern_${pattern}`,
          type: 'stress_trigger',
          title: 'Stress Pattern Detected',
          message,
          confidence: Math.min(count / 10, 0.9),
          actionable,
        });
      }
    } catch (error) {
      console.error('Error analyzing stress patterns:', error);
    }

    return insights;
  }

  private async analyzeGratitudeImpact(): Promise<WellnessInsight[]> {
    const insights: WellnessInsight[] = [];
    
    try {
      const gratitudeEntries = await this.getGratitudeEntries();
      const reflections = await this.getMealReflections();

      if (gratitudeEntries.length >= 5 && reflections.length >= 5) {
        // Check if gratitude practice correlates with better moods
        const gratitudeDays = new Set(
          gratitudeEntries.map(e => format(parseISO(e.timestamp), 'yyyy-MM-dd'))
        );

        let moodScoreWithGratitude = 0;
        let moodScoreWithoutGratitude = 0;
        let countWith = 0;
        let countWithout = 0;

        reflections.forEach((reflection) => {
          const day = format(parseISO(reflection.timestamp), 'yyyy-MM-dd');
          const moodScore = this.getMoodScore(reflection.mood);
          
          if (gratitudeDays.has(day)) {
            moodScoreWithGratitude += moodScore;
            countWith++;
          } else {
            moodScoreWithoutGratitude += moodScore;
            countWithout++;
          }
        });

        if (countWith >= 3 && countWithout >= 3) {
          const avgWith = moodScoreWithGratitude / countWith;
          const avgWithout = moodScoreWithoutGratitude / countWithout;

          if (avgWith > avgWithout * 1.2) {
            insights.push({
              id: 'gratitude_mood_boost',
              type: 'gratitude_impact',
              title: 'Gratitude boosts your mood!',
              message: 'Days with gratitude practice show 20% better meal satisfaction. Keep it up!',
              confidence: 0.85,
              actionable: 'Continue your daily gratitude practice',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing gratitude impact:', error);
    }

    return insights;
  }

  private async analyzeBreathingBenefits(): Promise<WellnessInsight[]> {
    const insights: WellnessInsight[] = [];
    
    try {
      const sessions = await this.getBreathingSessions();
      if (sessions.length < 5) return insights;

      // Analyze contexts where breathing is most used
      const contextCounts: { [key: string]: number } = {};
      sessions.forEach((session) => {
        contextCounts[session.context] = (contextCounts[session.context] || 0) + 1;
      });

      const mostUsedContext = Object.entries(contextCounts)
        .sort(([, a], [, b]) => b - a)[0];

      if (mostUsedContext && mostUsedContext[1] >= 3) {
        const [context, count] = mostUsedContext;
        let contextName = context.replace(/_/g, ' ');

        insights.push({
          id: `breathing_context_${context}`,
          type: 'breathing_benefit',
          title: `Breathing helps with ${contextName}`,
          message: `You've used breathing exercises ${count} times for ${contextName}. This is becoming a healthy habit!`,
          confidence: 0.7,
          actionable: 'Set a reminder for your breathing practice',
        });
      }

      // Check average cycles completed
      const avgCycles = sessions.reduce((sum, s) => sum + s.cycles, 0) / sessions.length;
      if (avgCycles >= 4) {
        insights.push({
          id: 'breathing_dedication',
          type: 'breathing_benefit',
          title: 'Strong breathing practice!',
          message: 'You complete an average of 4+ breathing cycles. This dedication is improving your wellbeing.',
          confidence: 0.8,
        });
      }
    } catch (error) {
      console.error('Error analyzing breathing benefits:', error);
    }

    return insights;
  }

  // Helper methods
  private async getMealReflections(): Promise<MealReflection[]> {
    try {
      const stored = await AsyncStorage.getItem('@meal_reflections');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private async getStressEvents(): Promise<StressEvent[]> {
    try {
      const stored = await AsyncStorage.getItem('@stress_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private async getGratitudeEntries(): Promise<any[]> {
    try {
      const stored = await AsyncStorage.getItem('@gratitude_entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private async getBreathingSessions(): Promise<BreathingSession[]> {
    try {
      const stored = await AsyncStorage.getItem('@breathing_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private getMealType(mealName: string): string {
    const name = mealName.toLowerCase();
    if (name.includes('salad') || name.includes('vegetable')) return 'Vegetarian';
    if (name.includes('chicken') || name.includes('fish')) return 'Protein';
    if (name.includes('pasta') || name.includes('rice')) return 'Carbs';
    if (name.includes('soup')) return 'Soup';
    return 'Mixed';
  }

  private getMostCommon<T>(arr: T[]): T {
    const counts = arr.reduce((acc, val) => {
      acc[val as any] = (acc[val as any] || 0) + 1;
      return acc;
    }, {} as any);
    
    return Object.entries(counts)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0][0] as T;
  }

  private getMoodScore(mood: string): number {
    switch (mood) {
      case 'energized': return 5;
      case 'satisfied': return 4;
      case 'heavy': return 2;
      case 'still_hungry': return 2;
      default: return 3;
    }
  }

  // Get weekly summary data for reports
  async getWeeklySummary() {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const reflections = await this.getMealReflections();
    const gratitudeEntries = await this.getGratitudeEntries();
    const breathingSessions = await this.getBreathingSessions();

    // Filter to this week
    const weeklyReflections = reflections.filter(r => {
      const date = parseISO(r.timestamp);
      return date >= weekStart && date <= weekEnd;
    });

    const weeklyGratitude = gratitudeEntries.filter(g => {
      const date = parseISO(g.timestamp);
      return date >= weekStart && date <= weekEnd;
    });

    const weeklyBreathing = breathingSessions.filter(b => {
      const date = parseISO(b.timestamp);
      return date >= weekStart && date <= weekEnd;
    });

    // Calculate averages and totals
    const avgEnergy = weeklyReflections.length > 0
      ? weeklyReflections.reduce((sum, r) => sum + r.energyLevel, 0) / weeklyReflections.length
      : 0;

    const moodCounts = weeklyReflections.reduce((acc, r) => {
      acc[r.mood] = (acc[r.mood] || 0) + 1;
      return acc;
    }, {} as any);

    const totalBreathingMinutes = weeklyBreathing.reduce((sum, b) => sum + (b.cycles * 12 / 60), 0);

    return {
      reflectionCount: weeklyReflections.length,
      gratitudeCount: weeklyGratitude.length,
      breathingSessionCount: weeklyBreathing.length,
      avgEnergyLevel: avgEnergy,
      moodDistribution: moodCounts,
      totalBreathingMinutes: Math.round(totalBreathingMinutes),
      topInsights: await this.generateInsights(),
    };
  }
}

export default InsightsEngine.getInstance();