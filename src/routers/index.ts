import { Router } from "express";
import recommendationRouter from "./recommendationRouter.js";
import testRouter from "./e2eRouter.js";

const router = Router();

router.use("/recommendations", recommendationRouter);

if (process.env.NODE_ENV === "test") {
  router.use(testRouter);
}
export default router;
