import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { id: number; role: string; email: string; name: string };
    }
  }
}

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Access denied! No token provided.",
        });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Access denied! Token missing after Bearer.",
        });
      }

      const decoded = jwt.verify(token, config.jwtSecret as string) as any;

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to access this resource.",
        });
      }

      next();
    } catch (err: any) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
        error: err.message,
      });
    }
  };
};

export default auth;
