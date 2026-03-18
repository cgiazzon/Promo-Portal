import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, featuredOffersTable, offersTable, marketplacesTable } from "@workspace/db";

const router: IRouter = Router();

async function getFeaturedWithOffer() {
  const [featured] = await db.select().from(featuredOffersTable).limit(1);
  if (!featured) return null;

  const [offer] = await db
    .select({
      id: offersTable.id,
      title: offersTable.title,
      originalPrice: offersTable.originalPrice,
      finalPrice: offersTable.finalPrice,
      discountPercent: offersTable.discountPercent,
      couponCode: offersTable.couponCode,
      category: offersTable.category,
      imageUrl: offersTable.imageUrl,
      productUrl: offersTable.productUrl,
      marketplaceId: offersTable.marketplaceId,
      status: offersTable.status,
      expiresAt: offersTable.expiresAt,
      sendCount: offersTable.sendCount,
      clickCount: offersTable.clickCount,
      createdAt: offersTable.createdAt,
      marketplaceName: marketplacesTable.name,
      marketplaceColor: marketplacesTable.color,
    })
    .from(offersTable)
    .leftJoin(marketplacesTable, eq(offersTable.marketplaceId, marketplacesTable.id))
    .where(eq(offersTable.id, featured.offerId))
    .limit(1);

  return {
    id: featured.id,
    offerId: featured.offerId,
    offer: offer ?? null,
    motivationalMessage: featured.motivationalMessage,
    setAt: featured.setAt.toISOString(),
  };
}

router.get("/featured-offer", async (_req, res): Promise<void> => {
  try {
    const result = await getFeaturedWithOffer();
    if (!result) {
      res.status(404).json({ message: "Nenhuma oferta em destaque configurada" });
      return;
    }
    res.json(result);
  } catch (e) {
    console.error("GET /featured-offer error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/featured-offer", async (req, res): Promise<void> => {
  try {
    const { offerId, motivationalMessage } = req.body as { offerId: number; motivationalMessage?: string };

    const [existing] = await db.select().from(featuredOffersTable).limit(1);
    if (existing) {
      await db
        .update(featuredOffersTable)
        .set({ offerId, motivationalMessage: motivationalMessage ?? null, setAt: new Date() })
        .where(eq(featuredOffersTable.id, existing.id));
    } else {
      await db.insert(featuredOffersTable).values({
        offerId,
        motivationalMessage: motivationalMessage ?? null,
      });
    }

    const result = await getFeaturedWithOffer();
    res.json(result);
  } catch (e) {
    console.error("PUT /featured-offer error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
