import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { accessOrCreateChat, fetchUserChat, getMessagesForChannel } from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/', verifyToken, accessOrCreateChat);
router.get('/', verifyToken, fetchUserChat);
router.get('/:channelId', verifyToken, getMessagesForChannel);

export default router;