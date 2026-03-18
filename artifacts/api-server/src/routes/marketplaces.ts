import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, marketplacesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/marketplaces", async (_req, res): Promise<void> => {
  try {
    const mps = await db.select().from(marketplacesTable);
    res.json(mps);
  } catch (e) {
    console.error("GET /marketplaces error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/marketplaces", async (req, res): Promise<void> => {
  try {
    const { name, slug, affiliateCode, commissionPercent, color, secondaryColor, logoUrl } = req.body as {
      name: string; slug: string; affiliateCode?: string; commissionPercent: number;
      color: string; secondaryColor?: string; logoUrl?: string;
    };
    const [mp] = await db
      .insert(marketplacesTable)
      .values({ name, slug, affiliateCode, commissionPercent, color, secondaryColor, logoUrl })
      .returning();
    res.status(201).json(mp);
  } catch (e) {
    console.error("POST /marketplaces error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/marketplaces/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body as Partial<typeof marketplacesTable.$inferInsert>;
    const [updated] = await db
      .update(marketplacesTable)
      .set(updates)
      .where(eq(marketplacesTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ message: "Marketplace não encontrado" });
      return;
    }
    res.json(updated);
  } catch (e) {
    console.error("PUT /marketplaces/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
