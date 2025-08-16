// Domain-specific types used across MindfulMeals microservices

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  bio?: string;
  interests: string[];
  dietaryPreferences: string[];
  healthGoals: string[];
  cookingExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredCuisines: string[];
  spiceTolerance: 'low' | 'medium' | 'high';
  timeZone: string;
  language: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  mealReminders: boolean;
  mindfulnessPrompts: boolean;
  culturalUpdates: boolean;
  healthTips: boolean;
  communityUpdates: boolean;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  os: string;
  browser: string;
  version: string;
  deviceId?: string;
}

export interface TwoFactorSecret {
  id: string;
  userId: string;
  secret: string;
  backupCodes: string[];
  isEnabled: boolean;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Household Types
export interface Household {
  id: string;
  name: string;
  description?: string;
  region: IndianRegion;
  dietaryType: DietaryType;
  mindfulnessLevel: MindfulnessLevel;
  budget?: number;
  currency: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum IndianRegion {
  PUNJAB = 'punjab',
  HARYANA = 'haryana',
  DELHI = 'delhi',
  UTTAR_PRADESH = 'uttar_pradesh',
  UTTARAKHAND = 'uttarakhand',
  HIMACHAL_PRADESH = 'himachal_pradesh',
  JAMMU_KASHMIR = 'jammu_kashmir',
  LADAKH = 'ladakh',
  RAJASTHAN = 'rajasthan',
  MADHYA_PRADESH = 'madhya_pradesh',
  CHHATTISGARH = 'chhattisgarh',
  JHARKHAND = 'jharkhand',
  BIHAR = 'bihar',
  WEST_BENGAL = 'west_bengal',
  ODISHA = 'odisha',
  ASSAM = 'assam',
  ARUNACHAL_PRADESH = 'arunachal_pradesh',
  NAGALAND = 'nagaland',
  MANIPUR = 'manipur',
  MIZORAM = 'mizoram',
  TRIPURA = 'tripura',
  MEGHALAYA = 'meghalaya',
  SIKKIM = 'sikkim',
  MAHARASHTRA = 'maharashtra',
  GUJARAT = 'gujarat',
  GOA = 'goa',
  KARNATAKA = 'karnataka',
  TAMIL_NADU = 'tamil_nadu',
  KERALA = 'kerala',
  ANDHRA_PRADESH = 'andhra_pradesh',
  TELANGANA = 'telangana',
  CHANDIGARH = 'chandigarh',
  DADRA_NAGAR_HAVELI = 'dadra_nagar_haveli',
  DAMAN_DIU = 'daman_diu',
  LAKSHADWEEP = 'lakshadweep',
  PUDUCHERRY = 'puducherry',
  ANDAMAN_NICOBAR = 'andaman_nicobar',
}

export enum DietaryType {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  NON_VEGETARIAN = 'non_vegetarian',
  EGGETARIAN = 'eggetarian',
  JAIN = 'jain',
  HALAL = 'halal',
  KOSHER = 'kosher',
  GLUTEN_FREE = 'gluten_free',
  DAIRY_FREE = 'dairy_free',
  NUT_FREE = 'nut_free',
  FLEXITARIAN = 'flexitarian',
}

export enum MindfulnessLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export interface HouseholdMember {
  id: string;
  householdId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  permissions: string[];
  joinedAt: Date;
  isActive: boolean;
}

// Recipe Types
export interface Recipe {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  category: RecipeCategory;
  type: RecipeType;
  difficulty: RecipeDifficulty;
  mindfulnessLevel: MindfulnessLevel;
  servings: number;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  story?: string;
  imageUrl?: string;
  isActive: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum RecipeCategory {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACKS = 'snacks',
  DESSERTS = 'desserts',
  BEVERAGES = 'beverages',
  APPETIZERS = 'appetizers',
  SOUPS = 'soups',
  SALADS = 'salads',
  BREADS = 'breads',
  RICE_DISHES = 'rice_dishes',
  CURRIES = 'curries',
  STREET_FOOD = 'street_food',
  FESTIVAL_SPECIAL = 'festival_special',
}

export enum RecipeType {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  NON_VEGETARIAN = 'non_vegetarian',
  EGGETARIAN = 'eggetarian',
  JAIN = 'jain',
  HALAL = 'halal',
  KOSHER = 'kosher',
  GLUTEN_FREE = 'gluten_free',
  DAIRY_FREE = 'dairy_free',
  NUT_FREE = 'nut_free',
  LOW_CARB = 'low_carb',
  KETO = 'keto',
  PALEO = 'paleo',
  AYURVEDIC = 'ayurvedic',
}

export enum RecipeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  role: IngredientRole;
  type: IngredientType;
  order: number;
  isOptional: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum IngredientRole {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SEASONING = 'seasoning',
  GARNISH = 'garnish',
  OPTIONAL = 'optional',
  SUBSTITUTE = 'substitute',
}

export enum IngredientType {
  VEGETABLE = 'vegetable',
  FRUIT = 'fruit',
  GRAIN = 'grain',
  LEGUME = 'legume',
  DAIRY = 'dairy',
  MEAT = 'meat',
  FISH = 'fish',
  EGG = 'egg',
  NUT = 'nut',
  SEED = 'seed',
  SPICE = 'spice',
  HERB = 'herb',
  OIL = 'oil',
  SWEETENER = 'sweetener',
  CONDIMENT = 'condiment',
  BEVERAGE = 'beverage',
  PROCESSED = 'processed',
}

export interface RecipeStep {
  id: string;
  recipeId: string;
  order: number;
  title: string;
  description: string;
  type: StepType;
  estimatedTime: number;
  isOptional: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum StepType {
  PREPARATION = 'preparation',
  COOKING = 'cooking',
  ASSEMBLY = 'assembly',
  GARNISHING = 'garnishing',
  SERVING = 'serving',
  CLEANUP = 'cleanup',
}

// Meal Planning Types
export interface MealPlan {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  planType: PlanType;
  status: PlanStatus;
  date: Date;
  endDate?: Date;
  mealType: MealType;
  recipeId?: string;
  customMealName?: string;
  customMealDescription?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum MealType {
  BREAKFAST = 'breakfast',
  MORNING_SNACK = 'morning_snack',
  LUNCH = 'lunch',
  AFTERNOON_SNACK = 'afternoon_snack',
  DINNER = 'dinner',
  EVENING_SNACK = 'evening_snack',
  LATE_NIGHT = 'late_night',
}

export enum PlanType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
  FESTIVAL = 'festival',
  SEASONAL = 'seasonal',
  HEALTH_GOAL = 'health_goal',
  MINDFULNESS = 'mindfulness',
}

export enum PlanStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

// Mindfulness Types
export interface MindfulnessTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: MindfulnessCategory;
  practices: MindfulnessPractice[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum MindfulnessCategory {
  GRATITUDE = 'gratitude',
  PRESENCE = 'presence',
  JOY = 'joy',
  LOVE = 'love',
  PATIENCE = 'patience',
  COMPASSION = 'compassion',
  WISDOM = 'wisdom',
  BALANCE = 'balance',
  HARMONY = 'harmony',
  PEACE = 'peace',
}

export interface MindfulnessPractice {
  id: string;
  themeId: string;
  type: PracticeType;
  title: string;
  description: string;
  duration: number;
  instructions: string[];
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PracticeType {
  MEDITATION = 'meditation',
  BREATHING = 'breathing',
  GRATITUDE = 'gratitude',
  SENSORY = 'sensory',
  MOVEMENT = 'movement',
  REFLECTION = 'reflection',
}

// Inventory Types
export interface PantryItem {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  category: ItemCategory;
  status: ItemStatus;
  quantity: number;
  unit: string;
  storageLocation: StorageLocation;
  expiryDate?: Date;
  purchaseDate?: Date;
  price?: number;
  brand?: string;
  barcode?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ItemCategory {
  GRAINS = 'grains',
  PULSES = 'pulses',
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits',
  DAIRY = 'dairy',
  MEAT = 'meat',
  FISH = 'fish',
  EGGS = 'eggs',
  NUTS = 'nuts',
  SEEDS = 'seeds',
  SPICES = 'spices',
  HERBS = 'herbs',
  OILS = 'oils',
  SWEETENERS = 'sweeteners',
  CONDIMENTS = 'condiments',
  BEVERAGES = 'beverages',
  SNACKS = 'snacks',
  FROZEN = 'frozen',
  CANNED = 'canned',
  PROCESSED = 'processed',
}

export enum ItemStatus {
  FRESH = 'fresh',
  GOOD = 'good',
  EXPIRING_SOON = 'expiring_soon',
  EXPIRED = 'expired',
  SPOILED = 'spoiled',
  CONSUMED = 'consumed',
  WASTED = 'wasted',
}

export enum StorageLocation {
  REFRIGERATOR = 'refrigerator',
  FREEZER = 'freezer',
  PANTRY = 'pantry',
  COUNTERTOP = 'countertop',
  CABINET = 'cabinet',
  DRAWER = 'drawer',
  BASEMENT = 'basement',
  GARAGE = 'garage',
  OUTDOOR = 'outdoor',
}

// Commerce Types
export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  description?: string;
  logoUrl?: string;
  website?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  deepLinkScheme?: string;
  supportedRegions: string[];
  features: string[];
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum VendorType {
  QUICK_COMMERCE = 'quick_commerce',
  GROCERY = 'grocery',
  RESTAURANT = 'restaurant',
  PHARMACY = 'pharmacy',
  SPECIALTY = 'specialty',
  LOCAL = 'local',
}

export interface VendorPreference {
  id: string;
  userId: string;
  vendorId: string;
  preference: 'favorite' | 'frequent' | 'occasional' | 'avoid';
  lastUsed?: Date;
  usageCount: number;
  rating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Community Types
export interface CommunityPost {
  id: string;
  userId: string;
  householdId: string;
  type: PostType;
  title: string;
  content: string;
  images?: string[];
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isPublic: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostType {
  RECIPE = 'recipe',
  TIP = 'tip',
  QUESTION = 'question',
  STORY = 'story',
  REVIEW = 'review',
  EVENT = 'event',
  CHALLENGE = 'challenge',
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
  likes: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Health and Nutrition Types
export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins: string[];
  minerals: string[];
  glycemicIndex?: number;
  satietyIndex?: number;
}

export interface HealthGoal {
  id: string;
  userId: string;
  type: GoalType;
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
  progress: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum GoalType {
  WEIGHT_LOSS = 'weight_loss',
  WEIGHT_GAIN = 'weight_gain',
  MAINTENANCE = 'maintenance',
  MUSCLE_GAIN = 'muscle_gain',
  ENERGY_BOOST = 'energy_boost',
  BLOOD_SUGAR = 'blood_sugar',
  CHOLESTEROL = 'cholesterol',
  BLOOD_PRESSURE = 'blood_pressure',
  DIGESTIVE_HEALTH = 'digestive_health',
  IMMUNITY = 'immunity',
}
