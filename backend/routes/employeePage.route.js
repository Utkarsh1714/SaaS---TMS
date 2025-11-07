import express from "express";
import {
  EmployeeDirectory,
  employeePageAnalytics,
} from "../controllers/employeePage.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/data1", verifyToken, EmployeeDirectory);
router.get("/analytics", verifyToken, employeePageAnalytics);

export default router;
