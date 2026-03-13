import { Router, type IRouter } from "express";

const router: IRouter = Router();

const mockHistory = [
  { id: 1, offerId: 1, offerTitle: "Fone Bluetooth TWS Pro 5.0", groupId: 1, groupName: "Ofertas Tech & Games", sentAt: new Date(Date.now() - 86400000).toISOString(), status: "sent", clicks: 47, shortUrl: "https://pgp.link/h001" },
  { id: 2, offerId: 1, offerTitle: "Fone Bluetooth TWS Pro 5.0", groupId: 2, groupName: "Promos Casa & Decoração", sentAt: new Date(Date.now() - 86400000).toISOString(), status: "sent", clicks: 32, shortUrl: "https://pgp.link/h002" },
  { id: 3, offerId: 3, offerTitle: "Echo Dot 5ª Geração Smart Speaker", groupId: 1, groupName: "Ofertas Tech & Games", sentAt: new Date(Date.now() - 172800000).toISOString(), status: "sent", clicks: 89, shortUrl: "https://pgp.link/h003" },
  { id: 4, offerId: 2, offerTitle: "Kit 10 Camisetas Básicas", groupId: 3, groupName: "Moda & Beleza Ofertas", sentAt: new Date(Date.now() - 259200000).toISOString(), status: "failed", clicks: 0, shortUrl: "https://pgp.link/h004" },
  { id: 5, offerId: 5, offerTitle: "Aspirador Robô Inteligente", groupId: 2, groupName: "Promos Casa & Decoração", sentAt: new Date(Date.now() - 345600000).toISOString(), status: "sent", clicks: 56, shortUrl: "https://pgp.link/h005" },
  { id: 6, offerId: 4, offerTitle: "Panela Elétrica de Arroz 5L", groupId: 2, groupName: "Promos Casa & Decoração", sentAt: new Date(Date.now() - 432000000).toISOString(), status: "sent", clicks: 28, shortUrl: "https://pgp.link/h006" },
];

router.get("/send-history", (_req, res) => {
  res.json(mockHistory);
});

export default router;
