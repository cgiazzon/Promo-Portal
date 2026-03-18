import { Router, type IRouter } from "express";
import { eq, and, gte, sql } from "drizzle-orm";
import { db, usersTable, groupsTable, schedulesTable, walletsTable, commissionsTable, sendHistoryTable, plansTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/entrepreneur/dashboard", async (req, res): Promise<void> => {
  try {
    const userId = req.user!.sub;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) { res.status(404).json({ message: "Usuário não encontrado" }); return; }

    const groups = await db.select({ id: groupsTable.id }).from(groupsTable).where(eq(groupsTable.entrepreneurId, userId));
    const groupCount = groups.length;

    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999);
    const allSchedules = await db.select().from(schedulesTable).where(eq(schedulesTable.entrepreneurId, userId));
    const scheduledToday = allSchedules.filter(s => {
      const d = new Date(s.scheduledAt);
      return d >= startOfToday && d <= endOfToday;
    }).length;

    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const recentHistory = await db
      .select({ clicks: sendHistoryTable.clicks })
      .from(sendHistoryTable)
      .where(and(eq(sendHistoryTable.entrepreneurId, userId), gte(sendHistoryTable.sentAt, weekAgo)));
    const weeklyClicks = recentHistory.reduce((sum, h) => sum + (h.clicks || 0), 0);

    const [wallet] = await db.select().from(walletsTable).where(eq(walletsTable.entrepreneurId, userId)).limit(1);
    const availableBalance = wallet?.availableBalance ?? 0;
    const pendingBalance = wallet?.pendingBalance ?? 0;

    const trialDaysLeft = user.trialEndsAt
      ? Math.max(0, Math.ceil((user.trialEndsAt.getTime() - Date.now()) / 86400000))
      : 0;

    const notifications: Array<{ id: number; message: string; type: string; createdAt: string }> = [];
    if (trialDaysLeft > 0 && trialDaysLeft <= 7) {
      notifications.push({
        id: 1,
        message: `Atenção: Seu trial expira em ${trialDaysLeft} dia${trialDaysLeft === 1 ? "" : "s"}. Ative seu plano para continuar!`,
        type: "warning",
        createdAt: new Date().toISOString(),
      });
    }

    res.json({
      groupCount,
      scheduledToday,
      weeklyClicks,
      availableBalance,
      pendingBalance,
      monthlyWithdrawn: 0,
      trialDaysLeft,
      notifications,
    });
  } catch (e) {
    console.error("GET /entrepreneur/dashboard error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/entrepreneur/metrics", async (req, res): Promise<void> => {
  try {
    const userId = req.user!.sub;

    const groups = await db
      .select({ id: groupsTable.id, name: groupsTable.name, clickCount: groupsTable.clickCount })
      .from(groupsTable)
      .where(eq(groupsTable.entrepreneurId, userId));

    const clicksByGroup = groups.map(g => ({ label: g.name, value: g.clickCount }));

    res.json({
      clicksByOffer: [],
      clicksByGroup,
      clicksByMarketplace: [],
      topOffers: [],
      chartData: [],
    });
  } catch (e) {
    console.error("GET /entrepreneur/metrics error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/entrepreneur/financial", async (req, res): Promise<void> => {
  try {
    const userId = req.user!.sub;

    const [wallet] = await db.select().from(walletsTable).where(eq(walletsTable.entrepreneurId, userId)).limit(1);
    const commissions = await db.select().from(commissionsTable).where(eq(commissionsTable.entrepreneurId, userId));

    const totalCommissions = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalSales = commissions.reduce((sum, c) => sum + c.saleAmount, 0);

    res.json({
      totalSales,
      totalCommissions,
      totalAvailable: wallet?.availableBalance ?? 0,
      totalWithdrawn: wallet?.totalWithdrawn ?? 0,
      salesByGroup: [],
      salesByOffer: [],
      chartData: [],
    });
  } catch (e) {
    console.error("GET /entrepreneur/financial error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/profile", async (req, res): Promise<void> => {
  try {
    const userId = req.user!.sub;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) { res.status(404).json({ message: "Usuário não encontrado" }); return; }
    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone });
  } catch (e) {
    console.error("GET /profile error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/profile", async (req, res): Promise<void> => {
  try {
    const userId = req.user!.sub;
    const { name, phone } = req.body as { name?: string; phone?: string };
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, userId)).returning();
    res.json({ id: updated.id, name: updated.name, email: updated.email, phone: updated.phone });
  } catch (e) {
    console.error("PUT /profile error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
