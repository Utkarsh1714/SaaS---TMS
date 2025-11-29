import express from "express";
const router = express.Router();

import verifyToken from "../middlewares/verifyToken.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { authorizePermission } from "../middlewares/authorizePermission.js";
import {
  changeDepartmentManager,
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartmentWithDetails,
  getSingleDepartmentWithDetails,
} from "../controllers/department.controller.js";

router.post(
  "/",
  verifyToken,
  authorizePermission("can_manage_department"),
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
router.put(
  "/manager/change",
  verifyToken,
  authorizePermission("can_update_department"),
  changeDepartmentManager
)

export default router;
