import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FcDepartment } from "react-icons/fc";
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
import { Button } from "./ui/button";
import { useState } from "react";
import { Bell, BellDot } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import { useNotifications } from "@/context/NotificationContext";

const Layout = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { notifications, toggleNotificationPanel } = useNotifications();

  const handleLogout = async () => {
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      logout();
      setLoading(false);

      toast("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <header className="Header w-full px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="Headline text-3xl font-semibold">Taskify</h1>
        </div>
        <div className="space-x-4 flex items-center justify-center relative">
          <Button
            variant={"outline"}
            className={"cursor-pointer hover:animate-in"}
            onClick={toggleNotificationPanel}
          >
            {/* Notification Bell */}
            {notifications.length > 0 ? <BellDot /> : <Bell />}
          </Button>
          <NavLink to={"/login"}>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:shadow-gray-400 hover:shadow-lg hover:scale-105 duration-150 ease-in-out cursor-pointer"
            >
              {loading ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                "Log Out"
              )}
            </button>
          </NavLink>
        </div>
      </header>
      <div className="w-full flex items-start justify-center">
        <div className="Sidebar w-[15%] h-[90vh] py-2 px-2 border-r-4">
          <nav className="flex flex-col items-start justify-start gap-5 md:gap-10 md:px-3">
            <NavLink
              to={"/"}
              end
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(0, 0, 0, 0.5)"
                  : "none",
              })}
              className={"rounded-lg w-full"}
            >
              <li className="w-full text-lg font-semibold flex items-center justify-start gap-3 hover:scale-3d ease-in-out duration-200 hover:shadow-gray-500 hover:shadow-lg py-2 px-2 sm:px-5 rounded-md">
                <MdOutlineSpaceDashboard size={30} />
                <span className="hidden lg:flex">Dashboard</span>
              </li>
            </NavLink>
            <NavLink
              to={"/tasks"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(0, 0, 0, 0.5)"
                  : "none",
              })}
              className={"rounded-lg w-full"}
            >
              <li className="w-full text-lg font-semibold flex items-center justify-start gap-3 hover:scale-3d ease-in-out duration-200 hover:shadow-gray-500 hover:shadow-lg py-2 px-2 sm:px-5 rounded-md">
                <GoTasklist size={30} />
                <span className="hidden lg:flex">Tasks</span>
              </li>
            </NavLink>
            <NavLink
              to={"/departments"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(0, 0, 0, 0.5)"
                  : "none",
              })}
              className={"rounded-lg w-full"}
            >
              <li className="w-full text-lg font-semibold flex items-center justify-start gap-3 hover:scale-3d ease-in-out duration-200 hover:shadow-gray-500 hover:shadow-lg py-2 px-2 sm:px-5 rounded-md">
                <LiaWarehouseSolid size={30} />
                <span className="hidden lg:flex">Departments</span>
              </li>
            </NavLink>
            <NavLink
              to={"/employees"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(0, 0, 0, 0.5)"
                  : "none",
              })}
              className={"rounded-lg w-full"}
            >
              <li className="w-full text-lg font-semibold flex items-center justify-start gap-3 hover:scale-3d ease-in-out duration-200 hover:shadow-gray-500 hover:shadow-lg py-2 px-2 sm:px-5 rounded-md">
                <PiUsersThreeFill size={30} />
                <span className="hidden lg:flex">Employee</span>
              </li>
            </NavLink>
            <NavLink
              to={"/chat"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(0, 0, 0, 0.5)"
                  : "none",
              })}
              className={"rounded-lg w-full"}
            >
              <li className="w-full text-lg font-semibold flex items-center justify-start gap-3 hover:scale-3d ease-in-out duration-200 hover:shadow-gray-500 hover:shadow-lg py-2 px-2 sm:px-5 rounded-md">
                <IoChatboxEllipsesOutline size={30} />
                <span className="hidden lg:flex">Message</span>
              </li>
            </NavLink>
            <NavLink
              to={"/reports"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(0, 0, 0, 0.5)"
                  : "none",
              })}
              className={"rounded-lg w-full"}
            >
              <li className="w-full text-lg font-semibold flex items-center justify-start gap-3 hover:scale-3d ease-in-out duration-200 hover:shadow-gray-500 hover:shadow-lg py-2 px-2 sm:px-5 rounded-md">
                <TbReportSearch size={30} />
                <span className="hidden lg:flex">Reports</span>
              </li>
            </NavLink>
            <NavLink
              to={"/profile"}
              style={({ isActive }) => ({
                boxShadow: isActive
                  ? "10px 10px 10px rgba(0, 0, 0, 0.5)"
                  : "none",
              })}
              className={"rounded-lg w-full"}
            >
              <li className="w-full text-lg font-semibold flex items-center justify-start gap-3 hover:scale-3d ease-in-out duration-200 hover:shadow-gray-500 hover:shadow-lg py-2 px-2 sm:px-5 rounded-md">
                <FaRegUserCircle size={30} />
                <span className="hidden lg:flex">Profile</span>
              </li>
            </NavLink>
          </nav>
        </div>
        <div className="Content w-full h-[90vh] flex items-center justify-center overflow-hidden overflow-y-scroll">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </div>
      </div>
      {/* Conditionally render the new component */}
      <NotificationPanel />
    </div>
  );
};

export default Layout;
