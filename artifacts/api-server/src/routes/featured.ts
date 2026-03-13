import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/featured-offer", (_req, res) => {
  res.json({
    id: 1,
    offerId: 3,
    offer: {
      id: 3,
      title: "Echo Dot 5ª Geração Smart Speaker com Alexa",
      originalPrice: 399.00,
      finalPrice: 249.00,
      discountPercent: 38,
      couponCode: "ALEXA15",
      category: "Eletrônicos",
      imageUrl: "https://placehold.co/400x400/FF9900/white?text=Echo+Dot",
      productUrl: "https://amazon.com.br/product/3",
      marketplaceId: 3,
      marketplaceName: "Amazon",
      marketplaceColor: "#FF9900",
      status: "active",
      expiresAt: new Date(Date.now() + 10 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      sendCount: 210,
      clickCount: 1340,
    },
    motivationalMessage: "A oferta mais clicada da semana! Envie agora para seus grupos e aumente suas comissões!",
    setAt: new Date().toISOString(),
  });
});

router.put("/featured-offer", (req, res) => {
  res.json({
    id: 1,
    offerId: req.body.offerId,
    offer: { id: req.body.offerId, title: "Oferta Destaque Atualizada", originalPrice: 299.90, finalPrice: 149.90, discountPercent: 50, status: "active", marketplaceId: 1, marketplaceName: "Shopee", marketplaceColor: "#EE4D2D" },
    motivationalMessage: req.body.motivationalMessage || "",
    setAt: new Date().toISOString(),
  });
});

export default router;
