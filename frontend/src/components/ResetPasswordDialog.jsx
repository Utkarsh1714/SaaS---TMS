import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// --- Sub-components for each step ---

// Step 1: Input Email to send OTP
const EmailInputForm = ({ email, setEmail, onSubmit, isLoading }) => (
  <>
    <DialogHeader>
      <DialogTitle>Reset your password (Step 1 of 3)</DialogTitle>
      <DialogDescription>
        Enter your registered Email Address to receive a One-Time Password
        (OTP).
      </DialogDescription>
    </DialogHeader>
    <form className="space-y-4" onSubmit={onSubmit}>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter registered email address"
        required
        className="w-full border px-3 py-2 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </form>
  </>
);

// Step 2: Input OTP
const OtpVerificationForm = ({ otp, setOtp, onVerify, isLoading }) => (
  <>
    <DialogHeader>
      <DialogTitle>OTP Verification (Step 2 of 3)</DialogTitle>
      <DialogDescription>
        A 6-digit code has been sent to your email. Please enter it below.
      </DialogDescription>
    </DialogHeader>
    <form className="space-y-4" onSubmit={onVerify}>
      <input
        type="text"
        name="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value.slice(0, 6))} // Limit to 6 digits
        placeholder="Enter 6-digit OTP"
        required
        maxLength={6}
        className="w-full text-center text-xl tracking-[1em] border px-3 py-2 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
      {/* You can add a Resend OTP button here, with a cooldown */}
    </form>
  </>
);

// Step 3: Set New Password
const NewPasswordForm = ({
  newPassword,
  setNewPassword,
  onReset,
  isLoading,
}) => (
  <>
    <DialogHeader>
      <DialogTitle>Set New Password (Step 3 of 3)</DialogTitle>
      <DialogDescription>
        Enter and confirm your new password.
      </DialogDescription>
    </DialogHeader>
    <form className="space-y-4" onSubmit={onReset}>
      <input
        type="password"
        name="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter New Password"
        required
        className="w-full border px-3 py-2 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Change Password"}
      </Button>
    </form>
  </>
);

// --- Main Dialog Component ---

const ResetPasswordDialog = ({ open, setOpen, onComplete }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState(""); // Temporary token from step 2
  const [loading, setLoading] = useState(false);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  // Handles closing and resetting the state
  const handleClose = (newOpen) => {
    if (!newOpen) {
      // Only reset state if dialog is truly closing
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setResetToken("");
    }
    setOpen(newOpen);
  };

  // ------------------------------------
  // API Call 1: Send OTP
  // ------------------------------------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // NOTE: Using the /forgot-password route for consistency with your existing code
      const response = await axios.post(
        `${VITE_API_URL}/api/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );

      toast.success(response?.data?.message || "OTP sent successfully!");
      setStep(2); // Move to OTP input step
    } catch (error) {
      console.error("Send OTP failed:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send OTP. Check email."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // API Call 2: Verify OTP
  // ------------------------------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/auth/verify-otp`,
        { email, otp }, // Send both email and OTP
        { withCredentials: true }
      );

      toast.success(response.data.message);
      setResetToken(response.data.resetToken); // Store the temporary token
      setStep(3); // Move to New Password step
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error(error?.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // API Call 3: Reset Password
  // ------------------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/auth/reset-password`,
        { newPassword, resetToken }, // Send the new password and the auth token
        { withCredentials: true }
      );

      toast.success(response.data.message || "Password reset successful!");

      handleClose(false); // Close the dialog on successful reset
      onComplete(); // Trigger any parent cleanup/notifications
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error(
        error?.response?.data?.message || "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  // RENDER the current step's form
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <EmailInputForm
            email={email}
            setEmail={setEmail}
            onSubmit={handleSendOtp}
            isLoading={loading}
          />
        );
      case 2:
        return (
          <OtpVerificationForm
            otp={otp}
            setOtp={setOtp}
            onVerify={handleVerifyOtp}
            isLoading={loading}
          />
        );
      case 3:
        return (
          <NewPasswordForm
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            onReset={handleResetPassword}
            isLoading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] flex flex-col">
        {renderStep()}
        {step > 1 && (
          <Button
            variant="link"
            className="text-xs text-gray-500 mt-2"
            onClick={() => handleClose(false)} // Close button
          >
            Cancel and Go Back to Login
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
