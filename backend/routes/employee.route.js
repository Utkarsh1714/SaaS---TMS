import express from "express";
const router = express.Router();

import verifyToken from "../middlewares/verifyToken.js";
import { authorizePermission } from "../middlewares/authorizePermission.js";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getSingleEmployee,
  updateOrganizationalDetails,
  updatePersonalDetails,
} from "../controllers/user.controller.js";

router.get("/all-employee", verifyToken, getAllEmployees);
router.get("/:id", verifyToken, getSingleEmployee);
router.post(
  "/",
  verifyToken,
  authorizePermission("employee.create"),
  createEmployee
);
router.put(
  "/:id",
  verifyToken,
  authorizePermission("employee.updateOrgDetails"),
  updateOrganizationalDetails
);
router.put(
  "/:id",
  verifyToken,
  authorizePermission("employee.updatePersonal"),
  updatePersonalDetails
);
router.delete(
  "/:id",
  verifyToken,
  authorizePermission("employee.delete"),
  deleteEmployee
);

export default router;
