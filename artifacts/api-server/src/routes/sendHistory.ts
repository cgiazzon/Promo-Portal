import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, sendHistoryTable, offersTable, groupsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/send-history", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const rows = await db
      .select({
        id: sendHistoryTable.id,
        offerId: sendHistoryTable.offerId,
        offerTitle: offersTable.title,
        groupId: sendHistoryTable.groupId,
        groupName: groupsTable.name,
        sentAt: sendHistoryTable.sentAt,
        status: sendHistoryTable.status,
        clicks: sendHistoryTable.clicks,
        shortUrl: sendHistoryTable.shortUrl,
      })
      .from(sendHistoryTable)
      .leftJoin(offersTable, eq(sendHistoryTable.offerId, offersTable.id))
      .leftJoin(groupsTable, eq(sendHistoryTable.groupId, groupsTable.id))
      .where(eq(sendHistoryTable.entrepreneurId, entrepreneurId));

    res.json(rows.map(r => ({
      ...r,
      sentAt: r.sentAt.toISOString(),
    })));
  } catch (e) {
    console.error("GET /send-history error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
