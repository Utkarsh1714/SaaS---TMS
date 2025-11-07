import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email || !token) {
      setError("Invalid or expired reset link");
    }
  }, [email, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      return setError("Please fill in all the details");
    }

    if (password !== confirmPassword) {
      return setError("Password do not match");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          email,
          token,
          newPassword: password,
        }
      );

      if (res.data.success) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("res.data.message" || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid or expired link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Set New Password
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && (
          <p className="text-green-600 mb-4 text-center">{message}</p>
        )}

        {!error && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Resetting..." : "Set Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
