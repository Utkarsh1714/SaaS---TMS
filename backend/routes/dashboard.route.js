import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  getMonthyCompletionTrend,
  getUpcomingDeadlines,
  overview,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/overview-data1", verifyToken, overview);
router.get("/overview-data2", verifyToken, getMonthyCompletionTrend);
router.get("/overview-data3", verifyToken, getUpcomingDeadlines);

export default router;
