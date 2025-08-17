export type RootStackParamList = {
  // Auth Stack
  Onboarding: undefined;
  Login: undefined;
  HouseholdSetup: undefined;
  
  // Main Stack
  Main: undefined;
  
  // Wellness Stack
  BreathingExercise: { context?: 'pantry' | 'meal' | 'stress' | 'manual' };
  PostMealReflection: { mealId: string; mealData?: any };
  GratitudeJournal: { mealId?: string };
  WeeklyReport: undefined;
  
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