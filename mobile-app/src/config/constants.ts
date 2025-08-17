// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.mindfulmeals.app/api';

// App Configuration
export const APP_NAME = 'MindfulMeals';
export const APP_VERSION = '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@MindfulMeals:token',
  REFRESH_TOKEN: '@MindfulMeals:refreshToken',
  USER_PREFERENCES: '@MindfulMeals:preferences',
  LANGUAGE: '@MindfulMeals:language',
  ONBOARDING_COMPLETE: '@MindfulMeals:onboardingComplete',
  MINDFULNESS_STREAK: '@MindfulMeals:mindfulnessStreak',
};

// Timing Constants (in milliseconds)
export const TIMINGS = {
  TOAST_DURATION: 3000,
  LOADING_DELAY: 300,
  ANIMATION_DURATION: 300,
  HAPTIC_DURATION: 10,
  BREATH_EXERCISE_INHALE: 4000,
  BREATH_EXERCISE_HOLD: 4000,
  BREATH_EXERCISE_EXHALE: 6000,
};

// Mindfulness Features
export const MINDFULNESS = {
  MIN_GRATITUDE_LENGTH: 10,
  DAILY_REFLECTION_HOUR: 20, // 8 PM
  MEDITATION_DURATIONS: [3, 5, 10], // minutes
  MOOD_OPTIONS: ['energized', 'calm', 'satisfied', 'grateful', 'mindful'],
  ENERGY_LEVELS: [1, 2, 3, 4, 5],
};

// Pantry Categories
export const PANTRY_CATEGORIES = [
  'grains',
  'vegetables', 
  'fruits',
  'dairy',
  'protein',
  'spices',
  'oils',
  'nuts',
  'other',
];

// Meal Types
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

// External Services
export const EXTERNAL_SERVICES = {
  BLINKIT: 'https://blinkit.com',
  ZEPTO: 'https://zeptonow.com',
  SWIGGY: 'https://swiggy.com',
};