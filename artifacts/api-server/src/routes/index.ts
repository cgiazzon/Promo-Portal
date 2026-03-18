import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import marketplacesRouter from "./marketplaces";
import offersRouter from "./offers";
import groupsRouter from "./groups";
import schedulesRouter from "./schedules";
import sendHistoryRouter from "./sendHistory";
import walletRouter from "./wallet";
import commissionsRouter from "./commissions";
import collaboratorsRouter from "./collaborators";
import plansRouter from "./plans";
import featuredRouter from "./featured";
import adminRouter from "./admin";
import entrepreneurRouter from "./entrepreneur";
import shortLinksRouter from "./shortLinks";
import { requireAuth, requireRole } from "../middlewares/auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(plansRouter);
router.use(featuredRouter);
router.use(marketplacesRouter);
router.use(shortLinksRouter);

router.use(requireAuth);
router.use(offersRouter);
router.use(groupsRouter);
router.use(schedulesRouter);
router.use(sendHistoryRouter);
router.use(walletRouter);
router.use(commissionsRouter);
router.use(collaboratorsRouter);
router.use(entrepreneurRouter);

router.use(requireRole("admin"));
router.use(adminRouter);

export default router;
