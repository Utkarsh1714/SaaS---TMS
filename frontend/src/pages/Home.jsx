import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, Search, Menu, Loader2, User } from "lucide-react"; // Updated icons

// Component Imports
import Sidebar from "../components/Layout/Sidebar";
import StatsCards from "../components/Dashboard/StatsCards";
import TasksChart from "../components/Dashboard/TasksChart";
import EmployeeTable from "../components/Dashboard/EmployeeTable";
import MeetingsCard from "../components/Dashboard/MeetingsCard";
import ActivityFeed from "../components/Dashboard/ActivityFeed";
import DepartmentsChart from "../components/Dashboard/DepartmentsChart";
import UpcomingDeadline from "@/components/UpcomingDeadline";
import NotificationPanel from "../components/Dashboard/NotificationPanel";
import { useNotifications } from "@/context/NotificationContext";

const Home = () => {
  const { toggleNotificationPanel, notifications } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data State
  const [overviewData, setOverviewData] = useState({});
  const [departmentCount, setDepartmentCount] = useState([]);
  const [monthlyTaskCompletion, setMonthlyTaskCompletion] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard/overview-data1`,
          { withCredentials: true }
        );
        setOverviewData(res.data);
        setDepartmentCount(res.data.departmentEmployeeCounts);
        setMonthlyTaskCompletion(res.data.monthlyTaskCompletion);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-600 font-medium animate-pulse">
          Initializing Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <Menu size={24} />
              </button>

              {/* Search Bar */}
              <div className="hidden sm:flex items-center max-w-md w-full relative group">
                <Search
                  className="absolute left-3 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              {/* Notification Bell */}
              <button
                onClick={toggleNotificationPanel}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Bell size={24} />
                {notifications?.length > 0 && (
                  <span className="absolute top-1.5 right-2 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
              </button>

              {/* User Avatar Trigger (Dropdown logic usually goes here) */}
              <button className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <User className="text-slate-700 h-5 w-5" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Welcome / Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Dashboard Overview
                </h1>
                <p className="text-slate-500 mt-1">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
              <div className="flex gap-3">
                {/* Action buttons can go here (e.g. "Create Report") */}
              </div>
            </div>

            {/* Stats Grid */}
            <StatsCards
              taskCount={overviewData.totalTaskCount}
              activeUser={overviewData.activeEmployeeCount}
              overdueTaskCount={overviewData.overdueTaskCount}
              averageCompletionDays={overviewData.avgTaskCompletionDays}
            />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TasksChart monthlyTaskCompletion={monthlyTaskCompletion} />
              <DepartmentsChart departmentCounts={departmentCount} />
            </div>

            {/* Middle Section: Employees & Meetings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <EmployeeTable />
              </div>
              <div className="flex flex-col gap-6">
                <MeetingsCard />
                <UpcomingDeadline />{" "}
                {/* Moved Deadline here for better layout on large screens */}
              </div>
            </div>

            {/* Bottom Section: Activity Feed */}
            <ActivityFeed />
          </div>
        </main>
      </div>

      {/* Slide-over Panels */}
      <NotificationPanel />
    </div>
  );
};

export default Home;
