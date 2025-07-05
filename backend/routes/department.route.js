import express from 'express';
const router = express.Router();

import verifyToken from '../middlewares/verifyToken.js';
import authorizeRole from '../middlewares/authorizeRole.js'
import { createDepartment, deleteDepartment, getDepartment, getDepartmentWithDetails, getSingleDepartmentWithDetails } from '../controllers/department.controller.js';


router.post('/', verifyToken, authorizeRole("Boss"), createDepartment);
router.get('/', verifyToken, getDepartment);
router.get('/details', verifyToken, getDepartmentWithDetails)
router.get('/details/:id', verifyToken, getSingleDepartmentWithDetails)
router.delete('/:id', verifyToken, authorizeRole("Boss"), deleteDepartment);

export default router;