// Shared types for MindfulMeals backend services

// User & Household Management
export interface HouseholdProfile {
  id: string;
  name: string;
  region: IndianRegion;
  dietaryType: DietaryType;
  budgetMonthly?: number;
  members: UserProfile[];
}

export interface UserProfile {
  id: string;
  householdId: string;
  name: string;
  role: HouseholdRole;
  ageGroup: AgeGroup;
  dietaryRestrictions: DietaryRestriction[];
  healthGoals: HealthGoal[];
  languagePreference: 'hindi' | 'english';
  phone?: string;
}

// Enums
export type IndianRegion = 'north_indian' | 'south_indian' | 'east_indian' | 'west_indian' | 'northeast_indian';
export type DietaryType = 'vegetarian' | 'vegan' | 'mixed' | 'jain' | 'halal';
export type HouseholdRole = 'primary_cook' | 'family_member' | 'child' | 'elder';
export type AgeGroup = 'child' | 'teen' | 'adult' | 'elder';
export type DietaryRestriction = 'diabetic' | 'hypertension' | 'celiac' | 'lactose_intolerant' | 'nut_allergy';
export type HealthGoal = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'energy_boost' | 'gut_health';

// Meal Planning
export interface MealPlan {
  id: string;
  householdId: string;
  weekStarting: Date;
  budgetAllocated?: number;
  meals: PlannedMeal[];
  nutritionalSummary: NutritionalInfo;
  estimatedCost: number;
  mindfulnessScore: number; // 1-10 scale for mindful eating
}

export interface PlannedMeal {
  id: string;
  recipe: Recipe;
  mealDate: Date;
  mealType: MealType;
  servesCount: number;
  estimatedCost: number;
  mindfulnessNotes?: string;
}

export interface Recipe {
  id: string;
  nameEnglish: string;
  nameHindi?: string;
  cuisineType: IndianCuisine;
  mealType: MealType;
  prepTimeMinutes: number;
  difficultyLevel: DifficultyLevel;
  servesCount: number;
  ingredients: RecipeIngredient[];
  instructions: InstructionStep[];
  nutritionalInfo: NutritionalInfo;
  festivalTags: Festival[];
  sourceAttribution: string;
  isUserGenerated: boolean;
  wellnessBenefits: string[];
}

// Enums
export type IndianCuisine = 'north_indian' | 'south_indian' | 'gujarati' | 'bengali' | 'punjabi' | 'rajasthani' | 'maharashtrian';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'expert';
export type Festival = 'diwali' | 'navratri' | 'karwa_chauth' | 'holi' | 'rakhi' | 'ganesh_chaturthi';

// Inventory Management
export interface PantryItem {
  id: string;
  householdId: string;
  ingredient: Ingredient;
  quantity: number;
  unit: string;
  purchaseDate: Date;
  expiryDate?: Date;
  storageLocation: StorageLocation;
  barcode?: string;
  purchaseSource: string;
  mindfulnessReminder?: boolean; // Remind to eat mindfully
}

export interface Ingredient {
  id: string;
  nameEnglish: string;
  nameHindi?: string;
  category: IngredientCategory;
  nutritionPer100g: NutritionalInfo;
  sourceAttribution: string;
  commonUnits: string[];
  wellnessProperties: string[]; // Ayurvedic properties, etc.
}

// Enums
export type IngredientCategory = 'cereals' | 'pulses' | 'vegetables' | 'fruits' | 'spices' | 'dairy' | 'meat' | 'seafood';
export type StorageLocation = 'fridge' | 'pantry' | 'freezer' | 'counter';

// Commerce Integration
export interface CommerceProduct {
  id: string;
  ingredient: Ingredient;
  vendor: QuickCommerceVendor;
  sku: string;
  name: string;
  brand: string;
  quantity: number;
  unit: string;
  price: number; // in paisa
  availability: boolean;
  deliveryEtaMinutes?: number;
  deepLink?: string;
}

export type QuickCommerceVendor = 'blinkit' | 'zepto' | 'swiggy_instamart' | 'local_kirana';

// Nutrition & Wellness
export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

export interface RecipeIngredient {
  ingredient: Ingredient;
  quantity: number;
  unit: string;
}

export interface InstructionStep {
  stepNumber: number;
  instruction: string;
  instructionHindi?: string;
  mindfulnessTip?: string;
  estimatedTimeMinutes: number;
}

// Community Features
export interface CommunityPost {
  id: string;
  userId: string;
  postType: PostType;
  content: string;
  mediaUrls: string[];
  tags: string[];
  votesCount: number;
  createdAt: Date;
  mindfulnessRating: number; // Community rating for mindfulness
}

export type PostType = 'question' | 'tip' | 'challenge_entry' | 'recipe_share' | 'wellness_journey';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
