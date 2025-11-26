// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "sonner";
// import { useAuth } from "@/context/AuthContext";
// import { useNotifications } from "@/context/NotificationContext";
// import Sidebar from "@/components/Layout/Sidebar";
// import {
//   SearchIcon,
//   BellIcon,
//   UserIcon,
//   RefreshCcw,
//   XIcon,
//   BellDot,
// } from "lucide-react";

// import TaskList from "../components/Task/TaskList";
// import TaskFilters from "../components/Task/TaskFilters";
// import TaskStats from "../components/Task/TaskStats";
// import TaskCreateDialog from "../components/Task/TaskCreateDialog";
// import NotificationPanel from "@/components/Dashboard/NotificationPanel";

// const TasksPage = () => {
//   const { user, logout } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [originalTasks, setOriginalTasks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeFilter, setActiveFilter] = useState("None");
//   const navigate = useNavigate();
//   const { addNotification, toggleNotificationPanel, notifications } =
//     useNotifications();

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [open, setOpen] = useState(false);
//   const [hasManager, setHasManager] = useState(true);
//   const [selectedDepartment, setSelectedDepartment] = useState([]);
//   const [mileStoneInput, setMileStoneInput] = useState("");
//   const [taskData, setTaskData] = useState({
//     title: "",
//     description: "",
//     department: "",
//     assignedManager: "",
//     deadline: "",
//     priority: "Medium",
//     milestones: [],
//     organizationId: "",
//   });

//   const fetchTasks = useCallback(
//     async (filter) => {
//       const currentFilter = filter || activeFilter;
//       let endpoint =
//         user.role?.name === "Boss"
//           ? `api/task/boss`
//           : user.role?.name === "Manager"
//           ? `api/task/manager`
//           : `api/task/employee`;
//       let queryParams = "";

//       switch (currentFilter) {
//         case "Low priority to High":
//           queryParams = "?sort=priority&order=asc";
//           break;
//         case "High priority to Low":
//           queryParams = "?sort=priority&order=desc";
//           break;
//         case "Recently Created":
//           queryParams = "?sort=createdAt&order=desc";
//           break;
//         case "Oldest Created":
//           queryParams = "?sort=createdAt&order=asc";
//           break;
//         case "In Progress":
//         case "Completed":
//         case "Overdue":
//         case "Pending":
//           queryParams = `?status=${encodeURIComponent(currentFilter)}`;
//           break;
//         default:
//           queryParams = "";
//           break;
//       }

//       setLoading(true);

//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/task/getTask${queryParams}`,
//           { withCredentials: true }
//         );

//         setTasks(res.data);
//         setOriginalTasks(res.data);

//         setActiveFilter(currentFilter);
//         setSearchTerm("");
//       } catch (error) {
//         console.error("Failed to fetch tasks:", error);
//         toast.error("Failed to load tasks.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [user, activeFilter]
//   );

//   const handleSearch = () => {
//     const term = searchTerm.trim().toLowerCase();

//     if (!term) {
//       setTasks(originalTasks);
//       if (originalTasks.length > 0) {
//         toast.info("Search cleared. Showing filtered list.");
//       }
//       return;
//     }

//     const filteredTasks = originalTasks.filter(
//       (task) =>
//         task.title.toLowerCase().includes(term) ||
//         task.description.toLowerCase().includes(term) ||
//         task.department?.name.toLowerCase().includes(term) ||
//         task.assignedManager?.username.toLowerCase().includes(term)
//     );

//     setTasks(filteredTasks);

//     if (filteredTasks.length === 0) {
//       toast.warning(`No task found matching: "${searchTerm}"`);
//     } else {
//       toast.success(`Found ${filteredTasks.length} task(s).`);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   const clearSearchTerm = () => {
//     setSearchTerm("");
//     setTasks(originalTasks);
//     toast.info("Search cleared.");
//   };

//   const handleRefresh = (e) => {
//     e.preventDefault();
//     setActiveFilter("None");
//     setSearchTerm("");
//     fetchTasks("None");
//     toast.success("Tasks refreshed successfully!");
//   };

//   // Create task
//   const handleCreateTask = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/task/create`,
//         taskData,
//         { withCredentials: true }
//       );

//       const newTask = res.data.task;

//       setTasks((prev) => [newTask, ...prev]);
//       setOriginalTasks((prev) => [newTask, ...prev]);

//       addNotification({
//         message: "New Task Created!",
//         details: {
//           title: newTask.title,
//           department: newTask.department.name,
//           priority: newTask.priority,
//         },
//         time: new Date().toLocaleTimeString(),
//       });

//       toast.success("Task created successfully!");
//     } catch (error) {
//       console.error("Failed to create task:", error);
//       toast.error("Failed to create task");
//     } finally {
//       setLoading(false);
//       setOpen(false);
//       setTaskData({
//         title: "",
//         description: "",
//         department: "",
//         assignedManager: "",
//         deadline: "",
//         priority: "Medium",
//         milestones: [],
//       });
//       setSelectedDepartment([]);
//       setHasManager(true);
//       setMileStoneInput("");
//     }
//   };

