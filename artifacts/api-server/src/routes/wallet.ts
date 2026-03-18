import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, walletsTable, commissionsTable, walletTransactionsTable, withdrawalsTable } from "@workspace/db";
import { UpdatePixKeyBody, RequestWithdrawalBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateWallet(entrepreneurId: number) {
  const [existing] = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.entrepreneurId, entrepreneurId))
    .limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(walletsTable)
    .values({ entrepreneurId, availableBalance: 0, pendingBalance: 0, totalWithdrawn: 0 })
    .returning();
  return created;
}

router.get("/wallet", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const wallet = await getOrCreateWallet(entrepreneurId);

    const pendingCommissions = await db
      .select()
      .from(commissionsTable)
      .where(eq(commissionsTable.entrepreneurId, entrepreneurId));

    const transactions = await db
      .select()
      .from(walletTransactionsTable)
      .where(eq(walletTransactionsTable.walletId, wallet.id));

    res.json({
      id: wallet.id,
      availableBalance: wallet.availableBalance,
      pendingBalance: wallet.pendingBalance,
      totalWithdrawn: wallet.totalWithdrawn,
      pixKeyType: wallet.pixKeyType,
      pixKey: wallet.pixKey,
      pendingCommissions: pendingCommissions.map(c => ({
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
      })),
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        createdAt: t.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("GET /wallet error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/wallet/pix-key", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const body = UpdatePixKeyBody.parse(req.body);
    const wallet = await getOrCreateWallet(entrepreneurId);

    const [updated] = await db
      .update(walletsTable)
      .set({ pixKeyType: body.pixKeyType, pixKey: body.pixKey })
      .where(eq(walletsTable.id, wallet.id))
      .returning();

    res.json({ pixKeyType: updated.pixKeyType, pixKey: updated.pixKey });
  } catch (e) {
    console.error("PUT /wallet/pix-key error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/wallet/withdraw", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const body = RequestWithdrawalBody.parse(req.body);
    const wallet = await getOrCreateWallet(entrepreneurId);

    if (!wallet.pixKey || !wallet.pixKeyType) {
      res.status(400).json({ message: "Configure sua chave Pix antes de sacar" });
      return;
    }
    if (wallet.availableBalance < body.amount) {
      res.status(400).json({ message: "Saldo insuficiente" });
      return;
    }

    const [withdrawal] = await db
      .insert(withdrawalsTable)
      .values({
        entrepreneurId,
        amount: body.amount,
        pixKey: wallet.pixKey,
        pixKeyType: wallet.pixKeyType,
        status: "pending",
      })
      .returning();

    await db
      .update(walletsTable)
      .set({
        availableBalance: wallet.availableBalance - body.amount,
        totalWithdrawn: wallet.totalWithdrawn + body.amount,
      })
      .where(eq(walletsTable.id, wallet.id));

    await db.insert(walletTransactionsTable).values({
      walletId: wallet.id,
      type: "debit",
      amount: -body.amount,
      description: `Saque via Pix - ${wallet.pixKeyType?.toUpperCase()} ${wallet.pixKey}`,
    });

    res.status(201).json({
      id: withdrawal.id,
      amount: withdrawal.amount,
      pixKey: withdrawal.pixKey,
      pixKeyType: withdrawal.pixKeyType,
      status: withdrawal.status,
      requestedAt: withdrawal.requestedAt.toISOString(),
      processedAt: null,
    });
  } catch (e) {
    console.error("POST /wallet/withdraw error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
