import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    householdId: string;
    role: string;
    iat: number;
    jti: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        errors: ['MISSING_TOKEN'],
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback-secret') as any;
      
      // Add user info to request
      req.user = {
        id: decoded.sub,
        householdId: decoded.householdId,
        role: decoded.role,
        iat: decoded.iat,
        jti: decoded.jti,
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        errors: ['INVALID_TOKEN'],
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      errors: ['INTERNAL_ERROR'],
    });
  }
};

// Optional auth middleware for routes that can work with or without auth
export const optionalAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user info
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback-secret') as any;
      
      req.user = {
        id: decoded.sub,
        householdId: decoded.householdId,
        role: decoded.role,
        iat: decoded.iat,
        jti: decoded.jti,
      };

      next();
    } catch (jwtError) {
      // Invalid token, continue without user info
      return next();
    }
  } catch (error) {
    // Error occurred, continue without user info
    return next();
  }
};

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        errors: ['UNAUTHORIZED'],
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        errors: ['INSUFFICIENT_PERMISSIONS'],
      });
    }

    next();
  };
};

// Household access control middleware
export const requireHouseholdAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      errors: ['UNAUTHORIZED'],
    });
  }

  const householdId = req.params.householdId || req.body.householdId;
  
  if (householdId && householdId !== req.user.householdId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this household',
      errors: ['HOUSEHOLD_ACCESS_DENIED'],
    });
  }

  next();
};
