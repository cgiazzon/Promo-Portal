import { Router, type IRouter } from "express";

const router: IRouter = Router();

const mockPlans = [
  { id: 1, name: "Starter", slug: "starter", price: 9.90, maxGroups: 1, maxSchedulesPerMonth: 30, maxCollaborators: 0, hasAdvancedMetrics: false, isPopular: false },
  { id: 2, name: "Pro", slug: "pro", price: 29.90, maxGroups: 3, maxSchedulesPerMonth: 150, maxCollaborators: 2, hasAdvancedMetrics: true, isPopular: true },
  { id: 3, name: "Business", slug: "business", price: 99.90, maxGroups: 999, maxSchedulesPerMonth: 999999, maxCollaborators: 10, hasAdvancedMetrics: true, isPopular: false },
];

router.get("/plans", (_req, res) => {
  res.json(mockPlans);
});

router.get("/subscription", (_req, res) => {
  res.json({
    id: 1,
    planId: 2,
    planName: "Pro",
    status: "active",
    trialEndsAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    nextBillingAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    amount: 29.90,
  });
});

router.put("/subscription", (req, res) => {
  const plan = mockPlans.find(p => p.id === req.body.planId);
  res.json({
    id: 1,
    planId: req.body.planId,
    planName: plan?.name || "Pro",
    status: "active",
    trialEndsAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    nextBillingAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    amount: plan?.price || 29.90,
  });
});

export default router;
