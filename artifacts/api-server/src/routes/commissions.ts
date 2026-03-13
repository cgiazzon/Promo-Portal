import { Router, type IRouter } from "express";

const router: IRouter = Router();

const mockCommissions = [
  { id: 1, saleAmount: 189.90, commissionPercent: 8.5, commissionAmount: 16.14, marketplaceName: "Shopee", offerTitle: "Fone Bluetooth TWS Pro 5.0", groupName: "Ofertas Tech & Games", status: "available", saleDate: new Date(Date.now() - 40 * 86400000).toISOString(), releaseDate: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 2, saleAmount: 249.00, commissionPercent: 6.0, commissionAmount: 14.94, marketplaceName: "Amazon", offerTitle: "Echo Dot 5ª Geração", groupName: "Ofertas Tech & Games", status: "pending", saleDate: new Date(Date.now() - 10 * 86400000).toISOString(), releaseDate: new Date(Date.now() + 25 * 86400000).toISOString() },
  { id: 3, saleAmount: 499.90, commissionPercent: 8.5, commissionAmount: 42.49, marketplaceName: "Shopee", offerTitle: "Aspirador Robô Inteligente", groupName: "Promos Casa & Decoração", status: "available", saleDate: new Date(Date.now() - 45 * 86400000).toISOString(), releaseDate: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 4, saleAmount: 129.90, commissionPercent: 7.5, commissionAmount: 9.74, marketplaceName: "Mercado Livre", offerTitle: "Panela Elétrica de Arroz 5L", groupName: "Promos Casa & Decoração", status: "withdrawn", saleDate: new Date(Date.now() - 50 * 86400000).toISOString(), releaseDate: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: 5, saleAmount: 149.90, commissionPercent: 10.0, commissionAmount: 14.99, marketplaceName: "Temu", offerTitle: "Kit 10 Camisetas Básicas", groupName: "Moda & Beleza Ofertas", status: "pending", saleDate: new Date(Date.now() - 5 * 86400000).toISOString(), releaseDate: new Date(Date.now() + 30 * 86400000).toISOString() },
];

router.get("/commissions", (req, res) => {
  let result = [...mockCommissions];
  if (req.query.status) {
    result = result.filter(c => c.status === req.query.status);
  }
  res.json(result);
});

const mockWithdrawals = [
  { id: 1, amount: 350.00, pixKey: "123.456.789-00", pixKeyType: "cpf", status: "processed", requestedAt: new Date(Date.now() - 7 * 86400000).toISOString(), processedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 2, amount: 200.00, pixKey: "123.456.789-00", pixKeyType: "cpf", status: "processed", requestedAt: new Date(Date.now() - 20 * 86400000).toISOString(), processedAt: new Date(Date.now() - 18 * 86400000).toISOString() },
  { id: 3, amount: 150.00, pixKey: "123.456.789-00", pixKeyType: "cpf", status: "pending", requestedAt: new Date(Date.now() - 1 * 86400000).toISOString(), processedAt: null },
];

router.get("/withdrawals", (_req, res) => {
  res.json(mockWithdrawals);
});

export default router;
