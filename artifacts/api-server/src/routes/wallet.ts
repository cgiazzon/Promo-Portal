import { Router, type IRouter } from "express";

const router: IRouter = Router();

const mockWallet = {
  id: 1,
  availableBalance: 847.50,
  pendingBalance: 1234.80,
  totalWithdrawn: 2560.00,
  pixKeyType: "cpf",
  pixKey: "123.456.789-00",
  pendingCommissions: [
    { id: 1, saleAmount: 189.90, commissionPercent: 8.5, commissionAmount: 16.14, marketplaceName: "Shopee", offerTitle: "Fone Bluetooth TWS Pro 5.0", groupName: "Ofertas Tech & Games", status: "pending", saleDate: new Date(Date.now() - 10 * 86400000).toISOString(), releaseDate: new Date(Date.now() + 25 * 86400000).toISOString() },
    { id: 2, saleAmount: 249.00, commissionPercent: 6.0, commissionAmount: 14.94, marketplaceName: "Amazon", offerTitle: "Echo Dot 5ª Geração", groupName: "Ofertas Tech & Games", status: "pending", saleDate: new Date(Date.now() - 5 * 86400000).toISOString(), releaseDate: new Date(Date.now() + 30 * 86400000).toISOString() },
    { id: 3, saleAmount: 499.90, commissionPercent: 8.5, commissionAmount: 42.49, marketplaceName: "Shopee", offerTitle: "Aspirador Robô Inteligente", groupName: "Promos Casa & Decoração", status: "pending", saleDate: new Date(Date.now() - 15 * 86400000).toISOString(), releaseDate: new Date(Date.now() + 20 * 86400000).toISOString() },
  ],
  transactions: [
    { id: 1, type: "credit", amount: 42.49, description: "Comissão - Aspirador Robô Inteligente (Shopee)", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 2, type: "credit", amount: 18.74, description: "Comissão - Panela Elétrica (Mercado Livre)", createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 3, type: "debit", amount: -350.00, description: "Saque via Pix - CPF 123.456.789-00", createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: 4, type: "credit", amount: 89.90, description: "Comissão - Kit Camisetas (Temu)", createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: 5, type: "credit", amount: 14.94, description: "Comissão - Echo Dot (Amazon)", createdAt: new Date(Date.now() - 12 * 86400000).toISOString() },
  ],
};

router.get("/wallet", (_req, res) => {
  res.json(mockWallet);
});

router.put("/wallet/pix-key", (req, res) => {
  res.json({ ...mockWallet, pixKeyType: req.body.pixKeyType, pixKey: req.body.pixKey });
});

router.post("/wallet/withdraw", (req, res) => {
  res.status(201).json({
    id: 10,
    amount: req.body.amount,
    pixKey: mockWallet.pixKey,
    pixKeyType: mockWallet.pixKeyType,
    status: "pending",
    requestedAt: new Date().toISOString(),
    processedAt: null,
  });
});

export default router;
