import { Router, type IRouter } from "express";

const router: IRouter = Router();

const mockSchedules = [
  { id: 1, offerId: 1, offerTitle: "Fone Bluetooth TWS Pro 5.0", groupIds: [1, 2], groupNames: ["Ofertas Tech & Games", "Promos Casa & Decoração"], scheduledAt: new Date(Date.now() + 3600000).toISOString(), status: "pending", shortUrl: "https://pgp.link/abc123", createdAt: new Date().toISOString() },
  { id: 2, offerId: 3, offerTitle: "Echo Dot 5ª Geração Smart Speaker", groupIds: [1], groupNames: ["Ofertas Tech & Games"], scheduledAt: new Date(Date.now() + 7200000).toISOString(), status: "pending", shortUrl: "https://pgp.link/def456", createdAt: new Date().toISOString() },
  { id: 3, offerId: 5, offerTitle: "Aspirador Robô Inteligente", groupIds: [2], groupNames: ["Promos Casa & Decoração"], scheduledAt: new Date(Date.now() + 86400000).toISOString(), status: "pending", shortUrl: "https://pgp.link/ghi789", createdAt: new Date().toISOString() },
  { id: 4, offerId: 2, offerTitle: "Kit 10 Camisetas Básicas", groupIds: [3], groupNames: ["Moda & Beleza Ofertas"], scheduledAt: new Date(Date.now() - 3600000).toISOString(), status: "sent", shortUrl: "https://pgp.link/jkl012", createdAt: new Date(Date.now() - 7200000).toISOString() },
];

router.get("/schedules", (_req, res) => {
  res.json(mockSchedules);
});

router.post("/schedules", (req, res) => {
  res.status(201).json({ id: 5, ...req.body, offerTitle: "Nova Oferta Agendada", groupNames: ["Grupo 1"], status: "pending", shortUrl: "https://pgp.link/" + Math.random().toString(36).slice(2, 8), createdAt: new Date().toISOString() });
});

router.put("/schedules/:id", (req, res) => {
  const sched = mockSchedules.find(s => s.id === parseInt(req.params.id));
  res.json({ ...sched, ...req.body });
});

router.delete("/schedules/:id", (_req, res) => {
  res.status(204).send();
});

export default router;
