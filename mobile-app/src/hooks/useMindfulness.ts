import { useState, useEffect, useCallback } from 'react';
import { getRandomMindfulnessQuote, getMindfulnessTip } from '../utils/helpers';

interface MindfulnessState {
  isMindfulMode: boolean;
  currentQuote: string;
  mealReminders: boolean;
  breathingReminders: boolean;
  gratitudeJournal: string[];
}

interface MindfulnessActions {
  toggleMindfulMode: () => void;
  refreshQuote: () => void;
  toggleMealReminders: () => void;
  toggleBreathingReminders: () => void;
  addGratitudeEntry: (entry: string) => void;
  startMindfulEating: () => void;
  pauseForMindfulness: () => Promise<void>;
}

export const useMindfulness = (): [MindfulnessState, MindfulnessActions] => {
  const [state, setState] = useState<MindfulnessState>({
    isMindfulMode: false,
    currentQuote: getRandomMindfulnessQuote(),
    mealReminders: true,
    breathingReminders: true,
    gratitudeJournal: [],
  });

  // Refresh mindfulness quote
  const refreshQuote = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuote: getRandomMindfulnessQuote(),
    }));
  }, []);

  // Toggle mindful mode
  const toggleMindfulMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isMindfulMode: !prev.isMindfulMode,
    }));
  }, []);

  // Toggle meal reminders
  const toggleMealReminders = useCallback(() => {
    setState(prev => ({
      ...prev,
      mealReminders: !prev.mealReminders,
    }));
  }, []);

  // Toggle breathing reminders
  const toggleBreathingReminders = useCallback(() => {
    setState(prev => ({
      ...prev,
      breathingReminders: !prev.breathingReminders,
    }));
  }, []);

  // Add gratitude journal entry
  const addGratitudeEntry = useCallback((entry: string) => {
    setState(prev => ({
      ...prev,
      gratitudeJournal: [
        entry,
        ...prev.gratitudeJournal.slice(0, 9), // Keep last 10 entries
      ],
    }));
  }, []);

  // Start mindful eating session
  const startMindfulEating = useCallback(() => {
    setState(prev => ({
      ...prev,
      isMindfulMode: true,
    }));
    
    // You could add haptic feedback or sound here
    console.log('🧘‍♀️ Mindful eating session started');
  }, []);

  // Pause for mindfulness (breathing exercise)
  const pauseForMindfulness = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      console.log('🫁 Taking a mindful breath...');
      
      // Simulate breathing exercise
      setTimeout(() => {
        console.log('✨ Mindful pause complete');
        resolve();
      }, 3000); // 3 seconds for breathing
    });
  }, []);

  // Auto-refresh quote every hour
  useEffect(() => {
    const interval = setInterval(refreshQuote, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshQuote]);

  const actions: MindfulnessActions = {
    toggleMindfulMode,
    refreshQuote,
    toggleMealReminders,
    toggleBreathingReminders,
    addGratitudeEntry,
    startMindfulEating,
    pauseForMindfulness,
  };

  return [state, actions];
};

// Hook for meal-specific mindfulness
export const useMealMindfulness = (mealType: string) => {
  const [mindfulTips, setMindfulTips] = useState<string[]>([]);
  const [isEatingMindfully, setIsEatingMindfully] = useState(false);

  useEffect(() => {
    // Generate meal-specific mindfulness tips
    const tips = [
      getMindfulnessTip(mealType),
      'Take three deep breaths before starting',
      'Chew each bite 20-30 times',
      'Put down your utensil between bites',
      'Notice the colors, textures, and aromas',
    ];
    setMindfulTips(tips);
  }, [mealType]);

  const startMindfulMeal = useCallback(() => {
    setIsEatingMindfully(true);
    console.log(`🍽️ Starting mindful ${mealType}`);
  }, [mealType]);

  const endMindfulMeal = useCallback(() => {
    setIsEatingMindfully(false);
    console.log(`✨ Mindful ${mealType} complete`);
  }, [mealType]);

  return {
    mindfulTips,
    isEatingMindfully,
    startMindfulMeal,
    endMindfulMeal,
  };
};
