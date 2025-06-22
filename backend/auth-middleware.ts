import { Request, Response, NextFunction } from "express";
import { adminAuth } from "./firebase";

export async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    (req as any).user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
} 