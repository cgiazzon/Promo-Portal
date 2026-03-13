import type { Request, Response, NextFunction } from "express";
import { getSessionUser } from "../routes/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ message: "Nao autenticado" });
    return;
  }
  (req as Request & { user: typeof user }).user = user;
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = getSessionUser(req);
    if (!user) {
      res.status(401).json({ message: "Nao autenticado" });
      return;
    }
    if (!roles.includes(user.role)) {
      res.status(403).json({ message: "Acesso negado" });
      return;
    }
    (req as Request & { user: typeof user }).user = user;
    next();
  };
}
