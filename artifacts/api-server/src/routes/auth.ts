import { Router, type IRouter } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { eq, sql } from "drizzle-orm";
import { db, usersTable, refreshTokensTable, walletsTable } from "@workspace/db";
import { LoginBody, RegisterBody } from "@workspace/api-zod";
import type { User } from "@workspace/db";
import { getUncachableStripeClient } from "../stripeClient";

const router: IRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be set");
}

export interface AuthPayload {
  sub: number;
  role: string;
  email: string;
}

function signAccessToken(user: Pick<User, "id" | "role" | "email">): string {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email } satisfies AuthPayload,
    JWT_SECRET!,
    { expiresIn: "15m" }
  );
}

function signRefreshToken(userId: number): string {
  return jwt.sign({ sub: userId }, JWT_REFRESH_SECRET!, { expiresIn: "7d" });
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function storeRefreshToken(userId: number, refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.insert(refreshTokensTable).values({ userId, tokenHash, expiresAt });
}

function safeUserResponse(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    planId: user.planId,
    status: user.status,
    subscriptionStatus: user.subscriptionStatus,
    stripeCustomerId: user.stripeCustomerId ?? null,
    trialEndsAt: user.trialEndsAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}

router.post("/auth/login", async (req, res): Promise<void> => {
  try {
    const body = LoginBody.parse(req.body);

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, body.email))
      .limit(1);

    if (!user) {
      res.status(401).json({ message: "Email ou senha incorretos" });
      return;
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Email ou senha incorretos" });
      return;
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user.id);
    await storeRefreshToken(user.id, refreshToken);

    res.json({ token: accessToken, refreshToken, user: safeUserResponse(user) });
  } catch (e: unknown) {
    console.error("Login error:", e);
    res.status(400).json({ message: "Dados inválidos" });
  }
});

router.post("/auth/register", async (req, res): Promise<void> => {
  try {
    const body = RegisterBody.parse(req.body);

    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, body.email))
      .limit(1);

    if (existing) {
      res.status(409).json({ message: "Email já cadastrado" });
      return;
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const trialEndsAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

    const [user] = await db
      .insert(usersTable)
      .values({
        name: body.name,
        email: body.email,
        password: passwordHash,
        phone: body.phone,
        role: "entrepreneur",
        planId: body.planId ?? null,
        status: "trial",
        trialEndsAt,
      })
      .returning();

    await db.insert(walletsTable).values({
      entrepreneurId: user.id,
      availableBalance: 0,
      pendingBalance: 0,
      totalWithdrawn: 0,
    });

    let stripeCustomerId: string | undefined;
    let stripeSubscriptionId: string | undefined;
    let stripePriceId: string | undefined;

    try {
      const stripe = await getUncachableStripeClient();

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        phone: user.phone ?? undefined,
        metadata: { userId: String(user.id) },
      });
      stripeCustomerId = customer.id;

      const planPriceMap: Record<number, string> = await (async () => {
        const pricesResult = await db.execute(
          sql`SELECT p.id, p.metadata->>'planId' as plan_id FROM stripe.prices p WHERE p.active = true`
        );
        const map: Record<number, string> = {};
        for (const row of pricesResult.rows as any[]) {
          if (row.plan_id) map[Number(row.plan_id)] = row.id;
        }
        return map;
      })();

      const resolvedPriceId = body.planId ? planPriceMap[body.planId] : undefined;
      stripePriceId = resolvedPriceId;

      if (resolvedPriceId) {
        const subscription = await stripe.subscriptions.create({
          customer: stripeCustomerId,
          items: [{ price: resolvedPriceId }],
          trial_period_days: 10,
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice.payment_intent"],
        });
        stripeSubscriptionId = subscription.id;
      }

      await db
        .update(usersTable)
        .set({
          stripeCustomerId,
          stripeSubscriptionId: stripeSubscriptionId ?? null,
          stripePriceId: stripePriceId ?? null,
          subscriptionStatus: "trialing",
        })
        .where(eq(usersTable.id, user.id));
    } catch (stripeErr: unknown) {
      const msg = stripeErr instanceof Error ? stripeErr.message : String(stripeErr);
      console.error("Stripe setup error (non-fatal):", msg);
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user.id);
    await storeRefreshToken(user.id, refreshToken);

    res.status(201).json({ token: accessToken, refreshToken, user: safeUserResponse(user) });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Register error:", msg);
    res.status(400).json({ message: "Dados inválidos" });
  }
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const authHeader = req.headers["authorization"];
  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Não autenticado" });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET!) as unknown as AuthPayload;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.sub))
      .limit(1);

    if (!user) {
      res.status(401).json({ message: "Usuário não encontrado" });
      return;
    }

    res.json(safeUserResponse(user));
  } catch (e: unknown) {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
});

router.post("/auth/refresh", async (req, res): Promise<void> => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    res.status(400).json({ message: "refreshToken é obrigatório" });
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET!) as unknown as { sub: number };
    const tokenHash = hashToken(refreshToken);

    const [stored] = await db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenHash, tokenHash))
      .limit(1);

    if (!stored || stored.expiresAt < new Date() || stored.userId !== payload.sub) {
      res.status(401).json({ message: "Refresh token inválido ou expirado" });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.sub))
      .limit(1);

    if (!user) {
      res.status(401).json({ message: "Usuário não encontrado" });
      return;
    }

    await db
      .delete(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenHash, tokenHash));

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user.id);
    await storeRefreshToken(user.id, newRefreshToken);

    res.json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (e: unknown) {
    res.status(401).json({ message: "Refresh token inválido" });
  }
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await db
      .delete(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenHash, tokenHash))
      .catch(() => {});
  }
  res.json({ success: true });
});

export function verifyAccessToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET!) as unknown as AuthPayload;
}

export default router;
