export type RootStackParamList = {
  // Auth Stack
  Onboarding: undefined;
  Login: undefined;
  HouseholdSetup: undefined;
  
  // Main Stack
  Main: undefined;
  
  // Wellness Stack
  BreathingExercise: { 
    context: 'pantry' | 'meal' | 'shopping' | 'cooking' | 'wellness' | 'stress' | 'manual';
    returnScreen: string;
    duration?: number;
  };
  PostMealReflection: { 
    mealId: string; 
    mealData?: any;
    eatingDuration?: number;
    wasMindful?: boolean;
    fromScreen?: string;
    skippedGratitude?: boolean;
  };
  GratitudeJournal: { mealId?: string };
  WeeklyReport: undefined;
  ReflectionComplete: { mood: string; mealId: string };
  
  // Other Screens
  RecipeDetails: { recipeId: string };
  MealDetails: { mealId: string };
  Scanner: { mode: 'barcode' | 'receipt' };
  AddPantryItem: undefined;
  EditPantryItem: { itemId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Pantry: undefined;
  MealPlanning: undefined;
  Wellness: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}