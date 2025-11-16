import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboardIcon,
  UsersIcon,
  ClipboardCheckIcon,
  CalendarIcon,
  MessageSquareIcon,
  BarChartIcon,
  SettingsIcon,
  HelpCircleIcon,
  BuildingIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import axios from "axios";
const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname.startsWith(path);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
      setIsLoggingOut(true);
  
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/logout`,
          {},
          { withCredentials: true }
        );
  
        logout();
        toast("Logged out successfully!");
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed");
      } finally {
        setIsLoggingOut(false);
      }
    };

  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(!isOpen);
    }
  };
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 opacity-75 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        ></div>
      )}
      {/* Sidebar */}
      <div
        className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Taskify</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-auto lg:hidden text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboardIcon size={20} />}
              text="Dashboard"
              active={
                location.pathname === "/dashboard" || location.pathname === "/"
              }
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/tasks"
              icon={<ClipboardCheckIcon size={20} />}
              text="Tasks"
              active={isActive("/tasks")}
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/employees"
              icon={<UsersIcon size={20} />}
              text="Employees"
              active={isActive("/employees")}
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/departments"
              icon={<BuildingIcon size={20} />}
              text="Departments"
              active={isActive("/departments")}
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/meetings"
              icon={<CalendarIcon size={20} />}
              text="Meetings"
              active={isActive("/meetings")}
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/messages"
              icon={<MessageSquareIcon size={20} />}
              text="Messages"
              active={isActive("/messages")}
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/reports"
              icon={<BarChartIcon size={20} />}
              text="Reports"
              active={isActive("/reports")}
              onClick={handleLinkClick}
            />
            <div className="border-t border-gray-200 my-4"></div>
            <SidebarLink
              to="/settings"
              icon={<SettingsIcon size={20} />}
              text="Settings"
              active={isActive("/settings")}
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/help"
              icon={<HelpCircleIcon size={20} />}
              text="Help & Support"
              active={isActive("/help")}
              onClick={handleLinkClick}
            />
            <LogoutButton
              onClick={() => handleLogout()}
              icon={<LogOutIcon size={20} />}
              text={isLoggingOut ? "Signing Out..." : "Sign Out"}
              disabled={isLoggingOut}
            />
          </nav>
          {/* User profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-14 bg-gray-200 rounded-full p-0.5 object-cover">
                <img
                  src={user.organizationId?.logoUrl}
                  alt="Company Logo"
                  className="w-16 rounded-full"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user.organizationId?.name || user.organizationName}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const SidebarLink = ({ to, icon, text, active = false, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-center px-3 py-2 text-sm font-medium rounded-md group
        ${
          active
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
        }
      `}
    >
      <span
        className={`mr-3 ${
          active ? "text-blue-700" : "text-gray-500 group-hover:text-blue-700"
        }`}
      >
        {icon}
      </span>
      {text}
    </Link>
  );
};

const LogoutButton = ({ onClick, icon, text, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
                flex items-center w-full px-3 py-2 text-sm font-medium rounded-md group transition-colors duration-150
                text-gray-700 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed
                ${disabled ? "text-red-700 bg-red-50" : ""}
            `}
    >
      <span
        className={`mr-3 text-gray-500 group-hover:text-red-700 ${
          disabled ? "text-red-700" : ""
        }`}
      >
        {icon}
      </span>
      {text}
    </button>
  );
};

export default Sidebar;
