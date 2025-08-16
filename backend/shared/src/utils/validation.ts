// Shared validation utilities for MindfulMeals microservices

import Joi from 'joi';
import { ValidationError } from '../types';

// Common validation schemas
export const commonSchemas = {
  uuid: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(), // Indian phone format
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(500).optional(),
  url: Joi.string().uri().optional(),
  date: Joi.date().iso().required(),
  boolean: Joi.boolean().required(),
  number: Joi.number().min(0).required(),
  integer: Joi.number().integer().min(0).required(),
  array: Joi.array().min(1).required(),
  object: Joi.object().required(),
};

// Validation functions
export const validateUUID = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Indian phone number validation
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (name: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (name.length > 50) {
    errors.push('Name must be less than 50 characters');
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push('Name can only contain letters and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateDate = (date: string | Date): boolean => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  return startDate < endDate;
};

export const validateQuantity = (quantity: number, unit: string): boolean => {
  if (quantity <= 0) return false;
  
  // Validate based on unit type
  const weightUnits = ['kg', 'g', 'lb', 'oz'];
  const volumeUnits = ['l', 'ml', 'gal', 'qt', 'pt', 'cup', 'tbsp', 'tsp'];
  const countUnits = ['piece', 'pieces', 'pcs', 'unit', 'units'];
  
  if (weightUnits.includes(unit) && quantity > 1000) return false; // Max 1000 kg
  if (volumeUnits.includes(unit) && quantity > 1000) return false; // Max 1000 L
  if (countUnits.includes(unit) && quantity > 10000) return false; // Max 10000 pieces
  
  return true;
};

export const validatePrice = (price: number): boolean => {
  return price >= 0 && price <= 100000; // Max 1 lakh INR
};

export const validateRating = (rating: number): boolean => {
  return rating >= 0 && rating <= 5;
};

export const validatePercentage = (percentage: number): boolean => {
  return percentage >= 0 && percentage <= 100;
};

// Complex validation functions
export const validateAddress = (address: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!address.street || address.street.length < 5) {
    errors.push('Street address must be at least 5 characters');
  }
  
  if (!address.city || address.city.length < 2) {
    errors.push('City must be at least 2 characters');
  }
  
  if (!address.state || address.state.length < 2) {
    errors.push('State must be at least 2 characters');
  }
  
  if (!address.pincode || !/^\d{6}$/.test(address.pincode)) {
    errors.push('Pincode must be 6 digits');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateNutritionalInfo = (nutrition: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (nutrition.calories && (nutrition.calories < 0 || nutrition.calories > 5000)) {
    errors.push('Calories must be between 0 and 5000');
  }
  
  if (nutrition.protein && (nutrition.protein < 0 || nutrition.protein > 200)) {
    errors.push('Protein must be between 0 and 200g');
  }
  
  if (nutrition.carbs && (nutrition.carbs < 0 || nutrition.carbs > 1000)) {
    errors.push('Carbs must be between 0 and 1000g');
  }
  
  if (nutrition.fat && (nutrition.fat < 0 || nutrition.fat > 200)) {
    errors.push('Fat must be between 0 and 200g');
  }
  
  if (nutrition.fiber && (nutrition.fiber < 0 || nutrition.fiber > 100)) {
    errors.push('Fiber must be between 0 and 100g');
  }
  
  if (nutrition.sugar && (nutrition.sugar < 0 || nutrition.sugar > 500)) {
    errors.push('Sugar must be between 0 and 500g');
  }
  
  if (nutrition.sodium && (nutrition.sodium < 0 || nutrition.sodium > 5000)) {
    errors.push('Sodium must be between 0 and 5000mg');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRecipe = (recipe: any): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];
  
  if (!recipe.name || recipe.name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Recipe name must be at least 3 characters',
      value: recipe.name,
    });
  }
  
  if (!recipe.category) {
    errors.push({
      field: 'category',
      message: 'Recipe category is required',
      value: recipe.category,
    });
  }
  
  if (!recipe.type) {
    errors.push({
      field: 'type',
      message: 'Recipe type is required',
      value: recipe.type,
    });
  }
  
  if (recipe.servings && (recipe.servings < 1 || recipe.servings > 50)) {
    errors.push({
      field: 'servings',
      message: 'Servings must be between 1 and 50',
      value: recipe.servings,
    });
  }
  
  if (recipe.prepTime && (recipe.prepTime < 0 || recipe.prepTime > 480)) {
    errors.push({
      field: 'prepTime',
      message: 'Prep time must be between 0 and 480 minutes',
      value: recipe.prepTime,
    });
  }
  
  if (recipe.cookTime && (recipe.cookTime < 0 || recipe.cookTime > 480)) {
    errors.push({
      field: 'cookTime',
      message: 'Cook time must be between 0 and 480 minutes',
      value: recipe.cookTime,
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateMealPlan = (mealPlan: any): { isValid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];
  
  if (!mealPlan.name || mealPlan.name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Meal plan name must be at least 3 characters',
      value: mealPlan.name,
    });
  }
  
  if (!mealPlan.planType) {
    errors.push({
      field: 'planType',
      message: 'Plan type is required',
      value: mealPlan.planType,
    });
  }
  
  if (!mealPlan.date) {
    errors.push({
      field: 'date',
      message: 'Date is required',
      value: mealPlan.date,
    });
  }
  
  if (!mealPlan.mealType) {
    errors.push({
      field: 'mealType',
      message: 'Meal type is required',
      value: mealPlan.mealType,
    });
  }
  
  if (mealPlan.endDate && mealPlan.date >= mealPlan.endDate) {
    errors.push({
      field: 'endDate',
      message: 'End date must be after start date',
      value: mealPlan.endDate,
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitization functions
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const sanitizeName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z\s]/g, '');
};

export const sanitizeDescription = (description: string): string => {
  return description.trim().replace(/\s+/g, ' ').substring(0, 500);
};

// Validation helpers
export const createValidationError = (field: string, message: string, value?: any): ValidationError => {
  return {
    field,
    message,
    value,
    code: 'VALIDATION_ERROR',
  };
};

export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (value === null || value === undefined || value === '') {
    return createValidationError(fieldName, `${fieldName} is required`);
  }
  return null;
};

export const validateLength = (value: string, fieldName: string, min: number, max: number): ValidationError | null => {
  if (value.length < min) {
    return createValidationError(fieldName, `${fieldName} must be at least ${min} characters`);
  }
  if (value.length > max) {
    return createValidationError(fieldName, `${fieldName} must be less than ${max} characters`);
  }
  return null;
};

export const validateRange = (value: number, fieldName: string, min: number, max: number): ValidationError | null => {
  if (value < min || value > max) {
    return createValidationError(fieldName, `${fieldName} must be between ${min} and ${max}`);
  }
  return null;
};

export const validateEnum = (value: any, fieldName: string, allowedValues: any[]): ValidationError | null => {
  if (!allowedValues.includes(value)) {
    return createValidationError(fieldName, `${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
  return null;
};
