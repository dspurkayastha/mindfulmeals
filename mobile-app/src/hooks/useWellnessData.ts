import { useState, useEffect, useCallback } from 'react';
import WellnessService from '../services/WellnessService';

export const useWellnessData = () => {
  const [wellnessData, setWellnessData] = useState(WellnessService.getInstance().getWellnessData());
  const [weeklyStats, setWeeklyStats] = useState(WellnessService.getInstance().getWeeklyStats());
  const [todayGratitude, setTodayGratitude] = useState(WellnessService.getInstance().getTodayGratitude());
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(() => {
    setWellnessData(WellnessService.getInstance().getWellnessData());
    setWeeklyStats(WellnessService.getInstance().getWeeklyStats());
    setTodayGratitude(WellnessService.getInstance().getTodayGratitude());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addMoodEntry = useCallback(async (mood: Parameters<typeof WellnessService.prototype.addMoodEntry>[0], note?: string, linkedMealId?: string) => {
    setIsLoading(true);
    try {
      await WellnessService.getInstance().addMoodEntry(mood, note, linkedMealId);
      refreshData();
    } finally {
      setIsLoading(false);
    }
  }, [refreshData]);

  const addGratitudeEntry = useCallback(async (content: string, linkedMealId?: string) => {
    setIsLoading(true);
    try {
      await WellnessService.getInstance().addGratitudeEntry(content, linkedMealId);
      refreshData();
    } finally {
      setIsLoading(false);
    }
  }, [refreshData]);

  const recordBreathingSession = useCallback(async (duration: number, context: Parameters<typeof WellnessService.prototype.recordBreathingSession>[1], completed: boolean) => {
    setIsLoading(true);
    try {
      await WellnessService.getInstance().recordBreathingSession(duration, context, completed);
      refreshData();
    } finally {
      setIsLoading(false);
    }
  }, [refreshData]);

  const incrementMindfulMeals = useCallback(async () => {
    setIsLoading(true);
    try {
      await WellnessService.getInstance().incrementMindfulMeals();
      refreshData();
    } finally {
      setIsLoading(false);
    }
  }, [refreshData]);

  return {
    wellnessData,
    weeklyStats,
    todayGratitude,
    isLoading,
    addMoodEntry,
    addGratitudeEntry,
    recordBreathingSession,
    incrementMindfulMeals,
    refreshData,
  };
};

export const useWellnessService = () => {
  return {
    saveMoodEntry: WellnessService.getInstance().addMoodEntry.bind(WellnessService.getInstance()),
    saveGratitudeEntry: WellnessService.getInstance().addGratitudeEntry.bind(WellnessService.getInstance()),
    recordBreathingSession: WellnessService.getInstance().recordBreathingSession.bind(WellnessService.getInstance()),
    incrementMindfulMeals: WellnessService.getInstance().incrementMindfulMeals.bind(WellnessService.getInstance()),
  };
};