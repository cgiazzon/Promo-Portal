import { Router, type IRouter } from "express";
import { eq, sql, count, sum } from "drizzle-orm";
import {
  db, usersTable, groupsTable, offersTable, sendHistoryTable,
  walletsTable, commissionsTable, withdrawalsTable, plansTable,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/admin/dashboard", async (_req, res): Promise<void> => {
  try {
    const [[{ total: activeEntrepreneurs }]] = await Promise.all([
      db.select({ total: count() }).from(usersTable).where(eq(usersTable.role, "entrepreneur")),
    ]);

    const [[{ total: totalGroups }]] = await Promise.all([
      db.select({ total: count() }).from(groupsTable),
    ]);

    const [[{ total: totalOffersSent }]] = await Promise.all([
      db.select({ total: count() }).from(sendHistoryTable),
    ]);

    const [[{ total: totalClicks }]] = await Promise.all([
      db.select({ total: sum(sendHistoryTable.clicks) }).from(sendHistoryTable),
    ]);

    const pendingWithdrawalsRows = await db
      .select({ amount: withdrawalsTable.amount })
      .from(withdrawalsTable)
      .where(eq(withdrawalsTable.status, "pending"));
    const pendingWithdrawals = pendingWithdrawalsRows.reduce((s, w) => s + w.amount, 0);
    const pendingWithdrawalsCount = pendingWithdrawalsRows.length;

    const pendingCommissionsRows = await db
      .select({ amount: commissionsTable.commissionAmount })
      .from(commissionsTable)
      .where(eq(commissionsTable.status, "pending"));
    const commissionsToRelease = pendingCommissionsRows.reduce((s, c) => s + c.amount, 0);

    const entrepreneursWithPlans = await db
      .select({ status: usersTable.status, planId: usersTable.planId, price: plansTable.price })
      .from(usersTable)
      .leftJoin(plansTable, eq(usersTable.planId, plansTable.id))
      .where(eq(usersTable.role, "entrepreneur"));

    const subscriptionsByPlan: Record<string, number> = {};
    let mrr = 0;
    for (const row of entrepreneursWithPlans) {
      if (row.status === "active" && row.price) {
        mrr += row.price;
      }
    }

    const plans = await db.select().from(plansTable);
    for (const plan of plans) {
      subscriptionsByPlan[plan.name] = entrepreneursWithPlans.filter(e => e.planId === plan.id).length;
    }

    res.json({
      activeEntrepreneurs: Number(activeEntrepreneurs),
      totalGroups: Number(totalGroups),
      totalOffersSent: Number(totalOffersSent),
      totalClicks: Number(totalClicks ?? 0),
      mrr,
      subscriptionsByPlan,
      commissionsToRelease,
      pendingWithdrawals,
      pendingWithdrawalsCount,
    });
  } catch (e) {
    console.error("GET /admin/dashboard error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/admin/entrepreneurs", async (_req, res): Promise<void> => {
  try {
    const entrepreneurs = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        status: usersTable.status,
        planId: usersTable.planId,
        planName: plansTable.name,
        trialEndsAt: usersTable.trialEndsAt,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .leftJoin(plansTable, eq(usersTable.planId, plansTable.id))
      .where(eq(usersTable.role, "entrepreneur"));

    const enriched = await Promise.all(entrepreneurs.map(async (e) => {
      const [[{ groupCount }]] = await Promise.all([
        db.select({ groupCount: count() }).from(groupsTable).where(eq(groupsTable.entrepreneurId, e.id)),
      ]);
      const [wallet] = await db.select({ balance: walletsTable.availableBalance }).from(walletsTable).where(eq(walletsTable.entrepreneurId, e.id)).limit(1);
      return {
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone,
        status: e.status,
        planName: e.planName ?? null,
        trialEndsAt: e.trialEndsAt?.toISOString() ?? null,
        groupCount: Number(groupCount),
        scheduledOffers: 0,
        walletBalance: wallet?.balance ?? 0,
        createdAt: e.createdAt.toISOString(),
      };
    }));

    res.json(enriched);
  } catch (e) {
    console.error("GET /admin/entrepreneurs error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/admin/commissions", async (_req, res): Promise<void> => {
  try {
    const rows = await db
      .select({
        id: commissionsTable.id,
        entrepreneurName: usersTable.name,
        saleAmount: commissionsTable.saleAmount,
        commissionPercent: commissionsTable.commissionPercent,
        commissionAmount: commissionsTable.commissionAmount,
        marketplaceName: commissionsTable.marketplaceName,
        offerTitle: commissionsTable.offerTitle,
        groupName: commissionsTable.groupName,
        status: commissionsTable.status,
        saleDate: commissionsTable.saleDate,
        releaseDate: commissionsTable.releaseDate,
      })
      .from(commissionsTable)
      .leftJoin(usersTable, eq(commissionsTable.entrepreneurId, usersTable.id));

    res.json(rows.map(r => ({
      ...r,
      saleDate: r.saleDate.toISOString(),
      releaseDate: r.releaseDate.toISOString(),
    })));
  } catch (e) {
    console.error("GET /admin/commissions error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/admin/withdrawals", async (_req, res): Promise<void> => {
  try {
    const rows = await db
      .select({
        id: withdrawalsTable.id,
        entrepreneurName: usersTable.name,
        amount: withdrawalsTable.amount,
        pixKey: withdrawalsTable.pixKey,
        pixKeyType: withdrawalsTable.pixKeyType,
        status: withdrawalsTable.status,
        requestedAt: withdrawalsTable.requestedAt,
        processedAt: withdrawalsTable.processedAt,
      })
      .from(withdrawalsTable)
      .leftJoin(usersTable, eq(withdrawalsTable.entrepreneurId, usersTable.id));

    res.json(rows.map(r => ({
      ...r,
      requestedAt: r.requestedAt.toISOString(),
      processedAt: r.processedAt?.toISOString() ?? null,
    })));
  } catch (e) {
    console.error("GET /admin/withdrawals error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/admin/withdrawals/:id/process", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const [withdrawal] = await db
      .select({
        id: withdrawalsTable.id,
        entrepreneurName: usersTable.name,
        amount: withdrawalsTable.amount,
        pixKey: withdrawalsTable.pixKey,
        pixKeyType: withdrawalsTable.pixKeyType,
        status: withdrawalsTable.status,
        requestedAt: withdrawalsTable.requestedAt,
      })
      .from(withdrawalsTable)
      .leftJoin(usersTable, eq(withdrawalsTable.entrepreneurId, usersTable.id))
      .where(eq(withdrawalsTable.id, id))
      .limit(1);

    if (!withdrawal) {
      res.status(404).json({ message: "Saque não encontrado" });
      return;
    }

    const now = new Date();
    await db.update(withdrawalsTable).set({ status: "processed", processedAt: now }).where(eq(withdrawalsTable.id, id));

    res.json({
      ...withdrawal,
      status: "processed",
      requestedAt: withdrawal.requestedAt.toISOString(),
      processedAt: now.toISOString(),
    });
  } catch (e) {
    console.error("POST /admin/withdrawals/:id/process error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/admin/subscriptions", async (_req, res): Promise<void> => {
  try {
    const rows = await db
      .select({
        id: usersTable.id,
        entrepreneurName: usersTable.name,
        planName: plansTable.name,
        status: usersTable.status,
        amount: plansTable.price,
        startedAt: usersTable.createdAt,
        nextBillingAt: usersTable.trialEndsAt,
      })
      .from(usersTable)
      .leftJoin(plansTable, eq(usersTable.planId, plansTable.id))
      .where(eq(usersTable.role, "entrepreneur"));

    res.json(rows.map(r => ({
      id: r.id,
      entrepreneurName: r.entrepreneurName,
      planName: r.planName ?? null,
      status: r.status,
      amount: r.amount ?? null,
      startedAt: r.startedAt.toISOString(),
      nextBillingAt: r.nextBillingAt?.toISOString() ?? null,
    })));
  } catch (e) {
    console.error("GET /admin/subscriptions error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
