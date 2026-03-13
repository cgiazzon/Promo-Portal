import { Router, type IRouter } from "express";

const router: IRouter = Router();

const mockCollaborators = [
  { id: 1, name: "Maria Silva", email: "maria@email.com", permissions: ["catalog", "schedules", "send_history"], status: "active", createdAt: new Date("2025-02-20").toISOString() },
  { id: 2, name: null, email: "pedro@email.com", permissions: ["catalog", "schedules"], status: "pending", createdAt: new Date("2025-03-05").toISOString() },
];

router.get("/collaborators", (_req, res) => {
  res.json(mockCollaborators);
});

router.post("/collaborators", (req, res) => {
  res.status(201).json({ id: 3, name: null, email: req.body.email, permissions: req.body.permissions, status: "pending", createdAt: new Date().toISOString() });
});

router.put("/collaborators/:id", (req, res) => {
  const collab = mockCollaborators.find(c => c.id === parseInt(req.params.id));
  res.json({ ...collab, permissions: req.body.permissions });
});

router.delete("/collaborators/:id", (_req, res) => {
  res.status(204).send();
});

export default router;
