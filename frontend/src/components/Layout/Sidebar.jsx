import React from "react";
import { Link, useLocation } from "react-router-dom";
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
const Sidebar = ({ isOpen, setIsOpen, handleLogout, isLoggingOut }) => {
  const { user } = useAuth();
  const location = useLocation();

  const handleLinkClick = () => {
    // Only close if the sidebar is currently open (on mobile)
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
              <span className="text-xl font-bold text-blue-600">WorkSpace</span>
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
              onClick={() => handleLinkClick}
            />
            <SidebarLink
              to="/tasks"
              icon={<ClipboardCheckIcon size={20} />}
              text="Tasks"
              active={location.pathname === "/tasks"}
              onClick={() => handleLinkClick}
            />
            <SidebarLink
              to="/employees"
              icon={<UsersIcon size={20} />}
              text="Employees"
              active={location.pathname === "/employees"}
              onClick={() => handleLinkClick}
            />
            <SidebarLink
              to="/departments"
              icon={<BuildingIcon size={20} />}
              text="Departments"
              active={location.pathname === "/departments"}
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/meetings"
              icon={<CalendarIcon size={20} />}
              text="Meetings"
              active={location.pathname === "/meetings"}
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/messages"
              icon={<MessageSquareIcon size={20} />}
              text="Messages"
              active={location.pathname === "/messages"}
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/reports"
              icon={<BarChartIcon size={20} />}
              text="Reports"
              active={location.pathname === "/reports"}
              onClick={handleLinkClick}
            />
            <div className="border-t border-gray-200 my-4"></div>
            <SidebarLink
              to="/settings"
              icon={<SettingsIcon size={20} />}
              text="Settings"
              active={location.pathname === "/settings"}
              onClick={handleLinkClick}
            />
            <SidebarLink
              to="/help"
              icon={<HelpCircleIcon size={20} />}
              text="Help & Support"
              active={location.pathname === "/help"}
              onClick={handleLinkClick}
            />
            <LogoutButton
              onClick={handleLogout}
              icon={<LogOutIcon size={20} />}
              text={isLoggingOut ? "Signing Out..." : "Sign Out"}
              disabled={isLoggingOut}
            />
          </nav>
          {/* User profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="bg-gray-200 rounded-full p-1">
                <UsersIcon size={24} className="text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user.organizationId?.name || "N/A"}
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
const SidebarLink = ({ to, icon, text, active = false }) => {
  return (
    <Link
      to={to}
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
