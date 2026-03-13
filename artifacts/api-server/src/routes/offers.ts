import { Router, type IRouter } from "express";

const router: IRouter = Router();

const mockOffers = [
  { id: 1, title: "Fone Bluetooth TWS Pro 5.0 com Cancelamento de Ruído", originalPrice: 189.90, finalPrice: 89.90, discountPercent: 53, couponCode: "FONE20", category: "Eletrônicos", imageUrl: "https://placehold.co/400x400/EE4D2D/white?text=Fone+BT", productUrl: "https://shopee.com.br/product/1", marketplaceId: 1, marketplaceName: "Shopee", marketplaceColor: "#EE4D2D", status: "active", expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), createdAt: new Date().toISOString(), sendCount: 145, clickCount: 892 },
  { id: 2, title: "Kit 10 Camisetas Básicas Algodão Premium", originalPrice: 299.90, finalPrice: 149.90, discountPercent: 50, couponCode: null, category: "Moda", imageUrl: "https://placehold.co/400x400/FF6B35/white?text=Kit+Camisetas", productUrl: "https://temu.com/product/2", marketplaceId: 2, marketplaceName: "Temu", marketplaceColor: "#FF6B35", status: "active", expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(), createdAt: new Date().toISOString(), sendCount: 98, clickCount: 567 },
  { id: 3, title: "Echo Dot 5ª Geração Smart Speaker com Alexa", originalPrice: 399.00, finalPrice: 249.00, discountPercent: 38, couponCode: "ALEXA15", category: "Eletrônicos", imageUrl: "https://placehold.co/400x400/FF9900/white?text=Echo+Dot", productUrl: "https://amazon.com.br/product/3", marketplaceId: 3, marketplaceName: "Amazon", marketplaceColor: "#FF9900", status: "active", expiresAt: new Date(Date.now() + 10 * 86400000).toISOString(), createdAt: new Date().toISOString(), sendCount: 210, clickCount: 1340 },
  { id: 4, title: "Panela Elétrica de Arroz 5L Multifuncional", originalPrice: 249.90, finalPrice: 129.90, discountPercent: 48, couponCode: null, category: "Casa", imageUrl: "https://placehold.co/400x400/3483FA/white?text=Panela+Elétrica", productUrl: "https://mercadolivre.com.br/product/4", marketplaceId: 4, marketplaceName: "Mercado Livre", marketplaceColor: "#FFE600", status: "active", expiresAt: new Date(Date.now() + 3 * 86400000).toISOString(), createdAt: new Date().toISOString(), sendCount: 76, clickCount: 423 },
  { id: 5, title: "Aspirador Robô Inteligente com Mapeamento", originalPrice: 899.90, finalPrice: 499.90, discountPercent: 44, couponCode: "ROBO50", category: "Casa", imageUrl: "https://placehold.co/400x400/EE4D2D/white?text=Aspirador+Robô", productUrl: "https://shopee.com.br/product/5", marketplaceId: 1, marketplaceName: "Shopee", marketplaceColor: "#EE4D2D", status: "active", expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(), createdAt: new Date().toISOString(), sendCount: 55, clickCount: 312 },
  { id: 6, title: "Relógio Smartwatch Fitness com Monitor Cardíaco", originalPrice: 349.90, finalPrice: 179.90, discountPercent: 49, couponCode: null, category: "Eletrônicos", imageUrl: "https://placehold.co/400x400/FF6B35/white?text=Smartwatch", productUrl: "https://temu.com/product/6", marketplaceId: 2, marketplaceName: "Temu", marketplaceColor: "#FF6B35", status: "active", expiresAt: new Date(Date.now() + 6 * 86400000).toISOString(), createdAt: new Date().toISOString(), sendCount: 120, clickCount: 780 },
  { id: 7, title: "Mochila Notebook 15.6\" Impermeável USB", originalPrice: 199.90, finalPrice: 99.90, discountPercent: 50, couponCode: "MOCHILA10", category: "Acessórios", imageUrl: "https://placehold.co/400x400/FF9900/white?text=Mochila", productUrl: "https://amazon.com.br/product/7", marketplaceId: 3, marketplaceName: "Amazon", marketplaceColor: "#FF9900", status: "active", expiresAt: new Date(Date.now() + 8 * 86400000).toISOString(), createdAt: new Date().toISOString(), sendCount: 88, clickCount: 534 },
  { id: 8, title: "Conjunto de Panelas Antiaderente 10 Peças", originalPrice: 459.90, finalPrice: 229.90, discountPercent: 50, couponCode: null, category: "Casa", imageUrl: "https://placehold.co/400x400/3483FA/white?text=Panelas", productUrl: "https://mercadolivre.com.br/product/8", marketplaceId: 4, marketplaceName: "Mercado Livre", marketplaceColor: "#FFE600", status: "active", expiresAt: new Date(Date.now() + 12 * 86400000).toISOString(), createdAt: new Date().toISOString(), sendCount: 67, clickCount: 389 },
];

router.get("/offers", (req, res) => {
  let result = [...mockOffers];
  if (req.query.marketplace) {
    result = result.filter(o => o.marketplaceName.toLowerCase().includes((req.query.marketplace as string).toLowerCase()));
  }
  if (req.query.category) {
    result = result.filter(o => o.category === req.query.category);
  }
  if (req.query.status) {
    result = result.filter(o => o.status === req.query.status);
  }
  res.json(result);
});

router.post("/offers", (req, res) => {
  res.status(201).json({ id: 9, ...req.body, sendCount: 0, clickCount: 0, createdAt: new Date().toISOString() });
});

router.get("/offers/:id", (req, res): void => {
  const offer = mockOffers.find(o => o.id === parseInt(req.params.id));
  if (!offer) { res.status(404).json({ message: "Oferta não encontrada" }); return; }
  res.json(offer);
});

router.put("/offers/:id", (req, res) => {
  const offer = mockOffers.find(o => o.id === parseInt(req.params.id));
  res.json({ ...offer, ...req.body });
});

router.delete("/offers/:id", (_req, res) => {
  res.status(204).send();
});

router.post("/offers/extract", (req, res) => {
  const url = req.body.url || "";
  let marketplace = "shopee";
  if (url.includes("temu")) marketplace = "temu";
  if (url.includes("amazon")) marketplace = "amazon";
  if (url.includes("mercadolivre") || url.includes("mercado")) marketplace = "mercado-livre";

  res.json({
    title: "Produto Exemplo Extraído - Alta Qualidade",
    price: 199.90,
    imageUrl: "https://placehold.co/400x400/25D366/white?text=Produto",
    marketplace,
  });
});

export default router;
