import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { LiaWarehouseSolid } from "react-icons/lia";
import { PiUsersThreeFill } from "react-icons/pi";
import { TbReportSearch } from "react-icons/tb";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const Layout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      logout();

      toast("Logged out successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed");
    }
  };
  return (
    <div className="w-full h-screen">
      <header className="Header w-full px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="Headline text-3xl font-semibold">Taskify</h1>
        </div>
        <div>
          <NavLink to={"/login"}>
            <button onClick={handleLogout} className="px-4 py-2 bg-black text-white rounded-md hover:shadow-amber-300 hover:shadow-lg hover:scale-105 duration-150 ease-in-out cursor-pointer">
              Logout
            </button>
          </NavLink>
        </div>
      </header>
      <div className="w-full flex items-start justify-center">
        <div className="Sidebar w-[10%] lg:w-1/4 py-2">
          <nav className="flex flex-col gap-5 md:gap-10 md:px-3">
            <NavLink
              to={"/"}
              end
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(255, 193, 7, 0.5)"
                  : "none",
              })}
              className={"rounded-lg"}
            >
              <li className="text-lg font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:shadow-amber-300 hover:shadow-lg py-2 px-2 rounded-md">
                <MdOutlineSpaceDashboard size={30} />
                <span className="hidden lg:flex">Dashboard</span>
              </li>
            </NavLink>
            <NavLink
              to={"/tasks"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(255, 193, 7, 0.5)"
                  : "none",
              })}
              className="text-lg font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:shadow-amber-300 hover:shadow-lg py-2 px-2 rounded-md"
            >
              <GoTasklist size={30} />
              <span className="hidden lg:flex">Tasks</span>
            </NavLink>
            <NavLink
              to={"/departments"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(255, 193, 7, 0.5)"
                  : "none",
              })}
              className="text-lg font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:shadow-amber-300 hover:shadow-lg py-2 px-2 rounded-md"
            >
              <LiaWarehouseSolid size={30} />
              <span className="hidden lg:flex">Departments</span>
            </NavLink>
            <NavLink
              to={"/employees"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(255, 193, 7, 0.5)"
                  : "none",
              })}
              className="text-lg font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:shadow-amber-300 hover:shadow-lg py-2 px-2 rounded-md"
            >
              <PiUsersThreeFill size={30} />
              <span className="hidden lg:flex">Employee</span>
            </NavLink>
            <NavLink
              to={"/chat"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(255, 193, 7, 0.5)"
                  : "none",
              })}
              className="text-lg font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:shadow-amber-300 hover:shadow-lg py-2 px-2 rounded-md"
            >
              <IoChatboxEllipsesOutline size={30} />
              <span className="hidden lg:flex">Message</span>
            </NavLink>
            <NavLink
              to={"/reports"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(255, 193, 7, 0.5)"
                  : "none",
              })}
              className="text-lg font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:shadow-amber-300 hover:shadow-lg py-2 px-2 rounded-md"
            >
              <TbReportSearch size={30} />
              <span className="hidden lg:flex">Reports</span>
            </NavLink>
            <NavLink
              to={"/profile"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(255, 193, 7, 0.5)"
                  : "none",
              })}
              className="text-lg font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:shadow-amber-300 hover:shadow-lg py-2 px-2 rounded-md"
            >
              <FaRegUserCircle size={30} />
              <span className="hidden lg:flex">Profile</span>
            </NavLink>
          </nav>
        </div>
        <div className="Content w-full h-[90vh] flex items-center justify-center overflow-hidden overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
