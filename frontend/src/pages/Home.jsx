import React, { useState, useEffect } from "react";
import axios from "axios";
import { BellIcon, SearchIcon, UserIcon, Loader, BellDot } from "lucide-react";

// New Component Imports (Update paths as necessary for your project structure)
import Sidebar from "../components/Layout/Sidebar";
import StatsCards from "../components/Dashboard/StatsCards";
import TasksChart from "../components/Dashboard/TasksChart";
import EmployeeTable from "../components/Dashboard/EmployeeTable";
import MeetingsCard from "../components/Dashboard/MeetingsCard";
import ActivityFeed from "../components/Dashboard/ActivityFeed";
import DepartmentsChart from "../components/Dashboard/DepartmentsChart";
import UpcomingDeadline from "@/components/UpcomingDeadline";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NotificationPanel from "../components/Dashboard/NotificationPanel";
import { useNotifications } from "@/context/NotificationContext";

const Home = () => {
  const { logout } = useAuth();
  const { toggleNotificationPanel, notifications } = useNotifications();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // State for Overview Data
  const [overviewData, setOverviewData] = useState({});
  const [departmentCount, setDepartmentCount] = useState([]);
  const [monthlyTaskCompletion, setMonthlyTaskCompletion] = useState([]);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Start loading state

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
      // alert or toast error message
      alert("Logout failed");
    } finally {
      setIsLoggingOut(false); // Stop loading state (should ideally not run if navigate works)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard/overview-data1`,
          { withCredentials: true }
        );

        // Destructure and set the state with the fetched data
        const {
          taskPriorityCount,
          departmentCount,
          taskStatusCount,
          monthlyTaskCompletion,
          ...restOverviewData // Collect taskCount, activeUser, overdueTaskCount, etc.
        } = res.data;
        console.log(departmentCount);

        setOverviewData(restOverviewData);
        setDepartmentCount(departmentCount);
        setMonthlyTaskCompletion(monthlyTaskCompletion);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error display if needed
      } finally {
        setLoading(false); // Stop loading once data is fetched or an error occurs
      }
    };

    fetchData();
  }, []);

  // CHANGE 2: Add useEffect to handle window resizing
  useEffect(() => {
    // Handler to close the sidebar if the screen is resized back down to mobile size
    const handleResize = () => {
      // If the screen size is less than 1024px, ensure the sidebar is closed.
      if (!checkIsLargeScreen()) {
        setSidebarOpen(false);
      } else {
        // Optionally, keep it open on large screens after a resize
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Show a loading spinner or placeholder while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader className="h-10 w-10 animate-spin text-blue-500" />
        <p className="ml-3 text-lg text-gray-700">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        handleLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                >
                  <span className="sr-only">Open sidebar</span>
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
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </button>
                <div className="ml-4 flex items-center lg:ml-0">
                  <div className="relative w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <button
                  onClick={toggleNotificationPanel}
                  className="flex-shrink-0 p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">View notifications</span>
                  {/* Notification Icon */}
                  {notifications && notifications.length > 0 ? (
                    <BellDot className="text-green-500" />
                  ) : (
                    <BellIcon className="text-gray-400" />
                  )}
                </button>
                <div className="relative">
                  <div>
                    <button className="flex items-center max-w-xs bg-gray-100 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <span className="sr-only">Open user menu</span>
                      <UserIcon className="h-8 w-8 rounded-full p-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>

          {/* Stats Cards - Pass all overview data */}
          <StatsCards
            taskCount={overviewData.taskCount}
            activeUser={overviewData.activeUser}
            overdueTaskCount={overviewData.overdueTaskCount}
            averageCompletionDays={overviewData.averageCompletionDays}
          />

          {/* Charts Section */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Tasks Chart - Pass priority and status data */}
            <TasksChart monthlyTaskCompletion={monthlyTaskCompletion} />

            {/* Departments Chart - Pass department count data */}
            <DepartmentsChart departmentCounts={departmentCount} />
          </div>

          {/* Table and Meetings */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EmployeeTable />
            </div>
            <div>
              <MeetingsCard />
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="mt-8">
            <UpcomingDeadline />
          </div>

          {/* Activity Feed */}
          <div className="mt-8">
            <ActivityFeed />
          </div>
        </main>
      </div>
      <NotificationPanel />
    </div>
  );
};

export default Home;
