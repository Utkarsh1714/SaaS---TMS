import express from "express";
import { EmployeeDirectory } from "../controllers/employeePage.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/data1", verifyToken, EmployeeDirectory);

export default router;
