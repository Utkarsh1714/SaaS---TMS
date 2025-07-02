import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        { token, newPassword: password },
        { withCredentials: true }
      );
      toast.success(response?.data?.message || "Password reset successful");
      navigate("/login");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error(error?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white rounded-lg shadow-xl px-8 py-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-yellow-500">
          Reset Your Password
        </h1>
        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-4 py-2 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border px-4 py-2 rounded-md"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-black w-full py-2 rounded-md"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
