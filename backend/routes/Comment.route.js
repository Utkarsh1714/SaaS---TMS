import express from 'express';
import { addComment, deleteComment, updateComment } from '../controllers/comment.controller.js';
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/:taskId', verifyToken, addComment);
router.put('/:commentId', verifyToken, updateComment);
router.delete('/:commentId', verifyToken, deleteComment);

export default router;