import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // For development, allow requests without authentication
  // In production, this should be strictly enforced
  if (process.env.NODE_ENV === 'development' && !req.headers.authorization) {
    logger.warn('Request without authentication in development mode');
    return next();
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    req.user = decoded as { id: string; email: string };
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const generateToken = (payload: { id: string; email: string }): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};
