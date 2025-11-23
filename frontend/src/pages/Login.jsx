import { Navigate, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ResetPasswordDialog from "@/components/ResetPasswordDialog";
import { Input } from "@/components/ui/input";
import {
  Layers,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Prism from "@/components/Prism";
import PageLoader from "@/components/ui/PageLoader";

const Login = () => {
  const { user, loading, login } = useAuth();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // For password toggle
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  if (loading) return <PageLoader />;
  if (user) return <Navigate to={"/dashboard"} replace />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      toast.success("Welcome back!");
      login(user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">
      <ResetPasswordDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onComplete={() => {}}
      />

      {/* LEFT PANEL - Branding (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-5/12 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* <svg width="100%" height="100%">
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg> */}
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Prism
              animationType="rotate"
              timeScale={0.4}
              height={3}
              baseWidth={3}
              scale={3}
              hueShift={0}
              colorFrequency={1}
              noise={0}
              glow={1}
            />
          </div>
        </div>

        {/* Logo Lockup */}
        <div className="z-10 flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Layers className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Task<span className="text-blue-400">ify</span>
          </span>
        </div>

        {/* Middle Content */}
        <div className="z-10 relative">
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Welcome back!
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            "Productivity is never an accident. It is always the result of a
            commitment to excellence, intelligent planning, and focused effort."
          </p>
        </div>

        {/* Footer */}
        <div className="z-10 text-sm text-blue-300">
          © {new Date().getFullYear()} Taskify Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="w-full lg:w-7/12 min-h-screen flex flex-col justify-center items-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Layers className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">Taskify</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Sign in to your account
            </h2>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
            <p className="text-slate-500 mt-2">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="h-12 pl-10 bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    onClick={() => setDialogOpen(true)}
                    className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={isVisible ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="h-12 pl-10 pr-10 bg-slate-50 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-600 cursor-pointer select-none"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loadingLogin ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-50 text-slate-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              {/* Google SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-semibold text-slate-600">
                Google
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm">
              {/* Microsoft SVG */}
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span className="text-sm font-semibold text-slate-600">
                Microsoft
              </span>
            </button>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/registration"
                className="font-bold text-blue-600 hover:text-blue-500 hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
