import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utility';
import { AuthenticationError } from '../utils/errors.util';

//extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError('No authorization token provided');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AuthenticationError('Invalid authorization format');
    }

    const token = parts[1]!;
    const decoded = verifyToken(token);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return next(new AuthenticationError('Invalid token'));
      }
      if (error.name === 'TokenExpiredError') {
        return next(new AuthenticationError('Token expired'));
      }
    }
    next(error);
  }
};