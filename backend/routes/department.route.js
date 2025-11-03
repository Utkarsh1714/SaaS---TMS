import express from "express";
const router = express.Router();

import verifyToken from "../middlewares/verifyToken.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { authorizePermission } from "../middlewares/authorizePermission.js";
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartmentWithDetails,
  getSingleDepartmentWithDetails,
} from "../controllers/department.controller.js";

router.post(
  "/",
  verifyToken,
  authorizePermission("can_create_department"),
  createDepartment
);
router.get("/", verifyToken, getDepartment);
router.get("/details", verifyToken, getDepartmentWithDetails);
router.get("/details/:id", verifyToken, getSingleDepartmentWithDetails);
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("can_delete_department"),
  deleteDepartment
);

export default router;
