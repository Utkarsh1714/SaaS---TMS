import express from "express";
const router = express.Router();

import verifyToken from "../middlewares/verifyToken.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployeesAndStats,
  getSingleEmployee,
  updateEmployee,
} from "../controllers/user.controller.js";

router.get("/", verifyToken, getAllEmployeesAndStats);
router.get("/:id", verifyToken, getSingleEmployee);
router.post("/", verifyToken, authorizeRole("Boss"), createEmployee);
router.put("/:id", verifyToken, authorizeRole("Boss"), updateEmployee);
router.delete("/:id", verifyToken, authorizeRole("Boss"), deleteEmployee);

export default router;
