import { Router, type IRouter } from "express";
import { LoginBody, RegisterBody } from "@workspace/api-zod";

const router: IRouter = Router();

interface MockUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  planId: number;
  status: string;
  trialEndsAt: string;
  createdAt: string;
}

const sessions = new Map<string, MockUser>();

function getSessionToken(req: { headers: Record<string, string | string[] | undefined> }): string {
  const authHeader = req.headers["authorization"];
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return "default-session";
}

export function getSessionUser(req: { headers: Record<string, string | string[] | undefined> }): MockUser | null {
  const token = getSessionToken(req);
  return sessions.get(token) || null;
}

router.post("/auth/login", (req, res) => {
  const body = LoginBody.parse(req.body);
  
  let role = "entrepreneur";
  if (body.email === "eduardo@oversaas.net" && body.password === "123456@7") role = "admin";
  if (body.email === "colaborador@pegapromo.com") role = "collaborator";

  const token = "mock-jwt-token-" + Date.now();
  const user: MockUser = {
    id: role === "admin" ? 1 : role === "collaborator" ? 3 : 2,
    name: role === "admin" ? "Eduardo Admin" : role === "collaborator" ? "Maria Assistente" : "João Empreendedor",
    email: body.email,
    phone: "(11) 99999-0000",
    role,
    planId: 2,
    status: "active",
    trialEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  sessions.set(token, user);

  res.json({ token, user });
});

router.post("/auth/register", (req, res) => {
  const body = RegisterBody.parse(req.body);
  const token = "mock-jwt-token-" + Date.now();
  const user: MockUser = {
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
  sessions.set(token, user);

  res.status(201).json({ token, user });
});

router.get("/auth/me", (req, res): void => {
  const user = getSessionUser(req);
  if (!user) {
    res.status(401).json({ message: "Nao autenticado" });
    return;
  }
  res.json(user);
});

router.post("/auth/logout", (req, res) => {
  const token = getSessionToken(req);
  sessions.delete(token);
  res.json({ success: true });
});

export default router;
