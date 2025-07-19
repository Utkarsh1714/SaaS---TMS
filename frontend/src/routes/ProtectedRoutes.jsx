import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-full gap-3">
        <p className="text-lg">Loading task</p>
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );

  return user ? <Outlet /> : <Navigate to={"/login"} replace />;
};

export default ProtectedRoute;
