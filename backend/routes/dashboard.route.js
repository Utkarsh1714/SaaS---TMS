import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getMonthyCompletionTrend, overview } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/overview-data1', verifyToken, overview)
router.get('/overview-data2', verifyToken, getMonthyCompletionTrend);

export default router;