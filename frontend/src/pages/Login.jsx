import { Navigate, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const { user, loading, login } = useAuth();
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to={"/"} replace />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      const { user } = response.data;
      toast.success("Login successful!");
      login(user);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );

      toast.success(response?.data?.message || "Reset link sent to your email");
      setEmail("");
      setDialogOpen(false)
    } catch (error) {
      console.error("Reset failed:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send reset link"
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="w-full h-screen">
      <div>
        <h1 className="Headline text-yellow-400 text-xl font-bold py-4 px-8 cursor-pointer">
          Taskify
        </h1>
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-center">
        <div className="Left w-full 2xl:w-1/2 xl:pt-10 flex flex-col items-center justify-center">
          <div className="text-3xl sm:text-4xl md:text-3xl 2xl:text-5xl pt-10 italic flex flex-col justify-center text-center text-[#242424]">
            <h1>Simplify Teamwork.</h1>
            <h1>Supercharge Productivity.</h1>
          </div>
          <div className="pt-5 flex items-center justify-center">
            <p className="text-gray-600 px-5 xl:px-20 xl:text-xl xl:pt-3 text-sm sm:text-lg md:text-lg text-center">
              A smart task management system for organizations to assign, track,
              and manage work - from bosses to employees - all in one place.
            </p>
          </div>
        </div>
        <div className="Right w-full 2xl:w-1/2 flex items-center justify-center">
          <div className="w-full pt-10 xl:pt-20 lg:pt-0 flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full px-20">
              <h1 className="text-2xl text-center">Welcome back!</h1>
              <input
                name="email"
                type="text"
                onChange={handleChange}
                placeholder="Email Address"
                className="outline-none border-2 border-yellow-400 rounded-md px-4 py-2 mt-4 w-full"
              />
              <input
                name="password"
                type="password"
                onChange={handleChange}
                placeholder="Password"
                className="outline-none border-2 border-yellow-400 rounded-md px-4 py-2 mt-4 w-full"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-400 hover:text-black duration-150 ease-linear w-full mt-5 py-2 rounded-md text-lg cursor-pointer"
              >
                Login
              </button>
            </form>

            {/* Password Reset Dialog (outside login form) */}
            <div className="flex items-center justify-center pt-2">
              <p className="text-center">Forgot password?</p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-blue-500 cursor-pointer"
                  >
                    Click here
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Reset your password</DialogTitle>
                    <DialogDescription>
                      Fill in the registered Email Address to reset the
                      password.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    className="space-y-4"
                    onSubmit={handlePasswordResetSubmit}
                  >
                    <input
                      type="text"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter registered email address"
                      className="w-full border px-3 py-2 rounded-md"
                    />
                    <Button type="submit" className="w-full">
                      {passwordSaving
                        ? "Sending reset link.."
                        : "Get Resetlink"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center justify-center">
              <hr className="px-8 border-2 mt-8" />
              <h1 className="px-4 mt-7">OR</h1>
              <hr className="px-8 border-2 mt-8" />
            </div>
            <div className="w-full px-20 pt-6">
              <NavLink to={"/registration"}>
                <button className="w-full bg-[#d7d7d7] cursor-pointer py-2 text-md sm:text-lg rounded-md">
                  Register Your Organisation
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center px-8">
        <hr className="w-full mt-10 border-slate-300" />
      </div>
      <div className="w-full flex flex-wrap items-center justify-center gap-10 py-10">
        {[
          {
            title: "Organization-centric",
            desc: "Manage multiple departments, roles, and users - built for teams that scale.",
          },
          {
            title: "Role-Based Access",
            desc: "Assign tasks from boss ➡️ manager ➡️ employee, with real-time updates and status tracking.",
          },
          {
            title: "Secure & Centralized",
            desc: "All your organization data is safe, encrypted, and role-specific - no cross-access.",
          },
          {
            title: "Fast Onboarding",
            desc: "Create your organization in minutes. Add users individually or in bulk via CSV.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="w-[300px] min-h-[150px] rounded-xl flex flex-col text-center space-y-3 items-center justify-center bg-slate-200 shadow-2xl hover:shadow-amber-300 hover:scale-105 duration-150 ease-in py-4 px-6"
          >
            <h1 className="text-2xl">{feature.title}</h1>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;
