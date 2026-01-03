import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../shared/errors/AppError";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid authorization header", 401);
    }

    const token = authHeader.substring(7);

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError("JWT_SECRET is not configured", 500);
    }

    const decoded = jwt.verify(token, secret) as { sub: string };

    req.userId = decoded.sub;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid token", 401));
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expired", 401));
    }

    next(error);
  }
}

