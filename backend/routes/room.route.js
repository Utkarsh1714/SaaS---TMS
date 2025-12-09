import express from 'express';
import verifyToken from "../middlewares/verifyToken.js";
import { createRoom, deleteRoom, getAllRooms, getRoomById, updateRoom } from '../controllers/roomController.js';
import { authorizePermission } from "../middlewares/authorizePermission.js";

const router = express.Router();

router.use(verifyToken)

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', authorizePermission('meetingRoom.create'), createRoom);
router.put('/:id', authorizePermission('meetingRoom.update'), updateRoom);
router.delete('/:id', authorizePermission('meetingRoom.delete'), deleteRoom);

export default router;