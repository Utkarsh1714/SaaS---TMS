import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, KeyRound, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- COMPONENTS ---

// Progress Stepper Component
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Email" },
    { id: 2, label: "Verify" },
    { id: 3, label: "Reset" },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-colors duration-300 ${
              step.id <= currentStep
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-slate-200 text-slate-400"
            }`}
          >
            {step.id < currentStep ? <CheckCircle2 size={14} /> : step.id}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${
                step.id < currentStep ? "bg-blue-600" : "bg-slate-200"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Step 1: Email Form
const EmailInputForm = ({ email, setEmail, onSubmit, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
        <Mail size={24} />
      </div>
      <DialogTitle className="text-xl font-bold text-slate-900">Forgot password?</DialogTitle>
      <DialogDescription className="text-slate-500 mt-2">
        No worries, we'll send you reset instructions.
      </DialogDescription>
    </div>

    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail size={18} />
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            className="pl-10 h-11 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
      </div>
      <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg" disabled={isLoading}>
        {isLoading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Sending...</> : "Send Code"}
      </Button>
    </form>
  </motion.div>
);

// Step 2: OTP Form
const OtpVerificationForm = ({ otp, setOtp, onVerify, isLoading, email }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
        <KeyRound size={24} />
      </div>
      <DialogTitle className="text-xl font-bold text-slate-900">Check your email</DialogTitle>
      <DialogDescription className="text-slate-500 mt-2">
        We sent a 6-digit code to <span className="font-medium text-slate-900">{email}</span>
      </DialogDescription>
    </div>

    <form onSubmit={onVerify} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Enter Code</label>
        <Input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.slice(0, 6))}
          placeholder="000000"
          required
          maxLength={6}
          className="h-14 text-center text-2xl font-mono tracking-[0.5em] bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
        />
      </div>
      <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg" disabled={isLoading}>
        {isLoading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Verifying...</> : "Verify Code"}
      </Button>
    </form>
  </motion.div>
);

// Step 3: New Password Form
const NewPasswordForm = ({ newPassword, setNewPassword, onReset, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
        <Lock size={24} />
      </div>
      <DialogTitle className="text-xl font-bold text-slate-900">Set new password</DialogTitle>
      <DialogDescription className="text-slate-500 mt-2">
        Your new password must be different from previously used passwords.
      </DialogDescription>
    </div>

    <form onSubmit={onReset} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock size={18} />
          </div>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Create strong password"
            required
            className="pl-10 h-11 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
      </div>
      <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg" disabled={isLoading}>
        {isLoading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Resetting...</> : "Reset Password"}
      </Button>
    </form>
  </motion.div>
);

// --- MAIN COMPONENT ---

const ResetPasswordDialog = ({ open, setOpen, onComplete }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const handleClose = (newOpen) => {
    if (!newOpen) {
      setTimeout(() => {
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setResetToken("");
      }, 300); // Reset after animation closes
    }
    setOpen(newOpen);
  };

  // API Functions remain identical to your logic
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      toast.success(response?.data?.message || "OTP sent successfully!");
      setStep(2);
    } catch (error) {
      console.error("Send OTP failed:", error);
      toast.error(error?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setResetToken(response.data.resetToken);
      setStep(3);
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error(error?.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/auth/reset-password`,
        { email, newPassword, token:resetToken },
        { withCredentials: true }
      );
      toast.success(response.data.message || "Password reset successful!");
      handleClose(false);
      onComplete();
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error(error?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] p-8 bg-white rounded-2xl border-0 shadow-2xl overflow-hidden">
        <StepIndicator currentStep={step} />
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <EmailInputForm
              key="step1"
              email={email}
              setEmail={setEmail}
              onSubmit={handleSendOtp}
              isLoading={loading}
            />
          )}
          {step === 2 && (
            <OtpVerificationForm
              key="step2"
              otp={otp}
              setOtp={setOtp}
              onVerify={handleVerifyOtp}
              isLoading={loading}
              email={email}
            />
          )}
          {step === 3 && (
            <NewPasswordForm
              key="step3"
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              onReset={handleResetPassword}
              isLoading={loading}
            />
          )}
        </AnimatePresence>

        {step > 1 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setStep(1)} // Go back to start
              className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowRight size={12} className="rotate-180" /> Back to Email
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;