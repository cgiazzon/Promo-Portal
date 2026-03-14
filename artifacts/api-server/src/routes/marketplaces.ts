import { Router, type IRouter } from "express";
import { CreateMarketplaceBody, UpdateMarketplaceBody } from "@workspace/api-zod";

const router: IRouter = Router();

const marketplaces = [
  { id: 1, name: "Shopee", slug: "shopee", affiliateCode: "KEROPROMO_SH01", commissionPercent: 8.5, color: "#EE4D2D", secondaryColor: null, logoUrl: null },
  { id: 2, name: "Temu", slug: "temu", affiliateCode: "KEROPROMO_TM01", commissionPercent: 10.0, color: "#FF6B35", secondaryColor: null, logoUrl: null },
  { id: 3, name: "Amazon", slug: "amazon", affiliateCode: "KEROPROMO_AZ01", commissionPercent: 6.0, color: "#FF9900", secondaryColor: "#232F3E", logoUrl: null },
  { id: 4, name: "Mercado Livre", slug: "mercado-livre", affiliateCode: "KEROPROMO_ML01", commissionPercent: 7.5, color: "#FFE600", secondaryColor: "#3483FA", logoUrl: null },
];

router.get("/marketplaces", (_req, res) => {
  res.json(marketplaces);
});

router.post("/marketplaces", (req, res) => {
  const body = CreateMarketplaceBody.parse(req.body);
  res.status(201).json({ id: 5, ...body });
});

router.put("/marketplaces/:id", (req, res) => {
  const body = UpdateMarketplaceBody.parse(req.body);
  const id = parseInt(req.params.id);
  const mp = marketplaces.find(m => m.id === id);
  res.json({ ...mp, ...body });
});

export default router;
