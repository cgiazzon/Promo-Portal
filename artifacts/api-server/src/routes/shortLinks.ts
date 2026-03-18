import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, shortLinksTable, offersTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

function generateCode(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

router.get("/s/:code", async (req, res): Promise<void> => {
  try {
    const { code } = req.params;
    const [link] = await db
      .select()
      .from(shortLinksTable)
      .where(and(eq(shortLinksTable.shortCode, code), eq(shortLinksTable.active, true)))
      .limit(1);

    if (!link) {
      res.status(404).json({ message: "Link não encontrado" });
      return;
    }

    await db
      .update(shortLinksTable)
      .set({ clicks: link.clicks + 1 })
      .where(eq(shortLinksTable.id, link.id));

    res.redirect(301, link.originalUrl);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("GET /s/:code error:", msg);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/short-links", requireAuth, async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const links = await db
      .select()
      .from(shortLinksTable)
      .where(eq(shortLinksTable.entrepreneurId, entrepreneurId));
    res.json(links);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("GET /short-links error:", msg);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/short-links", requireAuth, async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const { originalUrl, marketplaceId, offerId } = req.body as {
      originalUrl?: string;
      marketplaceId?: number;
      offerId?: number;
    };

    let resolvedUrl = originalUrl;
    let resolvedMarketplaceId = marketplaceId ?? null;

    if (!resolvedUrl && offerId) {
      const [offer] = await db
        .select({ productUrl: offersTable.productUrl, marketplaceId: offersTable.marketplaceId })
        .from(offersTable)
        .where(eq(offersTable.id, offerId))
        .limit(1);
      if (offer?.productUrl) {
        resolvedUrl = offer.productUrl;
        resolvedMarketplaceId = offer.marketplaceId;
      }
    }

    if (!resolvedUrl) {
      res.status(400).json({ message: "URL original é obrigatória" });
      return;
    }

    let shortCode = generateCode();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await db
        .select({ id: shortLinksTable.id })
        .from(shortLinksTable)
        .where(eq(shortLinksTable.shortCode, shortCode))
        .limit(1);
      if (existing.length === 0) break;
      shortCode = generateCode();
      attempts++;
    }

    const [link] = await db
      .insert(shortLinksTable)
      .values({
        entrepreneurId,
        originalUrl: resolvedUrl,
        shortCode,
        marketplaceId: resolvedMarketplaceId,
        clicks: 0,
        active: true,
      })
      .returning();

    res.status(201).json(link);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("POST /short-links error:", msg);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
