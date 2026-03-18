import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, plansTable, usersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/plans", async (_req, res): Promise<void> => {
  try {
    const plans = await db.select().from(plansTable);
    res.json(plans);
  } catch (e) {
    console.error("GET /plans error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/subscription", requireAuth, async (req, res): Promise<void> => {
  try {
    const userId = req.user!.sub;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    let plan = null;
    if (user.planId) {
      const [p] = await db.select().from(plansTable).where(eq(plansTable.id, user.planId)).limit(1);
      plan = p ?? null;
    }

    const trialDaysLeft = user.trialEndsAt
      ? Math.max(0, Math.ceil((user.trialEndsAt.getTime() - Date.now()) / 86400000))
      : 0;

    res.json({
      planId: user.planId ?? null,
      planName: plan?.name ?? null,
      status: user.status,
      trialEndsAt: user.trialEndsAt?.toISOString() ?? null,
      trialDaysLeft,
      nextBillingAt: user.trialEndsAt?.toISOString() ?? null,
      amount: plan?.price ?? null,
    });
  } catch (e) {
    console.error("GET /subscription error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/subscription", requireAuth, async (req, res): Promise<void> => {
  try {
    const userId = req.user!.sub;
    const { planId } = req.body as { planId: number };

    const [plan] = await db.select().from(plansTable).where(eq(plansTable.id, planId)).limit(1);
    if (!plan) {
      res.status(404).json({ message: "Plano não encontrado" });
      return;
    }

    const [user] = await db
      .update(usersTable)
      .set({ planId, status: "active" })
      .where(eq(usersTable.id, userId))
      .returning();

    res.json({
      planId,
      planName: plan.name,
      status: user.status,
      trialEndsAt: user.trialEndsAt?.toISOString() ?? null,
      nextBillingAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      amount: plan.price,
    });
  } catch (e) {
    console.error("PUT /subscription error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
