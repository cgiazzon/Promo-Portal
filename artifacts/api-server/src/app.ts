import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import shortLinksRouter from "./routes/shortLinks";
import { WebhookHandlers } from "./webhookHandlers";

const app: Express = express();

const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: process.env.FRONTEND_ORIGIN || "",
        credentials: true,
      }
    : { origin: true, credentials: true };

app.use(cors(corsOptions));

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      res.status(400).json({ error: "Missing stripe-signature" });
      return;
    }
    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Stripe webhook error:", msg);
      res.status(400).json({ error: "Webhook processing error" });
    }
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", shortLinksRouter);
app.use("/api", router);

export default app;