//   // Delete task funtion
//   const handleDeleteTask = async (id) => {
//     setLoading(true);
//     try {
//       await axios.delete(`${import.meta.env.VITE_API_URL}/api/task/${id}`, {
//         withCredentials: true,
//       });
//       setTasks((prev) => prev.filter((task) => task._id !== id));
//       setOriginalTasks((prev) => prev.filter((task) => task._id !== id));
//       toast.success("Task deleted successfully.");
//     } catch (error) {
//       toast.error("Failed to delete the task. Please try again later");
//       console.error("Failed to delete the task", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Error message helper
//   const getNoTasksMessage = () => {
//     if (tasks.length === 0 && searchTerm.trim()) {
//       return `No tasks found for your search term: "${searchTerm}".`;
//     }
//     if (activeFilter === "None") {
//       if (user.role?.name !== "Boss") {
//         return "No tasks are available at the moment. Kindly check again later!";
//       }
//       return "No tasks have been created yet. Please check back later or create a new task.";
//     } else if (
//       ["Completed", "In Progress", "Overdue", "Pending"].includes(activeFilter)
//     ) {
//       return `No tasks found with the status '${activeFilter}'.`;
//     } else if (
//       activeFilter.includes("priority") ||
//       activeFilter.includes("Created")
//     ) {
//       return `No tasks found when filtered by '${activeFilter}'.`;
//     }
//     return "No tasks available for this filter.";
//   };

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     fetchTasks(activeFilter);
//   }, [user, navigate]);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="bg-white shadow-sm z-10">
//           <div className="px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between h-16 gap-4 sm:gap-0">
//               <div className="flex">
//                 <button
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                   className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
//                 >
//                   <svg
//                     className="h-6 w-6"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 6h16M4 12h16M4 18h7"
//                     />
//                   </svg>
//                 </button>
//                 <div className="ml-4 flex items-center lg:ml-0">
//                   <div className="relative sm:w-64 flex items-center border border-gray-300 rounded-md bg-gray-50 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
//                     <div className="absolute inset-y-0 left-0 pl-3 items-center pointer-events-none hidden sm:flex">
//                       <SearchIcon className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       onKeyDown={handleKeyDown}
//                       className="block w-full pl-4 sm:pl-10 pr-8 py-2 leading-5 bg-transparent placeholder-gray-500 focus:outline-none sm:text-sm"
//                       placeholder="Search tasks..."
//                       type="text"
//                     />
//                     {searchTerm.length > 0 && (
//                       <button
//                         onClick={clearSearchTerm}
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                         title="Clear search"
//                       >
//                         <XIcon className="h-4 w-4" />
//                       </button>
//                     )}
//                   </div>
//                   <button
//                     onClick={handleSearch}
//                     className="ml-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
//                     disabled={searchTerm.trim() === ""}
//                   >
//                     Search
//                   </button>
//                 </div>
//               </div>
//               <div className="flex items-center justify-center gap-2">
//                 {/* Refresh Button */}
//                 <button
//                   onClick={handleRefresh}
//                   className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   title="Refresh Tasks"
//                 >
//                   <RefreshCcw className="h-6 w-6" />
//                 </button>

//                 {/* Notifications Button (Placeholder) */}
//                 <button
//                   onClick={toggleNotificationPanel}
//                   className="flex-shrink-0 p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <span className="sr-only">View notifications</span>
//                   {notifications && notifications.length > 0 ? (
//                     <BellDot className="h-6 w-6 text-green-500" />
//                   ) : (
//                     <BellIcon className="h-6 w-6 text-gray-400" />
//                   )}
//                 </button>
//                 {/* User Profile (Placeholder) */}
//                 <div className="relative">
//                   <div>
//                     <button className="flex items-center max-w-xs bg-gray-100 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                       <span className="sr-only">Open user menu</span>
//                       <UserIcon className="h-8 w-8 rounded-full p-1" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>
//         <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
//           <div className="mb-6 flex justify-between items-center">
//             <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
//             {user.role?.name === "Boss" && (
//               <TaskCreateDialog
//                 open={open}
//                 setOpen={setOpen}
//                 taskData={taskData}
//                 setTaskData={setTaskData}
//                 selectedDepartment={selectedDepartment}
//                 setSelectedDepartment={setSelectedDepartment}
//                 hasManager={hasManager}
//                 setHasManager={setHasManager}
//                 mileStoneInput={mileStoneInput}
//                 setMileStoneInput={setMileStoneInput}
//                 handleCreateTask={handleCreateTask}
//                 loading={loading}
//                 toast={toast}
//               />
//             )}
//           </div>
//           <TaskStats tasks={originalTasks} />
//           <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
//             <div className="lg:col-span-1">
//               <TaskFilters
//                 activeFilter={activeFilter}
//                 setActiveFilter={fetchTasks}
//                 handleRefresh={handleRefresh}
//               />
//             </div>
//             <div className="lg:col-span-3">
//               <TaskList
//                 tasks={tasks}
//                 loading={loading}
//                 getNoTasksMessage={getNoTasksMessage}
//                 navigate={navigate}
//                 handleDeleteTask={handleDeleteTask}
//                 user={user}
//               />
//             </div>
//           </div>
//         </main>
//       </div>
//       <NotificationPanel />
//     </div>
//   );
// };

