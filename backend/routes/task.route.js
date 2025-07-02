import express from 'express';
import { addEmployeeToTask, addMilestones, createTask, deleteTask, getTasksByBoss, getTasksByEmployee, getTasksByManager, removeEmployeeFromTask, updateMilestone, updateTaskStatus } from '../controllers/task.controller.js';
import verifyToken from '../middlewares/verifyToken.js'
import authorizeRole from '../middlewares/authorizeRole.js'

const router = express.Router();

router.post('/create', verifyToken, authorizeRole("Boss"), createTask)
router.put('/:taskId/employees/add', verifyToken, authorizeRole("Manager"), addEmployeeToTask);
router.put('/:taskId/employees/remove/:employeeId', verifyToken, authorizeRole("Manager"), removeEmployeeFromTask);
router.put('/:taskId/status', verifyToken, authorizeRole("Manager"), updateTaskStatus);
router.post('/:taskId/milestone', verifyToken, authorizeRole("Manager"), addMilestones);
router.put('/:taskId/milestone/:milestoneIndex', verifyToken, updateMilestone);
router.delete('/:taskId', verifyToken, authorizeRole("Boss"), deleteTask);

router.get('/boss', verifyToken, getTasksByBoss);
router.get('/manager', verifyToken, getTasksByManager);
router.get('/employee', verifyToken, getTasksByEmployee);

export default router;