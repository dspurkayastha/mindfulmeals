import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import Toast from 'react-native-toast-message';
import { MEAL_TYPES, MINDFULNESS } from '@/config/constants';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export interface MealPlan {
  id: string;
  date: string;
  mealType: typeof MEAL_TYPES[number];
  recipe: {
    id: string;
    name: string;
    ingredients: Array<{
      ingredientId: string;
      name: string;
      quantity: number;
      unit: string;
    }>;
    calories?: number;
    prepTime?: number;
    cookTime?: number;
    servings: number;
  };
  // Mindfulness features
  moodBefore?: typeof MINDFULNESS.MOOD_OPTIONS[number];
  moodAfter?: typeof MINDFULNESS.MOOD_OPTIONS[number];
  energyBefore?: number;
  energyAfter?: number;
  mealIntention?: string;
  gratitudeNote?: string;
  mindfulnessRating?: number; // 1-5 stars
  createdAt: string;
  updatedAt: string;
}

interface GenerateMealPlanParams {
  startDate: Date;
  endDate: Date;
  preferences?: {
    dietaryRestrictions?: string[];
    cuisinePreferences?: string[];
    calorieTarget?: number;
    excludeIngredients?: string[];
  };
  optimizeForPantry?: boolean;
}

interface MealReflection {
  mealPlanId: string;
  moodAfter: string;
  energyAfter: number;
  gratitudeNote?: string;
  mindfulnessRating?: number;
}

// Get meal plans for a date range
export const useMealPlans = (startDate?: Date, endDate?: Date) => {
  const start = startDate || startOfWeek(new Date());
  const end = endDate || endOfWeek(new Date());

  return useQuery({
    queryKey: ['mealPlans', format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { data } = await apiClient.get<{ mealPlans: MealPlan[] }>('/meal-plans', {
        params: {
          startDate: format(start, 'yyyy-MM-dd'),
          endDate: format(end, 'yyyy-MM-dd'),
        },
      });
      return data.mealPlans;
    },
  });
};

// Get single meal plan
export const useMealPlan = (id: string) => {
  return useQuery({
    queryKey: ['mealPlans', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ mealPlan: MealPlan }>(`/meal-plans/${id}`);
      return data.mealPlan;
    },
    enabled: !!id,
  });
};

// Generate meal plans with AI
export const useGenerateMealPlans = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GenerateMealPlanParams) => {
      const { data } = await apiClient.post<{ mealPlans: MealPlan[] }>(
        '/meal-plans/generate',
        params
      );
      return data.mealPlans;
    },
    onSuccess: (mealPlans) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
      
      // Show mindful success message
      Toast.show({
        type: 'success',
        text1: 'Meal plan created!',
        text2: 'Your mindful meal journey for the week is ready',
        position: 'top',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Could not generate meal plan',
        text2: 'Please try again with different preferences',
        position: 'top',
      });
    },
  });
};

// Update meal plan (swap meals, set intentions)
export const useUpdateMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      ...updates 
    }: Partial<MealPlan> & { id: string }) => {
      const { data } = await apiClient.patch<{ mealPlan: MealPlan }>(
        `/meal-plans/${id}`,
        updates
      );
      return data.mealPlan;
    },
    onSuccess: (updatedPlan) => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
      queryClient.invalidateQueries({ queryKey: ['mealPlans', updatedPlan.id] });
      
      if (updates.mealIntention) {
        Toast.show({
          type: 'success',
          text1: 'Intention set',
          text2: 'Enjoy your meal mindfully',
          position: 'top',
        });
      }
    },
  });
};

// Add meal reflection (post-meal mindfulness)
export const useAddMealReflection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reflection: MealReflection) => {
      const { data } = await apiClient.post<{ mealPlan: MealPlan }>(
        `/meal-plans/${reflection.mealPlanId}/reflection`,
        reflection
      );
      return data.mealPlan;
    },
    onSuccess: (updatedPlan) => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
      queryClient.invalidateQueries({ queryKey: ['mealPlans', updatedPlan.id] });
      
      // Encourage mindful eating
      const messages = [
        'Thank you for eating mindfully!',
        'Great job reflecting on your meal!',
        'Your mindful eating journey continues!',
        'Well done on nourishing body and soul!',
      ];
      
      Toast.show({
        type: 'success',
        text1: messages[Math.floor(Math.random() * messages.length)],
        text2: 'Keep building healthy habits',
        position: 'top',
      });
    },
  });
};

// Get meal plan suggestions based on pantry
export const usePantryOptimizedSuggestions = () => {
  return useQuery({
    queryKey: ['mealSuggestions', 'pantryOptimized'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ 
        suggestions: Array<{
          recipeId: string;
          recipeName: string;
          matchPercentage: number;
          missingIngredients: string[];
        }> 
      }>('/meal-plans/pantry-suggestions');
      return data.suggestions;
    },
  });
};

// Get wellness insights from meal history
export const useMealWellnessInsights = () => {
  return useQuery({
    queryKey: ['mealInsights'],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        insights: {
          averageMoodImprovement: number;
          averageEnergyImprovement: number;
          topMoodBoostingMeals: Array<{ name: string; score: number }>;
          mindfulEatingStreak: number;
          totalMindfulMeals: number;
        };
      }>('/meal-plans/wellness-insights');
      return data.insights;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Delete meal plan
export const useDeleteMealPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/meal-plans/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
      
      Toast.show({
        type: 'info',
        text1: 'Meal removed',
        text2: 'Your meal plan has been updated',
        position: 'top',
      });
    },
  });
};