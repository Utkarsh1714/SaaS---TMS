import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setMessage("Password do not match")
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                token,
                newPassword: password,
            });

            toast.success("Password Updated Successfully!");
            setMessage(res.data.message || "Password updated!");
            setTimeout(() => {
                navigate('/login')
            }, 1500)
        } catch (error) {
            console.log(error);
            setMessage(error?.message?.data?.message || 'Something went wrong')
        }
    }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            className="w-full mb-4 px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-4 px-3 py-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword