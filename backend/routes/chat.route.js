import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { accessOrCreateChat, fetchuserChat, getMessagesForChannel } from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/', verifyToken, accessOrCreateChat);
router.get('/', verifyToken, fetchuserChat);
router.get('/:channelId', verifyToken, getMessagesForChannel);

export default router;