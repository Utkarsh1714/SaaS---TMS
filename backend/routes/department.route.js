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

router.get("/", verifyToken, getDepartment);
router.get("/details", verifyToken, getDepartmentWithDetails);
router.get("/details/:id", verifyToken, getSingleDepartmentWithDetails);
router.post(
  "/",
  verifyToken,
  authorizePermission("department.create"),
  createDepartment
);
router.put(
  "/manager/change",
  verifyToken,
  authorizePermission("department.update"),
  changeDepartmentManager
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("department.delete"),
  deleteDepartment
);

export default router;
