import { Request, Response, NextFunction } from 'express';
import { JWTUtil, AuthPayload } from '../utils/jwt';
import { UserRole } from '../models';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTUtil.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied',
        error: 'No token provided'
      } as ApiResponse);
      return;
    }

    const decoded = JWTUtil.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Access denied',
      error: error instanceof Error ? error.message : 'Invalid token'
    } as ApiResponse);
  }
};

export const authorize = (roles: UserRole | UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Access denied',
        error: 'User not authenticated'
      } as ApiResponse);
      return;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access forbidden',
        error: `Required role: ${allowedRoles.join(' or ')}`
      } as ApiResponse);
      return;
    }

    next();
  };
};

// Middleware combinations for common use cases
export const requireAuth = [authenticate];
export const requireAdmin = [authenticate, authorize(UserRole.ADMIN)];
export const requireUser = [authenticate, authorize([UserRole.USER, UserRole.ADMIN])];
