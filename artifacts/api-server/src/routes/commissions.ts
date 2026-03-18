import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, commissionsTable, withdrawalsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/commissions", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const { status } = req.query as { status?: string };

    let rows = await db
      .select()
      .from(commissionsTable)
      .where(eq(commissionsTable.entrepreneurId, entrepreneurId));

    if (status) {
      rows = rows.filter(c => c.status === status);
    }

    res.json(rows.map(c => ({
      id: c.id,
      saleAmount: c.saleAmount,
      commissionPercent: c.commissionPercent,
      commissionAmount: c.commissionAmount,
      marketplaceName: c.marketplaceName,
      offerTitle: c.offerTitle,
      groupName: c.groupName,
      status: c.status,
      saleDate: c.saleDate.toISOString(),
      releaseDate: c.releaseDate.toISOString(),
    })));
  } catch (e) {
    console.error("GET /commissions error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/withdrawals", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const rows = await db
      .select()
      .from(withdrawalsTable)
      .where(eq(withdrawalsTable.entrepreneurId, entrepreneurId));

    res.json(rows.map(w => ({
      id: w.id,
      amount: w.amount,
      pixKey: w.pixKey,
      pixKeyType: w.pixKeyType,
      status: w.status,
      requestedAt: w.requestedAt.toISOString(),
      processedAt: w.processedAt?.toISOString() ?? null,
    })));
  } catch (e) {
    console.error("GET /withdrawals error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
