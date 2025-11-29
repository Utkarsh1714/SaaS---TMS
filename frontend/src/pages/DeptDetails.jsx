import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building,
  Users,
  Plus,
  Trash2,
  User,
  CheckCircle2,
  Clock,
  Briefcase,
  Settings,
  Bell,
  Menu,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  UserPlus,
  MoreHorizontal,
  ChevronRight as ChevronIcon,
} from "lucide-react";
import Sidebar from "@/components/Layout/Sidebar";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import AddTeamMemberModal from "@/components/Departments/AddTeamMemberModal";
import ChangeManagerModal from "@/components/ChangeManagerModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isPast, parseISO } from "date-fns";
import NotificationPanel from "@/components/Dashboard/NotificationPanel";

const DepartmentDetails = () => {
  const { user } = useAuth();
  const { id: departmentId } = useParams();
  const navigate = useNavigate();
  const { toggleNotificationPanel, notifications } = useNotifications();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deptDetails, setDeptDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isChangeManagerOpen, setIsChangeManagerOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);

  // Filters
  const [taskSearch, setTaskSearch] = useState("");
  const [taskFilterStatus, setTaskFilterStatus] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const isManagerOrBoss =
    user?.role?.name === "Boss" || user?.role?.name === "Manager";

  const fetchDepartmentDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/dept-details/${departmentId}/deptdetails-page`,
        { withCredentials: true }
      );
      setDeptDetails(res.data);
    } catch (error) {
      console.error("Error fetching details:", error);
      toast.error("Failed to load department details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departmentId) fetchDepartmentDetails();
  }, [departmentId]);

  // --- Logic ---
  const tasks = deptDetails?.department?.task || [];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(taskSearch.toLowerCase());
      const matchesStatus =
        taskFilterStatus === "All" || task.status === taskFilterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, taskSearch, taskFilterStatus]);

  const paginatedTasks = filteredTasks.slice(
    (taskPage - 1) * ITEMS_PER_PAGE,
    taskPage * ITEMS_PER_PAGE
  );
  const totalTaskPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const employees = deptDetails?.allEmpOfDept || [];
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalEmployeePages = Math.ceil(employees.length / ITEMS_PER_PAGE);

  // Handlers
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setCreatingTeam(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/team`,
        { name: teamName, departmentId },
        { withCredentials: true }
      );
      toast.success("Team created");
      setIsCreateTeamOpen(false);
      setTeamName("");
      fetchDepartmentDetails();
    } catch (error) {
      toast.error("Failed to create team");
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleTeamDelete = async (teamId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/team/${teamId}/delete`,
        { withCredentials: true }
      );
      toast.success("Team deleted");
      fetchDepartmentDetails();
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };

  // ✅ FIX: Safer Initials Function
  const getInitials = (name) => {
    if (!name) return "UN";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span
                className="cursor-pointer hover:text-slate-900"
                onClick={() => navigate("/departments")}
              >
                Departments
              </span>
              <span>/</span>
              <span className="font-bold text-slate-900 truncate max-w-[200px]">
                {deptDetails?.department.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
          <div className="max-w-7xl mx-auto space-y-8">
            {/* 1. DEPARTMENT HEADER */}
            <AnimatedContent direction="vertical" distance={20}>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex gap-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                        <Building size={32} />
                      </div>
                      <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                          {deptDetails?.department.name}
                        </h1>
                        <p className="text-slate-500 max-w-xl leading-relaxed text-sm">
                          {deptDetails?.department.description ||
                            "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Manager Widget */}
                    <div className="flex items-center gap-4 p-1 pr-4 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                      {deptDetails?.department.manager?.profileImage ? (
                        <img
                          src={deptDetails.department.manager.profileImage}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                          {getInitials(
                            deptDetails?.department.manager?.firstName
                          )}
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Head of Dept
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {deptDetails?.department.manager?.firstName} {deptDetails?.department.manager?.lastName}
                        </p>
                      </div>
                      {isManagerOrBoss && (
                        <button
                          onClick={() => setIsChangeManagerOpen(true)}
                          className="ml-2 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Settings size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t border-slate-100">
                    <StatBox
                      label="Total Employees"
                      value={deptDetails?.totalEmp}
                      icon={<Users size={20} className="text-blue-600" />}
                      color="bg-blue-50"
                    />
                    <StatBox
                      label="Active Tasks"
                      value={deptDetails?.activeTask}
                      icon={<Briefcase size={20} className="text-amber-600" />}
                      color="bg-amber-50"
                    />
                    <StatBox
                      label="Completed"
                      value={deptDetails?.completedTask}
                      icon={
                        <CheckCircle2 size={20} className="text-emerald-600" />
                      }
                      color="bg-emerald-50"
                    />
                    <StatBox
                      label="Teams"
                      value={deptDetails?.department.teams.length}
                      icon={<Users size={20} className="text-indigo-600" />}
                      color="bg-indigo-50"
                    />
                  </div>
                </div>
              </div>
            </AnimatedContent>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full items-start">
              {/* LEFT COLUMN (Main Content) */}
              <div className="lg:col-span-2 space-y-8">
                {/* TEAMS SECTION */}
                <section>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Users size={20} className="text-slate-400" /> Teams
                    </h2>
                    <div className="flex items-center justify-center">
                      {isManagerOrBoss && (
                        <div className="p-4 border-b border-slate-100 flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => setIsAddMemberOpen(true)}
                            className="gap-2 h-9 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm hover:text-blue-600"
                          >
                            <UserPlus size={16} /> Add Team Member
                          </Button>
                        </div>
                      )}
                      {isManagerOrBoss && (
                        <Dialog
                          open={isCreateTeamOpen}
                          onOpenChange={setIsCreateTeamOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 h-8"
                            >
                              <Plus size={14} /> Create Team
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create New Team</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={handleCreateTeam}
                              className="mt-4 space-y-4"
                            >
                              <input
                                className="w-full p-2 border rounded-md"
                                placeholder="Team Name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                              />
                              <Button
                                type="submit"
                                className="w-full"
                                disabled={creatingTeam}
                              >
                                {creatingTeam ? "Creating..." : "Create Team"}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deptDetails?.department.teams.map((team) => (
                      <div
                        key={team._id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group relative"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {team.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm">
                                {team.name}
                              </h3>
                              <p className="text-xs text-slate-500">
                                {team.members.length} Members
                              </p>
                            </div>
                          </div>
                          {isManagerOrBoss && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all">
                                  <Trash2 size={16} />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Team?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Irreversible action.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleTeamDelete(team._id)}
                                    className="bg-rose-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>

                        {/* Avatars */}
                        <div className="flex -space-x-2 overflow-hidden pl-1">
                          {team.members.length > 0 ? (
                            team.members.slice(0, 5).map((m) =>
                              m.profileImage ? (
                                <img
                                  key={m._id}
                                  src={m.profileImage}
                                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                  title={m.firstName}
                                />
                              ) : (
                                <div
                                  key={m._id}
                                  className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700"
                                  title={m.firstName}
                                >
                                  {getInitials(m.firstName)}
                                </div>
                              )
                            )
                          ) : (
                            <span className="text-xs text-slate-400 italic py-1.5">
                              No members added yet.
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* TABS SECTION */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <Tabs defaultValue="employees" className="w-full">
                    <div className="border-b border-slate-200 px-6 pt-4 bg-slate-50/50">
                      <TabsList className="bg-transparent gap-8 p-0 h-auto">
                        <TabTrigger value="employees">
                          Employees{" "}
                          <span className="ml-2 bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">
                            {employees.length}
                          </span>
                        </TabTrigger>
                        <TabTrigger value="tasks">
                          Tasks{" "}
                          <span className="ml-2 bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">
                            {tasks.length}
                          </span>
                        </TabTrigger>
                      </TabsList>
                    </div>

                    {/* --- EMPLOYEES TAB --- */}
                    <TabsContent value="employees" className="p-0">
                      <div className="divide-y divide-slate-100 min-h-[300px] bg-white">
                        {paginatedEmployees.length > 0 ? (
                          paginatedEmployees.map((emp) => (
                            <div
                              key={emp._id}
                              className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group cursor-pointer"
                              onClick={() => navigate(`/employees/${emp._id}`)}
                            >
                              <div className="flex items-center gap-4">
                                {emp.profileImage ? (
                                  <img
                                    src={emp.profileImage}
                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200">
                                    {getInitials(emp.firstName)}
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {emp.firstName} {emp.lastName}
                                  </p>
                                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                    {emp.email}{" "}
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>{" "}
                                    {emp.jobTitle}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                    emp.status === "Active"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                      : "bg-slate-100 text-slate-500 border border-slate-200"
                                  }`}
                                >
                                  {emp.status}
                                </span>
                                <ChevronRight
                                  size={16}
                                  className="text-slate-300 group-hover:text-blue-500 transition-colors"
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center">
                            <User size={32} className="mb-2 opacity-20" />
                            No employees found.
                          </div>
                        )}
                      </div>
                      {/* Pagination */}
                      {totalEmployeePages > 1 && (
                        <PaginationControls
                          currentPage={currentPage}
                          totalPages={totalEmployeePages}
                          onPrev={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          onNext={() =>
                            setCurrentPage((p) =>
                              Math.min(totalEmployeePages, p + 1)
                            )
                          }
                        />
                      )}
                    </TabsContent>

                    {/* --- TASKS TAB --- */}
                    <TabsContent value="tasks" className="p-0">
                      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 bg-white">
                        <div className="relative flex-1">
                          <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={16}
                          />
                          <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
                            value={taskSearch}
                            onChange={(e) => setTaskSearch(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <select
                            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                            value={taskFilterStatus}
                            onChange={(e) =>
                              setTaskFilterStatus(e.target.value)
                            }
                          >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 min-h-[300px] bg-white">
                        {paginatedTasks.length > 0 ? (
                          paginatedTasks.map((task) => (
                            <div
                              key={task._id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer group"
                              onClick={() => navigate(`/tasks/${task._id}`)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2.5 mb-1">
                                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                    {task.title}
                                  </p>
                                  <PriorityBadge priority={task.priority} />
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span
                                    className={`flex items-center gap-1.5 ${
                                      task.deadline &&
                                      isPast(new Date(task.deadline)) &&
                                      task.status !== "Completed"
                                        ? "text-rose-500 font-bold"
                                        : ""
                                    }`}
                                  >
                                    <Calendar size={14} />{" "}
                                    {task.deadline
                                      ? format(new Date(task.deadline), "MMM d")
                                      : "No Date"}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Clock size={14} />{" "}
                                    {
                                      task.milestones?.filter(
                                        (m) => m.completed
                                      ).length
                                    }
                                    /{task.milestones?.length || 0} Milestones
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mt-3 sm:mt-0 pl-0 sm:pl-4">
                                <div
                                  className="flex items-center gap-2"
                                  title={`Assigned to: ${task.assignedManager?.firstName}`}
                                >
                                  {task.assignedManager ? (
                                    <img
                                      src={task.assignedManager.profileImage}
                                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                    />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                      {getInitials(
                                        task.assignedManager?.firstName
                                      )}
                                    </div>
                                  )}
                                </div>
                                <StatusBadge status={task.status} />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center">
                            <FileText size={32} className="mb-2 opacity-20" />
                            No tasks match your search.
                          </div>
                        )}
                      </div>
                      {totalTaskPages > 1 && (
                        <PaginationControls
                          currentPage={taskPage}
                          totalPages={totalTaskPages}
                          onPrev={() => setTaskPage((p) => Math.max(1, p - 1))}
                          onNext={() =>
                            setTaskPage((p) => Math.min(totalTaskPages, p + 1))
                          }
                        />
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* RIGHT COLUMN (Sticky Quick Actions) */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <ActionButton
                      onClick={() => setIsAddMemberOpen(true)}
                      icon={<UserPlus size={18} />}
                      label="Add New Member"
                      color="text-blue-600"
                    />
                    <ActionButton
                      onClick={() => setIsCreateTeamOpen(true)}
                      icon={<Plus size={18} />}
                      label="Create Sub-Team"
                      color="text-indigo-600"
                    />
                    <ActionButton
                      onClick={() => {
                        /* Todo */
                      }}
                      icon={<Calendar size={18} />}
                      label="Schedule Meeting"
                      color="text-emerald-600"
                    />
                    <ActionButton
                      onClick={() => {
                        /* Todo */
                      }}
                      icon={<FileText size={18} />}
                      label="Generate Report"
                      color="text-amber-600"
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Department Info
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 flex items-center gap-2">
                          <Clock size={14} /> Established
                        </span>
                        <span className="font-medium text-slate-900">
                          {deptDetails?.department.createdAt
                            ? format(
                                new Date(deptDetails.department.createdAt),
                                "MMM yyyy"
                              )
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 flex items-center gap-2">
                          <Building size={14} /> Office
                        </span>
                        <span className="font-medium text-slate-900">
                          {user.organizationId?.country || "HQ"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isAddMemberOpen && (
        <AddTeamMemberModal
          onClose={() => setIsAddMemberOpen(false)}
          teams={deptDetails.department.teams}
          employees={employees}
        />
      )}
      {isChangeManagerOpen && (
        <ChangeManagerModal
          onClose={() => setIsChangeManagerOpen(false)}
          employees={employees}
          departmentId={departmentId}
          onChanged={fetchDepartmentDetails}
        />
      )}
      <NotificationPanel />
    </div>
  );
};

// Sub-Components
const StatBox = ({ label, value, icon, color }) => (
  <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${color} bg-opacity-50`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xl font-extrabold text-slate-900">{value || 0}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </p>
    </div>
  </div>
);

const ActionButton = ({ onClick, icon, label, color }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm transition-all group"
  >
    <div className="flex items-center gap-3">
      <div
        className={`p-2 bg-slate-50 rounded-lg group-hover:bg-white ${color}`}
      >
        {icon}
      </div>
      <span className="font-semibold text-slate-700 text-sm group-hover:text-slate-900">
        {label}
      </span>
    </div>
    <ChevronRight
      size={16}
      className="text-slate-300 group-hover:text-blue-500"
    />
  </button>
);

const TabTrigger = ({ value, children }) => (
  <TabsTrigger
    value={value}
    className="px-4 py-3 text-sm font-bold text-slate-500 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 transition-all rounded-none hover:text-slate-800"
  >
    {children}
  </TabsTrigger>
);

const PaginationControls = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
    <span className="text-xs text-slate-500 font-medium">
      Page {currentPage} of {totalPages}
    </span>
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={14} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={14} />
      </Button>
    </div>
  </div>
);

const PriorityBadge = ({ priority }) => {
  const colors = {
    High: "text-rose-600 bg-rose-50 border-rose-100",
    Medium: "text-amber-600 bg-amber-50 border-amber-100",
    Low: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };
  return (
    <span
      className={`px-1.5 py-0.5 rounded border text-[10px] uppercase font-bold ${
        colors[priority] || colors.Low
      }`}
    >
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    "In Progress": "bg-blue-50 text-blue-700 border-blue-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Overdue: "bg-rose-50 text-rose-700 border-rose-100",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
        colors[status] || "bg-slate-50 text-slate-600 border-slate-100"
      }`}
    >
      {status}
    </span>
  );
};

export default DepartmentDetails;
