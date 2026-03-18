import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../routes/auth";
import type { AuthPayload } from "../routes/auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers["authorization"];
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ message: "Não autenticado" });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({ message: "Não autenticado" });
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      if (!roles.includes(payload.role)) {
        res.status(403).json({ message: "Acesso negado" });
        return;
      }
      req.user = payload;
      next();
    } catch {
      res.status(401).json({ message: "Token inválido ou expirado" });
    }
  };
}
