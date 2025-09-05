import express from "express";
import {
  getMonthyCompletionTrend,
  getUpcomingDeadlines,
  overview,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/overview-data1", overview);
router.get("/overview-data2", getMonthyCompletionTrend);
router.get("/overview-data3", getUpcomingDeadlines);

export default router;
