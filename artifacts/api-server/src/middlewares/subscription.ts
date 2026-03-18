import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

export async function requireActiveSubscription(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      res.status(401).json({ message: "Não autenticado" });
      return;
    }

    const [user] = await db
      .select({ subscriptionStatus: usersTable.subscriptionStatus, status: usersTable.status })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(401).json({ message: "Usuário não encontrado" });
      return;
    }

    const blockedStatuses = ["canceled", "past_due", "unpaid"];
    if (blockedStatuses.includes(user.subscriptionStatus)) {
      res.status(402).json({
        message: "Assinatura inativa. Atualize seu método de pagamento para continuar.",
        subscriptionStatus: user.subscriptionStatus,
        code: "SUBSCRIPTION_INACTIVE",
      });
      return;
    }

    next();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("requireActiveSubscription error:", msg);
    res.status(500).json({ message: "Erro interno" });
  }
}
