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

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(marketplacesRouter);
router.use(offersRouter);
router.use(groupsRouter);
router.use(schedulesRouter);
router.use(sendHistoryRouter);
router.use(walletRouter);
router.use(commissionsRouter);
router.use(collaboratorsRouter);
router.use(plansRouter);
router.use(featuredRouter);
router.use(adminRouter);
router.use(entrepreneurRouter);

export default router;
