import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, offersTable, marketplacesTable } from "@workspace/db";
import { ExtractProductDataBody } from "@workspace/api-zod";
import { requireRole } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/offers", async (req, res): Promise<void> => {
  try {
    const { marketplace, category, status } = req.query as {
      marketplace?: string; category?: string; status?: string;
    };

    const rows = await db
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
      .leftJoin(marketplacesTable, eq(offersTable.marketplaceId, marketplacesTable.id));

    let result = rows;
    if (marketplace) {
      result = result.filter(o =>
        o.marketplaceName?.toLowerCase().includes(marketplace.toLowerCase())
      );
    }
    if (category) {
      result = result.filter(o => o.category === category);
    }
    if (status) {
      result = result.filter(o => o.status === status);
    }

    res.json(result);
  } catch (e) {
    console.error("GET /offers error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/offers/extract", (req, res): void => {
  try {
    const body = ExtractProductDataBody.parse(req.body);
    const url = body.url || "";
    let marketplace = "shopee";
    if (url.includes("temu")) marketplace = "temu";
    if (url.includes("amazon")) marketplace = "amazon";
    if (url.includes("mercadolivre") || url.includes("mercado")) marketplace = "mercado-livre";
    if (url.includes("magalu") || url.includes("magazineluiza")) marketplace = "magalu";

    res.json({
      title: "Produto Exemplo Extraído - Alta Qualidade",
      price: 199.90,
      imageUrl: "https://placehold.co/400x400/25D366/white?text=Produto",
      marketplace,
    });
  } catch (e) {
    res.status(400).json({ message: "Dados inválidos" });
  }
});

router.get("/offers/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
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
      .where(eq(offersTable.id, id))
      .limit(1);

    if (!offer) {
      res.status(404).json({ message: "Oferta não encontrada" });
      return;
    }
    res.json(offer);
  } catch (e) {
    console.error("GET /offers/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/offers", requireRole("admin"), async (req, res): Promise<void> => {
  try {
    const {
      title, originalPrice, finalPrice, discountPercent, couponCode, category,
      imageUrl, productUrl, marketplaceId, status, expiresAt,
    } = req.body as {
      title: string; originalPrice: number; finalPrice: number; discountPercent: number;
      couponCode?: string; category?: string; imageUrl?: string; productUrl?: string;
      marketplaceId: number; status?: string; expiresAt?: string;
    };

    const [offer] = await db
      .insert(offersTable)
      .values({
        title, originalPrice, finalPrice, discountPercent,
        couponCode: couponCode ?? null,
        category: category ?? null,
        imageUrl: imageUrl ?? null,
        productUrl: productUrl ?? null,
        marketplaceId,
        status: status ?? "active",
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning();

    const [mp] = await db
      .select({ name: marketplacesTable.name, color: marketplacesTable.color })
      .from(marketplacesTable)
      .where(eq(marketplacesTable.id, offer.marketplaceId))
      .limit(1);

    res.status(201).json({ ...offer, marketplaceName: mp?.name ?? null, marketplaceColor: mp?.color ?? null });
  } catch (e) {
    console.error("POST /offers error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/offers/:id", requireRole("admin"), async (req, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    const updates = req.body as Partial<typeof offersTable.$inferInsert>;
    if (updates.expiresAt && typeof updates.expiresAt === "string") {
      updates.expiresAt = new Date(updates.expiresAt as unknown as string) as unknown as typeof updates.expiresAt;
    }
    const [updated] = await db
      .update(offersTable)
      .set(updates)
      .where(eq(offersTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ message: "Oferta não encontrada" });
      return;
    }

    const [mp] = await db
      .select({ name: marketplacesTable.name, color: marketplacesTable.color })
      .from(marketplacesTable)
      .where(eq(marketplacesTable.id, updated.marketplaceId))
      .limit(1);

    res.json({ ...updated, marketplaceName: mp?.name ?? null, marketplaceColor: mp?.color ?? null });
  } catch (e) {
    console.error("PUT /offers/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.delete("/offers/:id", requireRole("admin"), async (req, res): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    const [deleted] = await db
      .delete(offersTable)
      .where(eq(offersTable.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ message: "Oferta não encontrada" });
      return;
    }
    res.status(204).send();
  } catch (e) {
    console.error("DELETE /offers/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
