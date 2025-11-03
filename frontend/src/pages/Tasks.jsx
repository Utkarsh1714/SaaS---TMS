import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import Sidebar from "@/components/Layout/Sidebar";
import {
  SearchIcon,
  BellIcon,
  UserIcon,
  RefreshCcw,
  XIcon,
  BellDot,
} from "lucide-react";

// Import your new components (ensure these paths are correct)
import TaskList from "../components/Task/TaskList";
import TaskFilters from "../components/Task/TaskFilters";
import TaskStats from "../components/Task/TaskStats";
import TaskCreateDialog from "../components/Task/TaskCreateDialog";
import NotificationPanel from "@/components/Dashboard/NotificationPanel";

const TasksPage = () => {
  // --- State Management ---
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalTasks, setOriginalTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("None");
  const navigate = useNavigate();
  const { addNotification, toggleNotificationPanel, notifications } =
    useNotifications();

  // Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  // Task Creation State
  const [open, setOpen] = useState(false);
  const [hasManager, setHasManager] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [mileStoneInput, setMileStoneInput] = useState("");
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    department: "",
    assignedManager: "",
    deadline: "",
    priority: "Medium",
    milestones: [],
    organizationId: "",
  });

  // --- Data Fetching Logic (Wrapped in useCallback) ---

  // Note: 'filter' parameter is the new filter value passed from TaskFilters or a refresh.
  const fetchTasks = useCallback(
    async (filter) => {
      const currentFilter = filter || activeFilter;
      let endpoint =
        user.role?.name === "Boss"
          ? `api/task/boss`
          : user.role?.name === "Manager"
          ? `api/task/manager`
          : `api/task/employee`;
      let queryParams = "";

      switch (currentFilter) {
        case "Low priority to High":
          queryParams = "?sort=priority&order=asc";
          break;
        case "High priority to Low":
          queryParams = "?sort=priority&order=desc";
          break;
        case "Recently Created":
          queryParams = "?sort=createdAt&order=desc";
          break;
        case "Oldest Created":
          queryParams = "?sort=createdAt&order=asc";
          break;
        case "In Progress":
        case "Completed":
        case "Overdue":
        case "Pending":
          queryParams = `?status=${encodeURIComponent(currentFilter)}`;
          break;
        default:
          queryParams = "";
          break;
      }

      setLoading(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/${endpoint}${queryParams}`,
          { withCredentials: true }
        );

        // Set both lists to the full fetched data
        setTasks(res.data);
        setOriginalTasks(res.data);

        // Reset state
        setActiveFilter(currentFilter);
        setSearchTerm("");
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast.error("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    },
    [user, activeFilter]
  );

  // --- Search & Action Logic ---

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();

    // If the search term is empty, just restore the original filtered list
    if (!term) {
      setTasks(originalTasks);
      if (originalTasks.length > 0) {
        toast.info("Search cleared. Showing filtered list.");
      }
      return;
    }

    const filteredTasks = originalTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term) ||
        task.department?.name.toLowerCase().includes(term) ||
        task.assignedManager?.username.toLowerCase().includes(term)
    );

    // Update the list shown to the user with search results
    setTasks(filteredTasks);

    if (filteredTasks.length === 0) {
      toast.warning(`No task found matching: "${searchTerm}"`);
    } else {
      toast.success(`Found ${filteredTasks.length} task(s).`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearchTerm = () => {
    setSearchTerm("");
    setTasks(originalTasks); // Revert to the master list based on the active filter
    toast.info("Search cleared.");
  };

  const handleRefresh = (e) => {
    e.preventDefault();
    setActiveFilter("None");
    setSearchTerm("");
    fetchTasks("None");
    toast.success("Tasks refreshed successfully!");
  };

  // Create task function
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/task/create`,
        taskData,
        { withCredentials: true }
      );

      const newTask = res.data.task;

      // Update state with the new task and then re-fetch all tasks with current filter to ensure data consistency
      setTasks((prev) => [newTask, ...prev]);
      setOriginalTasks((prev) => [newTask, ...prev]);

      addNotification({
        message: "New Task Created!",
        details: {
          title: newTask.title,
          department: newTask.department.name,
          priority: newTask.priority,
        },
        time: new Date().toLocaleTimeString(),
      });

      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
      setOpen(false);
      // Reset creation state
      setTaskData({
        title: "",
        description: "",
        department: "",
        assignedManager: "",
        deadline: "",
        priority: "Medium",
        milestones: [],
      });
      setSelectedDepartment([]);
      setHasManager(true);
      setMileStoneInput("");
    }
  };

  // Delete task funtion
  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/task/${id}`, {
        withCredentials: true,
      });
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setOriginalTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete the task. Please try again later");
      console.error("Failed to delete the task", error);
    } finally {
      setLoading(false);
    }
  };

  // Error message helper
  const getNoTasksMessage = () => {
    if (tasks.length === 0 && searchTerm.trim()) {
      return `No tasks found for your search term: "${searchTerm}".`;
    }
    if (activeFilter === "None") {
      if (user.role?.name !== "Boss") {
        return "No tasks are available at the moment. Kindly check again later!";
      }
      return "No tasks have been created yet. Please check back later or create a new task.";
    } else if (
      ["Completed", "In Progress", "Overdue", "Pending"].includes(activeFilter)
    ) {
      return `No tasks found with the status '${activeFilter}'.`;
    } else if (
      activeFilter.includes("priority") ||
      activeFilter.includes("Created")
    ) {
      return `No tasks found when filtered by '${activeFilter}'.`;
    }
    return "No tasks available for this filter."; // Fallback message
  };

  // --- useEffect Hook for initial load and filter change ---
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Fetch tasks on initial load or when user changes roles/auth status
    fetchTasks(activeFilter);
  }, [user, navigate]);
  // We only call fetchTasks here. The filter changes are handled by TaskFilters calling fetchTasks directly.

  // --- Render JSX ---
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
            <div className="flex items-center justify-between h-16 gap-4 sm:gap-0">
              <div className="flex">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                >
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
                  {/* Search Bar */}
                  <div className="relative sm:w-64 flex items-center border border-gray-300 rounded-md bg-gray-50 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <div className="absolute inset-y-0 left-0 pl-3 items-center pointer-events-none hidden sm:flex">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="block w-full pl-4 sm:pl-10 pr-8 py-2 leading-5 bg-transparent placeholder-gray-500 focus:outline-none sm:text-sm"
                      placeholder="Search tasks..."
                      type="text"
                    />
                    {searchTerm.length > 0 && (
                      <button
                        onClick={clearSearchTerm}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        title="Clear search"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleSearch}
                    className="ml-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={searchTerm.trim() === ""}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  title="Refresh Tasks"
                >
                  <RefreshCcw className="h-6 w-6" />
                </button>

                {/* Notifications Button (Placeholder) */}
                <button
                  onClick={toggleNotificationPanel}
                  className="flex-shrink-0 p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">View notifications</span>
                  {notifications && notifications.length > 0 ? (
                    <BellDot className="h-6 w-6 text-green-500" />
                  ) : (
                    <BellIcon className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                {/* User Profile (Placeholder) */}
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
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
            {/* Create Task Dialog (Only for Boss role) */}
            {user.role?.name === "Boss" && (
              <TaskCreateDialog
                open={open}
                setOpen={setOpen}
                taskData={taskData}
                setTaskData={setTaskData}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                hasManager={hasManager}
                setHasManager={setHasManager}
                mileStoneInput={mileStoneInput}
                setMileStoneInput={setMileStoneInput}
                handleCreateTask={handleCreateTask}
                loading={loading}
                toast={toast}
              />
            )}
          </div>
          {/* Task Stats (uses originalTasks for accurate counts based on the current filter) */}
          <TaskStats tasks={originalTasks} />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-1">
              {/* Task Filters */}
              <TaskFilters
                activeFilter={activeFilter}
                setActiveFilter={fetchTasks} // Calls fetchTasks, which handles both filter setting and data retrieval
                handleRefresh={handleRefresh}
              />
            </div>
            <div className="lg:col-span-3">
              {/* Task List (renders 'tasks' which is updated by filters OR search) */}
              <TaskList
                tasks={tasks}
                loading={loading}
                getNoTasksMessage={getNoTasksMessage}
                navigate={navigate}
                handleDeleteTask={handleDeleteTask}
                user={user}
              />
            </div>
          </div>
        </main>
      </div>
      <NotificationPanel />
    </div>
  );
};

export default TasksPage;
