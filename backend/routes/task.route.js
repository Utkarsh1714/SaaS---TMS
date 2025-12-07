import express from "express";
const router = express.Router();

import {
  addEmployeeToTask,
  addMilestones,
  assignTaskToTeam,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  removeEmployeeFromTask,
  updateMilestone,
  updateTaskStatus,
  updateTitleAndDesc,
} from "../controllers/task.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import { authorizePermission } from "../middlewares/authorizePermission.js";

router.post(
  "/create",
  verifyToken,
  authorizePermission("task.create"),
  createTask
);
router.delete(
  "/:taskId",
  verifyToken,
  authorizePermission("task.delete"),
  deleteTask
);
router.put(
  "/:taskId/employees/add",
  verifyToken,
  authorizePermission("task.addEmployee"),
  addEmployeeToTask
);
router.put(
  "/:taskId/employees/remove/:employeeId",
  verifyToken,
  authorizePermission("task.removeEmployee"),
  removeEmployeeFromTask
);
router.patch(
  "/:taskId/status",
  verifyToken,
  authorizePermission("task.update"),
  updateTaskStatus
);
router.post(
  "/:taskId/milestone",
  verifyToken,
  authorizePermission("task.manageMilestones"),
  addMilestones
);
router.patch(
  "/:taskId/milestone",
  verifyToken,
  authorizePermission("task.manageMilestones"),
  updateMilestone
);
router.post(
  "/:taskId/assign-team",
  verifyToken,
  authorizePermission("task.assignTeam"),
  assignTaskToTeam
);
router.put(
  "/:id",
  verifyToken,
  authorizePermission("task.update"),
  updateTitleAndDesc
);

router.get("/getTask", verifyToken, getTasks);
router.get("/:id", verifyToken, getTaskById);

export default router;
