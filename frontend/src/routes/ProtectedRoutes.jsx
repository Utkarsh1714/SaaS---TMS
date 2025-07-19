import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center w-full min-h-screen gap-3">
        <div>
          <p className="text-lg">Loading app</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      </div>
    );

  return user ? <Outlet /> : <Navigate to={"/login"} replace />;
};

export default ProtectedRoute;
