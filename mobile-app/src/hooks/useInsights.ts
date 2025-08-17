import { useState, useEffect, useCallback } from 'react';
import InsightsEngine from '../services/InsightsEngine';

interface WellnessInsight {
  id: string;
  type: 'meal_mood' | 'energy_pattern' | 'stress_trigger' | 'gratitude_impact' | 'breathing_benefit';
  title: string;
  message: string;
  confidence: number;
  actionable?: string;
  data?: any;
}

export const useInsights = () => {
  const [insights, setInsights] = useState<WellnessInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const generatedInsights = await InsightsEngine.getInstance().generateInsights();
      setInsights(generatedInsights);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading insights:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const refreshInsights = useCallback(async () => {
    await loadInsights();
  }, [loadInsights]);

  const getWeeklySummary = useCallback(async () => {
    try {
      return await InsightsEngine.getInstance().generateWeeklySummary();
    } catch (err) {
      console.error('Error generating weekly summary:', err);
      return null;
    }
  }, []);

  return {
    insights,
    isLoading,
    error,
    refreshInsights,
    getWeeklySummary,
  };
};