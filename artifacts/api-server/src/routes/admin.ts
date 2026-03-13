import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/admin/dashboard", (_req, res) => {
  res.json({
    activeEntrepreneurs: 127,
    totalGroups: 342,
    totalOffersSent: 8945,
    totalClicks: 45230,
    mrr: 3847.30,
    subscriptionsByPlan: { Starter: 45, Pro: 62, Business: 20 },
    commissionsToRelease: 12450.80,
    pendingWithdrawals: 3200.00,
    pendingWithdrawalsCount: 8,
  });
});

router.get("/admin/entrepreneurs", (_req, res) => {
  res.json([
    { id: 1, name: "João Empreendedor", email: "joao@email.com", phone: "(11) 99999-0000", status: "active", planName: "Pro", trialEndsAt: null, groupCount: 3, scheduledOffers: 12, walletBalance: 847.50, createdAt: new Date("2025-01-15").toISOString() },
    { id: 2, name: "Ana Santos", email: "ana@email.com", phone: "(21) 98888-1111", status: "active", planName: "Business", trialEndsAt: null, groupCount: 8, scheduledOffers: 45, walletBalance: 2340.00, createdAt: new Date("2025-01-20").toISOString() },
    { id: 3, name: "Carlos Oliveira", email: "carlos@email.com", phone: "(31) 97777-2222", status: "trial", planName: "Starter", trialEndsAt: new Date(Date.now() + 3 * 86400000).toISOString(), groupCount: 1, scheduledOffers: 5, walletBalance: 0, createdAt: new Date("2025-03-08").toISOString() },
    { id: 4, name: "Fernanda Lima", email: "fernanda@email.com", phone: "(41) 96666-3333", status: "overdue", planName: "Pro", trialEndsAt: null, groupCount: 2, scheduledOffers: 0, walletBalance: 156.30, createdAt: new Date("2025-02-10").toISOString() },
    { id: 5, name: "Ricardo Mendes", email: "ricardo@email.com", phone: "(51) 95555-4444", status: "cancelled", planName: "Starter", trialEndsAt: null, groupCount: 0, scheduledOffers: 0, walletBalance: 0, createdAt: new Date("2025-02-01").toISOString() },
  ]);
});

router.get("/admin/commissions", (_req, res) => {
  res.json([
    { id: 1, entrepreneurName: "João Empreendedor", saleAmount: 189.90, commissionPercent: 8.5, commissionAmount: 16.14, marketplaceName: "Shopee", offerTitle: "Fone Bluetooth TWS Pro 5.0", groupName: "Ofertas Tech & Games", status: "available", saleDate: new Date(Date.now() - 40 * 86400000).toISOString(), releaseDate: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: 2, entrepreneurName: "Ana Santos", saleAmount: 499.90, commissionPercent: 10.0, commissionAmount: 49.99, marketplaceName: "Temu", offerTitle: "Kit Camisetas Premium", groupName: "Moda Feminina", status: "pending", saleDate: new Date(Date.now() - 10 * 86400000).toISOString(), releaseDate: new Date(Date.now() + 25 * 86400000).toISOString() },
    { id: 3, entrepreneurName: "João Empreendedor", saleAmount: 249.00, commissionPercent: 6.0, commissionAmount: 14.94, marketplaceName: "Amazon", offerTitle: "Echo Dot 5ª Geração", groupName: "Ofertas Tech & Games", status: "pending", saleDate: new Date(Date.now() - 5 * 86400000).toISOString(), releaseDate: new Date(Date.now() + 30 * 86400000).toISOString() },
    { id: 4, entrepreneurName: "Ana Santos", saleAmount: 899.90, commissionPercent: 7.5, commissionAmount: 67.49, marketplaceName: "Mercado Livre", offerTitle: "Notebook Acer Aspire", groupName: "Tech Offers", status: "withdrawn", saleDate: new Date(Date.now() - 50 * 86400000).toISOString(), releaseDate: new Date(Date.now() - 15 * 86400000).toISOString() },
  ]);
});

router.get("/admin/withdrawals", (_req, res) => {
  res.json([
    { id: 1, entrepreneurName: "João Empreendedor", amount: 350.00, pixKey: "123.456.789-00", pixKeyType: "cpf", status: "pending", requestedAt: new Date(Date.now() - 1 * 86400000).toISOString(), processedAt: null },
    { id: 2, entrepreneurName: "Ana Santos", amount: 500.00, pixKey: "ana@email.com", pixKeyType: "email", status: "pending", requestedAt: new Date(Date.now() - 2 * 86400000).toISOString(), processedAt: null },
    { id: 3, entrepreneurName: "João Empreendedor", amount: 200.00, pixKey: "123.456.789-00", pixKeyType: "cpf", status: "processed", requestedAt: new Date(Date.now() - 10 * 86400000).toISOString(), processedAt: new Date(Date.now() - 8 * 86400000).toISOString() },
  ]);
});

router.post("/admin/withdrawals/:id/process", (req, res) => {
  res.json({
    id: parseInt(req.params.id),
    entrepreneurName: "Empreendedor",
    amount: 350.00,
    pixKey: "123.456.789-00",
    pixKeyType: "cpf",
    status: "processed",
    requestedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    processedAt: new Date().toISOString(),
  });
});

router.get("/admin/subscriptions", (_req, res) => {
  res.json([
    { id: 1, entrepreneurName: "João Empreendedor", planName: "Pro", status: "active", amount: 29.90, startedAt: new Date("2025-01-25").toISOString(), nextBillingAt: new Date(Date.now() + 15 * 86400000).toISOString() },
    { id: 2, entrepreneurName: "Ana Santos", planName: "Business", status: "active", amount: 99.90, startedAt: new Date("2025-01-30").toISOString(), nextBillingAt: new Date(Date.now() + 20 * 86400000).toISOString() },
    { id: 3, entrepreneurName: "Carlos Oliveira", planName: "Starter", status: "trial", amount: 9.90, startedAt: new Date("2025-03-08").toISOString(), nextBillingAt: new Date(Date.now() + 3 * 86400000).toISOString() },
    { id: 4, entrepreneurName: "Fernanda Lima", planName: "Pro", status: "overdue", amount: 29.90, startedAt: new Date("2025-02-10").toISOString(), nextBillingAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  ]);
});

export default router;
