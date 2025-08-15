import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getMessagesForChannel } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/:channelId', verifyToken, getMessagesForChannel);

export default router;