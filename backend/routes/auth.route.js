import express from 'express';
import { forgotPassword, login, logout, registerOrg, resetPassword } from '../controllers/auth.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/register-org', registerOrg);
router.post('/login', login);
router.post('/logout',verifyToken, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;