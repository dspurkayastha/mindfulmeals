// Shared error handler middleware for MindfulMeals microservices

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, ValidationError, ApiError } from '../types';

// Custom error classes
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errorCode?: string;

  constructor(message: string, statusCode: number = 500, errorCode?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errorCode = errorCode;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationAppError extends AppError {
  public errors: ValidationError[];

  constructor(message: string, errors: ValidationError[]) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

export class NotFoundAppError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedAppError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenAppError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ConflictAppError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export class RateLimitAppError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // Handle custom app errors
  if (error instanceof AppError) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: error.message,
      error: error.errorCode || 'APP_ERROR',
      timestamp: new Date().toISOString(),
    };

    // Add validation errors if available
    if (error instanceof ValidationAppError) {
      errorResponse.errors = error.errors;
    }

    res.status(error.statusCode).json(errorResponse);
    return;
  }

  // Handle TypeORM errors
  if (error.name === 'QueryFailedError') {
    const pgError = error as any;
    
    const errorResponse: ErrorResponse = {
      success: false,
      message: 'Database operation failed',
      error: 'DATABASE_ERROR',
      timestamp: new Date().toISOString(),
    };

    // PostgreSQL specific error codes
    switch (pgError.code) {
      case '23505': // unique_violation
        res.status(409).json({
          ...errorResponse,
          message: 'Resource already exists',
          error: 'DUPLICATE_ENTRY',
        });
        return;
      
      case '23503': // foreign_key_violation
        res.status(400).json({
          ...errorResponse,
          message: 'Referenced resource does not exist',
          error: 'FOREIGN_KEY_VIOLATION',
        });
        return;
      
      case '23502': // not_null_violation
        res.status(400).json({
          ...errorResponse,
          message: 'Required field is missing',
          error: 'MISSING_REQUIRED_FIELD',
        });
        return;
      
      case '22P02': // invalid_text_representation
        res.status(400).json({
          ...errorResponse,
          message: 'Invalid data format',
          error: 'INVALID_FORMAT',
        });
        return;
      
      case '42P01': // undefined_table
        res.status(500).json({
          ...errorResponse,
          message: 'Database table not found',
          error: 'TABLE_NOT_FOUND',
        });
        return;
      
      case '42703': // undefined_column
        res.status(500).json({
          ...errorResponse,
          message: 'Database column not found',
          error: 'COLUMN_NOT_FOUND',
        });
        return;
      
      default:
        res.status(400).json(errorResponse);
        return;
    }
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'INVALID_TOKEN',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired',
      error: 'TOKEN_EXPIRED',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle multer errors (file upload)
  if (error.name === 'MulterError') {
    res.status(400).json({
      success: false,
      message: 'File upload error',
      error: 'FILE_UPLOAD_ERROR',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle rate limit errors
  if (error.message.includes('Too many requests')) {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later',
      error: 'RATE_LIMIT_EXCEEDED',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle AI/ML specific errors
  if (error.message.includes('AI') || error.message.includes('ML') || error.message.includes('model')) {
    res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable',
      error: 'AI_SERVICE_ERROR',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle meal planning specific errors
  if (error.message.includes('meal') || error.message.includes('recipe') || error.message.includes('planning')) {
    res.status(400).json({
      success: false,
      message: 'Meal planning error occurred',
      error: 'MEAL_PLANNING_ERROR',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle inventory specific errors
  if (error.message.includes('inventory') || error.message.includes('pantry') || error.message.includes('barcode')) {
    res.status(400).json({
      success: false,
      message: 'Inventory management error occurred',
      error: 'INVENTORY_ERROR',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle commerce specific errors
  if (error.message.includes('commerce') || error.message.includes('vendor') || error.message.includes('order')) {
    res.status(400).json({
      success: false,
      message: 'Commerce service error occurred',
      error: 'COMMERCE_ERROR',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle mindfulness specific errors
  if (error.message.includes('mindfulness') || error.message.includes('meditation') || error.message.includes('breathing')) {
    res.status(400).json({
      success: false,
      message: 'Mindfulness feature error occurred',
      error: 'MINDFULNESS_ERROR',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle cultural integration errors
  if (error.message.includes('cultural') || error.message.includes('regional') || error.message.includes('festival')) {
    res.status(400).json({
      success: false,
      message: 'Cultural integration error occurred',
      error: 'CULTURAL_ERROR',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle unknown errors
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    success: false,
    message: isDevelopment ? error.message : 'Internal Server Error',
    error: 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { 
      stack: error.stack,
      name: error.name,
      url: req.url,
      method: req.method,
    }),
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error response helper
export const createErrorResponse = (
  message: string,
  error: string,
  statusCode: number = 500,
  details?: any
): ErrorResponse => {
  return {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
    ...(details && { metadata: details }),
  };
};

// Success response helper
export const createSuccessResponse = <T>(
  data: T,
  message?: string,
  metadata?: any
) => {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    ...(metadata && { metadata }),
  };
};

// Validation error helper
export const createValidationErrorResponse = (errors: ValidationError[]): ErrorResponse => {
  return {
    success: false,
    message: 'Validation failed',
    error: 'VALIDATION_ERROR',
    errors,
    timestamp: new Date().toISOString(),
  };
};

// Not found error helper
export const createNotFoundResponse = (resource: string): ErrorResponse => {
  return {
    success: false,
    message: `${resource} not found`,
    error: 'NOT_FOUND',
    timestamp: new Date().toISOString(),
  };
};

// Unauthorized error helper
export const createUnauthorizedResponse = (message: string = 'Unauthorized'): ErrorResponse => {
  return {
    success: false,
    message,
    error: 'UNAUTHORIZED',
    timestamp: new Date().toISOString(),
  };
};

// Forbidden error helper
export const createForbiddenResponse = (message: string = 'Forbidden'): ErrorResponse => {
  return {
    success: false,
    message,
    error: 'FORBIDDEN',
    timestamp: new Date().toISOString(),
  };
};

// Conflict error helper
export const createConflictResponse = (message: string = 'Resource conflict'): ErrorResponse => {
  return {
    success: false,
    message,
    error: 'CONFLICT',
    timestamp: new Date().toISOString(),
  };
};

// Rate limit error helper
export const createRateLimitResponse = (message: string = 'Too many requests'): ErrorResponse => {
  return {
    success: false,
    message,
    error: 'RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  };
};
