import express from "express";
const router = express.Router();

import verifyToken from "../middlewares/verifyToken.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import { createEmployee, deleteEmployee, getAllEmployees, updateEmployee } from "../controllers/user.controller.js";


router.post('/', verifyToken, authorizeRole("Boss"), createEmployee);
router.get('/', verifyToken, getAllEmployees);
router.put('/:id', verifyToken, authorizeRole("Boss"), updateEmployee);
router.delete("/:id", verifyToken, authorizeRole("Boss"), deleteEmployee);

export default router;