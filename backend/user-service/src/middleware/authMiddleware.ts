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
      res.status(401).json({
        success: false,
        message: 'Access token required',
        errors: ['MISSING_TOKEN'],
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      res.status(500).json({
        success: false,
        message: 'Server configuration error',
        errors: ['MISSING_JWT_SECRET'],
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as any;
      
      // Add user info to request
      req.user = {
        id: decoded.sub,
        householdId: decoded.householdId,
        role: decoded.role,
        iat: decoded.iat,
        jti: decoded.jti,
      };

      next();
      return;
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        errors: ['INVALID_TOKEN'],
      });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      errors: ['INTERNAL_ERROR'],
    });
    return;
  }
};

// Optional auth middleware for routes that can work with or without auth
export const optionalAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without user info
      next();
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      // If not configured, continue without user info
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as any;
      
      req.user = {
        id: decoded.sub,
        householdId: decoded.householdId,
        role: decoded.role,
        iat: decoded.iat,
        jti: decoded.jti,
      };

      next();
      return;
    } catch (jwtError) {
      // Invalid token, continue without user info
      next();
      return;
    }
  } catch (error) {
    // Error occurred, continue without user info
    next();
    return;
  }
};

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        errors: ['UNAUTHORIZED'],
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        errors: ['INSUFFICIENT_PERMISSIONS'],
      });
      return;
    }

    next();
  };
};

// Household access control middleware
export const requireHouseholdAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
      errors: ['UNAUTHORIZED'],
    });
    return;
  }

  const householdId = (req.params as any).householdId || (req.body as any).householdId;
  
  if (householdId && householdId !== req.user.householdId) {
    res.status(403).json({
      success: false,
      message: 'Access denied to this household',
      errors: ['HOUSEHOLD_ACCESS_DENIED'],
    });
    return;
  }

  next();
};
