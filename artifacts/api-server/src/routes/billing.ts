import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { getUncachableStripeClient, getStripePublishableKey } from "../stripeClient";

export const publicBillingRouter: IRouter = Router();

publicBillingRouter.get("/billing/stripe-key", async (_req, res): Promise<void> => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("GET /billing/stripe-key error:", msg);
    res.status(500).json({ message: "Erro ao obter chave Stripe" });
  }
});

const router: IRouter = Router();

router.get("/billing/subscription", async (req, res): Promise<void> => {
  try {
    const userId = req.user!.sub;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    let subscription: Record<string, unknown> | null = null;
    if (user.stripeSubscriptionId) {
      try {
        const subResult = await db.execute(
          sql`SELECT * FROM stripe.subscriptions WHERE id = ${user.stripeSubscriptionId} LIMIT 1`
        );
        subscription = (subResult.rows[0] as Record<string, unknown>) ?? null;
      } catch {
        subscription = null;
      }
    }

    res.json({
      subscription,
      subscriptionStatus: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      planId: user.planId,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("GET /billing/subscription error:", msg);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/billing/portal", async (req, res): Promise<void> => {
  try {
    const userId = req.user!.sub;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    if (!user.stripeCustomerId) {
      res.status(400).json({ message: "Nenhuma assinatura ativa encontrada" });
      return;
    }

    const stripe = await getUncachableStripeClient();
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_ORIGIN ||
          `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`
        : `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/dashboard/configuracoes`,
    });

    res.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("POST /billing/portal error:", msg);
    res.status(500).json({ message: "Erro ao criar portal de faturamento" });
  }
});

router.post("/billing/setup-intent", async (req, res): Promise<void> => {
  try {
    const userId = req.user!.sub;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const stripe = await getUncachableStripeClient();

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: String(user.id) },
      });
      customerId = customer.id;
      await db
        .update(usersTable)
        .set({ stripeCustomerId: customerId })
        .where(eq(usersTable.id, userId));
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("POST /billing/setup-intent error:", msg);
    res.status(500).json({ message: "Erro ao criar SetupIntent" });
  }
});

export default router;
