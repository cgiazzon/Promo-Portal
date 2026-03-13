import { Router, type IRouter } from "express";
import { LoginBody, RegisterBody } from "@workspace/api-zod";

const router: IRouter = Router();

let currentUser: any = null;

router.post("/auth/login", (req, res) => {
  const body = LoginBody.parse(req.body);
  
  let role = "entrepreneur";
  if (body.email === "admin@pegapromo.com") role = "admin";
  if (body.email === "colaborador@pegapromo.com") role = "collaborator";

  currentUser = {
    id: role === "admin" ? 1 : role === "collaborator" ? 3 : 2,
    name: role === "admin" ? "Admin PEGAPROMO" : role === "collaborator" ? "Maria Assistente" : "João Empreendedor",
    email: body.email,
    phone: "(11) 99999-0000",
    role,
    planId: 2,
    status: "active",
    trialEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  res.json({
    token: "mock-jwt-token-" + Date.now(),
    user: currentUser,
  });
});

router.post("/auth/register", (req, res) => {
  const body = RegisterBody.parse(req.body);
  currentUser = {
    id: 10,
    name: body.name,
    email: body.email,
    phone: body.phone,
    role: "entrepreneur",
    planId: body.planId,
    status: "trial",
    trialEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  res.status(201).json({
    token: "mock-jwt-token-" + Date.now(),
    user: currentUser,
  });
});

router.get("/auth/me", (_req, res) => {
  if (!currentUser) {
    currentUser = {
      id: 2,
      name: "João Empreendedor",
      email: "joao@email.com",
      phone: "(11) 99999-0000",
      role: "entrepreneur",
      planId: 2,
      status: "active",
      trialEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date("2025-01-15").toISOString(),
    };
  }
  res.json(currentUser);
});

router.post("/auth/logout", (_req, res) => {
  currentUser = null;
  res.json({ success: true });
});

export default router;
