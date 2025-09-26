// import { Navigate, NavLink, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import Pricing from "@/components/Pricing";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const { user, loading, login } = useAuth();
//   const [Loading, setLoading] = useState(false);
//   const [passwordSaving, setPasswordSaving] = useState(false);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   if (loading) return <div>Loading...</div>;
//   if (user) return <Navigate to={"/"} replace />;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/auth/login`,
//         formData,
//         { withCredentials: true }
//       );
//       const { user, token } = response.data;
//       localStorage.setItem("token", token);
//       setLoading(false);
//       toast.success("Login successful!");
//       login(user);
//       navigate("/");
//     } catch (error) {
//       console.error("Login failed:", error);
//       toast.error(error?.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordResetSubmit = async (e) => {
//     e.preventDefault();
//     setPasswordSaving(true);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
//         { email },
//         { withCredentials: true }
//       );

//       toast.success(response?.data?.message || "Reset link sent to your email");
//       setEmail("");
//       setDialogOpen(false);
//     } catch (error) {
//       console.error("Reset failed:", error);
//       toast.error(
//         error?.response?.data?.message || "Failed to send reset link"
//       );
//     } finally {
//       setPasswordSaving(false);
//     }
//   };

//   return (
//     <div className="w-full h-screen">
//       <div>
//         <h1 className="Headline text-black text-xl font-bold py-4 px-8 cursor-pointer">
//           Taskify
//         </h1>
//       </div>
//       <div className="w-full flex flex-col md:flex-row items-center justify-center">
//         <div className="Left w-full 2xl:w-1/2 xl:pt-10 flex flex-col items-center justify-center">
//           <div className="text-3xl sm:text-4xl md:text-3xl 2xl:text-5xl pt-10 italic flex flex-col justify-center text-center text-[#242424]">
//             <h1>Simplify Teamwork.</h1>
//             <h1>Supercharge Productivity.</h1>
//           </div>
//           <div className="pt-5 flex items-center justify-center">
//             <p className="text-gray-600 px-5 xl:px-20 xl:text-xl xl:pt-3 text-sm sm:text-lg md:text-lg text-center">
//               A smart task management system for organizations to assign, track,
//               and manage work - from bosses to employees - all in one place.
//             </p>
//           </div>
//         </div>
//         <div className="Right w-full 2xl:w-1/2 flex items-center justify-center">
//           <div className="w-full pt-10 xl:pt-20 lg:pt-0 flex flex-col items-center justify-center">
//             <form onSubmit={handleSubmit} className="w-full px-20">
//               <h1 className="text-2xl text-center">Welcome back!</h1>
//               <input
//                 name="email"
//                 type="text"
//                 onChange={handleChange}
//                 placeholder="Email Address"
//                 className="outline-none border-2 border-yellow-400 rounded-md px-4 py-2 mt-4 w-full"
//               />
//               <input
//                 name="password"
//                 type="password"
//                 onChange={handleChange}
//                 placeholder="Password"
//                 className="outline-none border-2 border-yellow-400 rounded-md px-4 py-2 mt-4 w-full"
//               />
//               <button
//                 type="submit"
//                 className="bg-yellow-400 hover:bg-yellow-400 hover:text-black duration-150 ease-linear w-full mt-5 py-2 rounded-md text-lg cursor-pointer"
//               >
//                 {!Loading ? (
//                   "Login"
//                 ) : (
//                   <span className="loading loading-spinner loading-lg"></span>
//                 )}
//               </button>
//             </form>

//             {/* Password Reset Dialog (outside login form) */}
//             <div className="flex items-center justify-center pt-2">
//               <p className="text-center">Forgot password?</p>
//               <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     className="text-blue-500 cursor-pointer"
//                   >
//                     Click here
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[500px]">
//                   <DialogHeader>
//                     <DialogTitle>Reset your password</DialogTitle>
//                     <DialogDescription>
//                       Fill in the registered Email Address to reset the
//                       password.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <form
//                     className="space-y-4"
//                     onSubmit={handlePasswordResetSubmit}
//                   >
//                     <input
//                       type="text"
//                       name="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="Enter registered email address"
//                       className="w-full border px-3 py-2 rounded-md"
//                     />
//                     <Button type="submit" className="w-full">
//                       {passwordSaving
//                         ? "Sending reset link.."
//                         : "Get Resetlink"}
//                     </Button>
//                   </form>
//                 </DialogContent>
//               </Dialog>
//             </div>

//             <div className="flex items-center justify-center">
//               <hr className="px-8 border-2 mt-8" />
//               <h1 className="px-4 mt-7">OR</h1>
//               <hr className="px-8 border-2 mt-8" />
//             </div>
//             <div className="w-full px-20 pt-6">
//               <NavLink to={"/plans"}>
//                 <button className="w-full bg-[#d7d7d7] cursor-pointer py-2 text-md sm:text-lg rounded-md">
//                   Register Your Organisation
//                 </button>
//               </NavLink>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="w-full flex items-center justify-center px-8">
//         <hr className="w-full mt-10 border-slate-300" />
//       </div>
//       <div className="w-full flex flex-wrap items-center justify-center gap-10 py-10">
//         {[
//           {
//             title: "Organization-centric",
//             desc: "Manage multiple departments, roles, and users - built for teams that scale.",
//           },
//           {
//             title: "Role-Based Access",
//             desc: "Assign tasks from boss ➡️ manager ➡️ employee, with real-time updates and status tracking.",
//           },
//           {
//             title: "Secure & Centralized",
//             desc: "All your organization data is safe, encrypted, and role-specific - no cross-access.",
//           },
//           {
//             title: "Fast Onboarding",
//             desc: "Create your organization in minutes. Add users individually or in bulk via CSV.",
//           },
//         ].map((feature, index) => (
//           <div
//             key={index}
//             className="w-[300px] min-h-[150px] rounded-xl flex flex-col text-center space-y-3 items-center justify-center bg-slate-200 shadow-2xl hover:shadow-amber-300 hover:scale-105 duration-150 ease-in py-4 px-6"
//           >
//             <h1 className="text-2xl">{feature.title}</h1>
//             <p className="text-sm text-gray-600">{feature.desc}</p>
//           </div>
//         ))}
//       </div>
//       {/* <div className="w-full">
//         <Pricing />
//       </div> */}
//     </div>
//   );
// };

// export default Login;



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
import Pricing from "@/components/Pricing";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const { user, loading, login } = useAuth();
  const [loadingLogin, setLoadingLogin] = useState(false);
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
    setLoadingLogin(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      console.log(response.data)
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      toast.success("Login successful!");
      login(user);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoadingLogin(false);
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
      setDialogOpen(false);
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/landing">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Taskify
          </h2>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot your password?
                    </a>
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
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loadingLogin}
              >
                {loadingLogin ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Google
                </button>
              </div>
              <div>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Microsoft
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/registration"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;