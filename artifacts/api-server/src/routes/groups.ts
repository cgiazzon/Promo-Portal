import { Router, type IRouter } from "express";
import { CreateGroupBody, UpdateGroupBody } from "@workspace/api-zod";

const router: IRouter = Router();

const mockGroups = [
  { id: 1, name: "Ofertas Tech & Games", niche: "Eletrônicos", connectionToken: "zapi_tk_abc123", connectionStatus: "connected", entrepreneurId: 1, createdAt: new Date("2025-02-01").toISOString(), sendCount: 234, clickCount: 1456 },
  { id: 2, name: "Promos Casa & Decoração", niche: "Casa", connectionToken: "zapi_tk_def456", connectionStatus: "connected", entrepreneurId: 1, createdAt: new Date("2025-02-15").toISOString(), sendCount: 178, clickCount: 923 },
  { id: 3, name: "Moda & Beleza Ofertas", niche: "Moda", connectionToken: null, connectionStatus: "disconnected", entrepreneurId: 1, createdAt: new Date("2025-03-01").toISOString(), sendCount: 45, clickCount: 234 },
];

router.get("/groups", (_req, res) => {
  res.json(mockGroups);
});

router.post("/groups", (req, res) => {
  const body = CreateGroupBody.parse(req.body);
  res.status(201).json({ id: 4, ...body, connectionStatus: "disconnected", entrepreneurId: 1, createdAt: new Date().toISOString(), sendCount: 0, clickCount: 0 });
});

router.get("/groups/:id", (req, res): void => {
  const group = mockGroups.find(g => g.id === parseInt(req.params.id));
  if (!group) { res.status(404).json({ message: "Grupo não encontrado" }); return; }
  res.json(group);
});

router.put("/groups/:id", (req, res) => {
  const body = UpdateGroupBody.parse(req.body);
  const group = mockGroups.find(g => g.id === parseInt(req.params.id));
  res.json({ ...group, ...body });
});

router.delete("/groups/:id", (_req, res) => {
  res.status(204).send();
});

router.post("/groups/:id/test-connection", (_req, res) => {
  res.json({ connected: true, message: "Conexão estabelecida com sucesso via Z-API" });
});

export default router;
