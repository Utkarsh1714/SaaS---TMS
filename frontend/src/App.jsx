import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Tasks from "./pages/Tasks";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import Registration from "./pages/Registration";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { useAuth } from "./context/AuthContext";
import ResetPassword from "./pages/ResetPassword";
import Chat from "./pages/Chat";
import { Toaster } from "./components/ui/sonner";
import { Toaster as HotToast } from 'react-hot-toast'
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import DeptDetails from "./pages/DeptDetails";
import EmpDetails from "./pages/EmpDetails";

function App() {
  const { loading } = useAuth(); // 👈 Add loading here

  if (loading) return <div>Loading app...</div>; // ✅ Prevent early rendering
  return (
    <>
        <Toaster richColors position="top-right" />
        <HotToast position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/forget-password" element={<ForgotPassword />}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
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
    </>
  );
}

export default App;
