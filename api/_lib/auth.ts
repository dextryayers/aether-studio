import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";

export interface AuthRequest extends Request {
  adminId?: string;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.adminId = decoded.id;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

export function generateToken(adminId: string): string {
  return jwt.sign({ id: adminId }, JWT_SECRET, { expiresIn: "7d" });
}
