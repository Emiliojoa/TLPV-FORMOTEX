import jwt from 'jsonwebtoken';
import { UserRole } from '../models';

export interface AuthPayload {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export class JWTUtil {
  private static secret = process.env.JWT_SECRET || 'your-default-secret-key';
  private static expiresIn = process.env.JWT_EXPIRE || '24h';

  static generateToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string {
    try {
      return jwt.sign(payload, this.secret, { 
        expiresIn: this.expiresIn,
        issuer: 'formotex-inventory'
      });
    } catch (error) {
      throw new Error('Error generating JWT token');
    }
  }

  static verifyToken(token: string): AuthPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as AuthPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1];
  }

  static decodeToken(token: string): AuthPayload | null {
    try {
      const decoded = jwt.decode(token) as AuthPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
