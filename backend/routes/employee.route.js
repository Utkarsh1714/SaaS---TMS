import express from "express";
const router = express.Router();

import verifyToken from "../middlewares/verifyToken.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { authorizePermission } from "../middlewares/authorizePermission.js";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getAllEmployeesAndStats,
  getSingleEmployee,
  updateEmployee,
} from "../controllers/user.controller.js";

router.get("/all-employee", verifyToken, getAllEmployees);
router.get("/:id", verifyToken, getSingleEmployee);
router.post(
  "/",
  verifyToken,
  authorizePermission("can_create_employee"),
  createEmployee
);
router.put(
  "/:id",
  verifyToken,
  authorizePermission("can_update_employee"),
  updateEmployee
);
router.delete(
  "/:id",
  verifyToken,
  authorizePermission("can_delete_employee"),
  deleteEmployee
);

export default router;
