// Main export file for MindfulMeals Shared Module
// This module provides common types, utilities, and middleware for all microservices

// Export all types
export * from './types';

// Export all utilities
export * from './utils';

// Export all middleware
export * from './middleware';

// Re-export commonly used items for convenience
export {
  // Base types
  BaseEntity,
  BaseResponse,
  PaginatedResponse,
  ErrorResponse,
  SuccessResponse,
  ValidationError,
  ApiError,
  
  // Domain types
  User,
  UserProfile,
  Household,
  Recipe,
  MealPlan,
  PantryItem,
  Vendor,
  CommunityPost,
  
  // Enums
  IndianRegion,
  DietaryType,
  MindfulnessLevel,
  RecipeCategory,
  RecipeType,
  MealType,
  PlanType,
  ItemCategory,
  VendorType,
  PostType,
  
  // Configuration types
  DatabaseConfig,
  ServerConfig,
  SecurityConfig,
  FeatureFlags,
  
  // Utility types
  UserContext,
  HealthCheck,
  ServiceInfo,
  PerformanceMetrics,
} from './types';

export {
  // Validation utilities
  validateUUID,
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
  validateDate,
  validateRecipe,
  validateMealPlan,
  
  // Common utilities
  generateUUID,
  formatDate,
  formatCurrency,
  capitalize,
  slugify,
  chunk,
  unique,
  groupBy,
  sortBy,
  pick,
  omit,
  deepClone,
  isEmpty,
  isValidEmail,
  isValidPhone,
  formatDuration,
  getTimeAgo,
  retry,
  paginate,
} from './utils';

export {
  // Error handling
  AppError,
  ValidationAppError,
  NotFoundAppError,
  UnauthorizedAppError,
  ForbiddenAppError,
  ConflictAppError,
  RateLimitAppError,
  
  // Middleware
  errorHandler,
  asyncHandler,
  
  // Response helpers
  createErrorResponse,
  createSuccessResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
  createUnauthorizedResponse,
  createForbiddenResponse,
  createConflictResponse,
  createRateLimitResponse,
} from './middleware';
