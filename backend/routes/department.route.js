import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import authorizeRole from '../middlewares/authorizeRole.js'
import { createDepartment, deleteDepartment, getDepartment, getDepartmentWithDetails, getSingleDepartmentWithDetails } from '../controllers/department.controller.js';

const router = express.Router();

router.post('/', verifyToken, authorizeRole("Boss"), createDepartment);
router.get('/', verifyToken, getDepartment);
router.get('/details', verifyToken, getDepartmentWithDetails)
router.get('/details/:id', verifyToken, authorizeRole("Boss"), getSingleDepartmentWithDetails)
router.delete('/:id', verifyToken, authorizeRole("Boss"), deleteDepartment);

export default router;