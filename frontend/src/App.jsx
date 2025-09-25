import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { Toaster as HotToast } from "react-hot-toast";
import Pricing from "./components/Pricing";
import ProtectRegRoute from "./routes/ProtectRegRoute";
import LandingPage from "./pages/LandingPage";

// Lazy load the page
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Departments = lazy(() => import("./pages/Departments"));
const Employees = lazy(() => import("./pages/Employees"));
const Reports = lazy(() => import("./pages/Reports"));
const Registration = lazy(() => import("./pages/Registration"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Chat = lazy(() => import("./pages/Chat"));
const Profile = lazy(() => import("./pages/Profile"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const DeptDetails = lazy(() => import("./pages/DeptDetails"));
const EmpDetails = lazy(() => import("./pages/EmpDetails"));
const TaskDetails = lazy(() => import("./pages/TaskDetails"));

function App() {
  const { loading } = useAuth(); // 👈 Add loading here

  if (loading)
    return (
      <div className="flex items-center justify-center w-full min-h-screen gap-3">
        <div>
          <p className="text-lg">Loading app</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      </div>
    ); // ✅ Prevent early rendering
  return (
    <>
      <Toaster richColors position="top-right" />
      <HotToast position="top-right" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-full gap-3">
            <p className="text-lg">Loading...</p>
            <span className="loading loading-dots loading-xl"></span>
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/registration"
            element={
              <ProtectRegRoute>
                <Registration />
              </ProtectRegRoute>
            }
          />
          <Route path="/plans" element={<Pricing />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forget-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<TaskDetails />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/departments/:id" element={<DeptDetails />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/:id" element={<EmpDetails />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
