import express from "express";
const router = express.Router();

import {
  addEmployeeToTask,
  addMilestones,
  createTask,
  deleteTask,
  getTasksByBoss,
  getTasksByEmployee,
  getTasksByManager,
  removeEmployeeFromTask,
  updateMilestone,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { authorizePermission } from "../middlewares/authorizePermission.js";

router.post(
  "/create",
  verifyToken,
  authorizePermission("can_create_task"),
  createTask
);
router.delete(
  "/:taskId",
  verifyToken,
  authorizePermission("can_delete_task"),
  deleteTask
);
router.put(
  "/:taskId/employees/add",
  verifyToken,
  authorizePermission("can_add_emp_to_task"),
  addEmployeeToTask
);
router.put(
  "/:taskId/employees/remove/:employeeId",
  verifyToken,
  authorizePermission("can_remove_emp_from_task"),
  removeEmployeeFromTask
);
router.patch(
  "/status/:taskId",
  verifyToken,
  authorizePermission("can_update_task_status"),
  updateTaskStatus
);
router.post(
  "/:taskId/milestone",
  verifyToken,
  authorizePermission("can_add_milestone"),
  addMilestones
);
router.put(
  "/:taskId/milestone/:milestoneIndex",
  verifyToken,
  authorizePermission("can_update_milestone"),
  updateMilestone
);

router.get("/boss", verifyToken, getTasksByBoss);
router.get("/manager", verifyToken, getTasksByManager);
router.get("/employee", verifyToken, getTasksByEmployee);

export default router;
