import express from 'express';
const router = express.Router();

import { forgotPassword, login, logout, paymentVerification, razorpay, registerOrg, resetPassword } from '../controllers/auth.controller.js';
import verifyToken from '../middlewares/verifyToken.js';


router.post('/register-org', registerOrg);
router.post('/login', login);
router.post('/logout',verifyToken, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/create-order', razorpay)
router.post('/verify-payment', paymentVerification)

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;