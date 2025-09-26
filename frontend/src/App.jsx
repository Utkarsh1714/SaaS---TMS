import { lazy, Suspense } from "react"; // 👈 Import hooks
import { Route, Routes } from "react-router-dom"; // 👈 Import useLocation
import ProtectedRoute from "./routes/ProtectedRoutes";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { Toaster as HotToast } from "react-hot-toast";
import Pricing from "./components/Pricing";
import ProtectRegRoute from "./routes/ProtectRegRoute";
import LandingPage from "./pages/LandingPage";

import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Tasks from "./pages/Tasks";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import EmpDetails from "./pages/EmpDetails";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import DepartmentDetails from "./pages/DeptDetails";

// Lazy load the pages... (keep all your lazy imports here)
const Home = lazy(() => import("./pages/Home"));
// ... other lazy imports ...
const TaskDetails = lazy(() => import("./pages/TaskDetails"));

function App() {
  const { loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center w-full min-h-screen gap-3">
        <div>
          <p className="text-lg">Loading app</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      </div>
    );

  return (
    <>
      {/* These toasts should be outside the smooth-wrapper to prevent fixed/absolute positioning issues */}
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
          {/* All your routes remain the same */}
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
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/" element={<Home />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/:id" element={<DepartmentDetails />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmpDetails />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
