import { Request, Response, NextFunction } from 'express';

// Custom error classes
export class ValidationError extends Error {
  public statusCode: number;
  public errors: string[];

  constructor(message: string, errors: string[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

export class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

export class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string = 'Internal Server Error') {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }
}

export class MealPlanningError extends Error {
  public statusCode: number;
  public errorType: string;

  constructor(message: string, errorType: string = 'MEAL_PLANNING_ERROR') {
    super(message);
    this.name = 'MealPlanningError';
    this.statusCode = 400;
    this.errorType = errorType;
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error,
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
  });

  // Handle custom errors
  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error instanceof ConflictError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error instanceof UnauthorizedError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error instanceof ForbiddenError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error instanceof InternalServerError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error instanceof MealPlanningError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorType: error.errorType,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle TypeORM errors
  if (error.name === 'QueryFailedError') {
    const pgError = error as any;
    
    // PostgreSQL specific error codes
    switch (pgError.code) {
      case '23505': // unique_violation
        res.status(409).json({
          success: false,
          message: 'Resource already exists',
          error: 'DUPLICATE_ENTRY',
          timestamp: new Date().toISOString(),
        });
        return;
      
      case '23503': // foreign_key_violation
        res.status(400).json({
          success: false,
          message: 'Referenced resource does not exist',
          error: 'FOREIGN_KEY_VIOLATION',
          timestamp: new Date().toISOString(),
        });
        return;
      
      case '23502': // not_null_violation
        res.status(400).json({
          success: false,
          message: 'Required field is missing',
          error: 'MISSING_REQUIRED_FIELD',
          timestamp: new Date().toISOString(),
        });
        return;
      
      case '22P02': // invalid_text_representation
        res.status(400).json({
          success: false,
          message: 'Invalid data format',
          error: 'INVALID_FORMAT',
          timestamp: new Date().toISOString(),
        });
        return;
      
      default:
        res.status(400).json({
          success: false,
          message: 'Database operation failed',
          error: 'DATABASE_ERROR',
          timestamp: new Date().toISOString(),
        });
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

  // Handle unknown errors
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : error.message,
    error: 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