// export default TasksPage;

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import Sidebar from "@/components/Layout/Sidebar";
import {
  Search,
  RotateCcw,
  LayoutList,
  LayoutGrid, // Icon for Kanban
  Plus,
  Loader2,
  Menu,
  Bell,
} from "lucide-react";

// Components
import TaskList from "../components/Task/TaskList";
import KanbanBoard from "../components/Task/KanbanBoard"; // New Component
import TaskStats from "../components/Task/TaskStats";
import TaskCreateDialog from "../components/Task/TaskCreateDialog";
import NotificationPanel from "@/components/Dashboard/NotificationPanel";
import TaskFilters from "@/components/Task/TaskFilters";

const Tasks = () => {
  const { user } = useAuth();
  const { toggleNotificationPanel, notifications } = useNotifications();
  const navigate = useNavigate();

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'board'
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Data State
  const [tasks, setTasks] = useState([]);
  const [originalTasks, setOriginalTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Task Creation Form State
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
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [hasManager, setHasManager] = useState(true);
  const [mileStoneInput, setMileStoneInput] = useState("");

  // --- Fetch Tasks ---
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint =
        user.role?.name === "Boss"
          ? `api/task/boss`
          : user.role?.name === "Manager"
          ? `api/task/manager`
          : `api/task/employee`;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task/getTask`,
        { withCredentials: true }
      );
      setTasks(res.data);
      setOriginalTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  // --- Filter Logic ---
  useEffect(() => {
    let filtered = originalTasks;

    // 1. Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term)
      );
    }

    // 2. Category Filter (Status/Priority)
    if (activeFilter !== "All") {
      // Example: Filter by Status
      if (
        ["Pending", "In Progress", "Completed", "Overdue"].includes(
          activeFilter
        )
      ) {
        filtered = filtered.filter((t) => t.status === activeFilter);
      }
      // Example: Filter by Priority
      else if (["High", "Medium", "Low"].includes(activeFilter)) {
        filtered = filtered.filter((t) => t.priority === activeFilter);
      }
    }

    setTasks(filtered);
  }, [searchTerm, activeFilter, originalTasks]);

  // --- Handlers ---
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

      setTasks((prev) => [newTask, ...prev]);
      setOriginalTasks((prev) => [newTask, ...prev]);
      toast.success("Task created successfully!");
      setIsCreateOpen(false);

      // Reset Form
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
    } catch (error) {
      console.error("Create error:", error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/task/${id}`, {
        withCredentials: true,
      });
      toast.success("Task deleted.");
      // Update original source of truth too
      setOriginalTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      setTasks(previousTasks); // Revert on error
      toast.error("Failed to delete task.");
    }
  };

  // Function passed to Kanban to update status on drag end
  const handleUpdateStatus = async (taskId, newStatus) => {
    // Optimistic Update
    const updatedTasks = tasks.map((t) =>
      t._id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);
    setOriginalTasks(updatedTasks); // Keep sync

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/task/${taskId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      // Optionally show silent toast or nothing on success
    } catch (error) {
      console.error("Status update failed", error);
      toast.error("Failed to update status");
      fetchTasks(); // Revert data
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-900">All Tasks</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden sm:flex items-center relative">
              <Search className="absolute left-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={toggleNotificationPanel}
              className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Bell size={22} />
              {notifications?.length > 0 && (
                <span className="absolute top-1.5 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                {/* View Toggle & Filter */}
                <div className="flex items-center gap-2 p-1 bg-slate-200 rounded-lg">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === "list"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LayoutList size={16} /> List
                  </button>
                  <button
                    onClick={() => setViewMode("board")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === "board"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LayoutGrid size={16} /> Board
                  </button>
                </div>
                <TaskFilters 
                      activeFilter={activeFilter} 
                      setActiveFilter={setActiveFilter} 
                   />
              </div>

              {/* Create Button */}
              {user.role?.name === "Boss" && (
                <TaskCreateDialog
                  open={isCreateOpen}
                  setOpen={setIsCreateOpen}
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

            {/* Stats */}
            <TaskStats tasks={originalTasks} />

            {/* Views */}
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
              </div>
            ) : (
              <>
                {viewMode === "list" ? (
                  <TaskList
                    tasks={tasks}
                    loading={loading}
                    handleDeleteTask={handleDeleteTask}
                    user={user}
                    navigate={navigate}
                  />
                ) : (
                  <KanbanBoard
                    tasks={tasks}
                    onUpdateStatus={handleUpdateStatus}
                    navigate={navigate}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
      <NotificationPanel />
    </div>
  );
};

export default Tasks;
