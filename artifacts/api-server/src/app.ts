import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import shortLinksRouter from "./routes/shortLinks";

const app: Express = express();

const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: process.env.FRONTEND_ORIGIN || "",
        credentials: true,
      }
    : { origin: true, credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", shortLinksRouter);
app.use("/api", router);

export default app;
