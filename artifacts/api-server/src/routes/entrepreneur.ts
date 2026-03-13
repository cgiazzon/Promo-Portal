import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/entrepreneur/dashboard", (_req, res) => {
  res.json({
    groupCount: 3,
    scheduledToday: 4,
    weeklyClicks: 892,
    availableBalance: 847.50,
    pendingBalance: 1234.80,
    monthlyWithdrawn: 350.00,
    trialDaysLeft: 5,
    notifications: [
      { id: 1, message: "Nova oferta adicionada ao catálogo: Smartwatch Fitness com 49% OFF", type: "info", createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, message: "Comissão de R$ 42,49 liberada na sua carteira!", type: "success", createdAt: new Date(Date.now() - 7200000).toISOString() },
      { id: 3, message: "Seu relatório semanal está disponível. Você gerou 892 cliques esta semana!", type: "info", createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 4, message: "Atenção: Seu trial expira em 5 dias. Ative seu plano para continuar!", type: "warning", createdAt: new Date(Date.now() - 172800000).toISOString() },
    ],
  });
});

router.get("/entrepreneur/metrics", (_req, res) => {
  res.json({
    clicksByOffer: [
      { label: "Echo Dot 5ª Geração", value: 1340 },
      { label: "Fone Bluetooth TWS Pro", value: 892 },
      { label: "Smartwatch Fitness", value: 780 },
      { label: "Mochila Notebook", value: 534 },
      { label: "Aspirador Robô", value: 312 },
    ],
    clicksByGroup: [
      { label: "Ofertas Tech & Games", value: 1456 },
      { label: "Promos Casa & Decoração", value: 923 },
      { label: "Moda & Beleza Ofertas", value: 234 },
    ],
    clicksByMarketplace: [
      { label: "Shopee", value: 1204 },
      { label: "Amazon", value: 1874 },
      { label: "Temu", value: 1347 },
      { label: "Mercado Livre", value: 812 },
    ],
    topOffers: [
      { label: "Echo Dot 5ª Geração", value: 1340 },
      { label: "Fone Bluetooth TWS Pro", value: 892 },
      { label: "Smartwatch Fitness", value: 780 },
    ],
    chartData: [
      { date: "2025-03-07", clicks: 120, sales: 8 },
      { date: "2025-03-08", clicks: 145, sales: 12 },
      { date: "2025-03-09", clicks: 98, sales: 5 },
      { date: "2025-03-10", clicks: 167, sales: 15 },
      { date: "2025-03-11", clicks: 134, sales: 10 },
      { date: "2025-03-12", clicks: 189, sales: 18 },
      { date: "2025-03-13", clicks: 156, sales: 14 },
    ],
  });
});

router.get("/entrepreneur/financial", (_req, res) => {
  res.json({
    totalSales: 4567.80,
    totalCommissions: 398.50,
    totalAvailable: 847.50,
    totalWithdrawn: 2560.00,
    salesByGroup: [
      { label: "Ofertas Tech & Games", salesCount: 34, totalValue: 2890.00, commission: 198.30 },
      { label: "Promos Casa & Decoração", salesCount: 22, totalValue: 1345.00, commission: 134.50 },
      { label: "Moda & Beleza Ofertas", salesCount: 8, totalValue: 332.80, commission: 65.70 },
    ],
    salesByOffer: [
      { label: "Echo Dot 5ª Geração (Amazon)", salesCount: 15, totalValue: 3735.00, commission: 224.10 },
      { label: "Fone Bluetooth TWS Pro (Shopee)", salesCount: 12, totalValue: 1078.80, commission: 91.70 },
      { label: "Kit Camisetas Básicas (Temu)", salesCount: 8, totalValue: 1199.20, commission: 119.92 },
    ],
    chartData: [
      { date: "2025-03-07", clicks: 120, sales: 450.00 },
      { date: "2025-03-08", clicks: 145, sales: 680.00 },
      { date: "2025-03-09", clicks: 98, sales: 320.00 },
      { date: "2025-03-10", clicks: 167, sales: 890.00 },
      { date: "2025-03-11", clicks: 134, sales: 540.00 },
      { date: "2025-03-12", clicks: 189, sales: 1230.00 },
      { date: "2025-03-13", clicks: 156, sales: 780.00 },
    ],
  });
});

router.get("/profile", (_req, res) => {
  res.json({ id: 1, name: "João Empreendedor", email: "joao@email.com", phone: "(11) 99999-0000" });
});

router.put("/profile", (req, res) => {
  res.json({ id: 1, ...req.body });
});

export default router;
