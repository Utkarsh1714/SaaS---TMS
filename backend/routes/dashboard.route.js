import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { overview } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/overview', verifyToken, overview)

export default router;