import express from 'express';
import verifyToken from "../middlewares/verifyToken.js";
import { authorizePermission } from "../middlewares/authorizePermission.js";
import { cancelMeeting, createMeeting, deleteMeeting, getMeetings, updateMeeting } from '../controllers/meeting.controller.js';


const router = express.Router();

router.use(verifyToken);

router.post('/', createMeeting);
router.get('/', getMeetings);
router.put('/:id', updateMeeting);
router.patch('/:id/cancel', cancelMeeting);
router.delete('/:id', deleteMeeting);

export default router;