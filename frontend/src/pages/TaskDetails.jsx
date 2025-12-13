import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import axios from "axios";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import Sidebar from "@/components/Layout/Sidebar";
import NotificationPanel from "@/components/Dashboard/NotificationPanel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  PenSquare,
  Plus,
  MessageSquare,
  User,
  Layers,
  Menu,
  Briefcase,
  Users,
  Trash2,
  Send,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TaskDetails = () => {
  const { user } = useAuth();
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { toggleNotificationPanel, notifications } = useNotifications();

  // --- UI States ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAssignTeamDialogOpen, setIsAssignTeamDialogOpen] = useState(false);

  // --- Data States ---
  const [taskDetail, setTaskDetail] = useState(null);
  const [departmentTeams, setDepartmentTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // --- Input States ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [mileStoneInput, setMileStoneInput] = useState("");

  // --- Loading/Action States ---
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const isManagerOrBoss =
    user?.role?.name === "Boss" || user?.role?.name === "Manager";

  // --- FETCH DATA ---
  const fetchTask = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task/${taskId}`,
        { withCredentials: true }
      );
      console.log(res.data)
      const data = res.data;
      setTaskDetail(data);
      setTitle(data.title);
      setDescription(data.description);
      setDepartmentTeams(data.department?.teams || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  // --- COMPUTED VALUES ---
  const progressPercentage = useMemo(() => {
    if (!taskDetail?.milestones?.length) return 0;
    const completed = taskDetail.milestones.filter((m) => m.completed).length;
    return Math.round((completed / taskDetail.milestones.length) * 100);
  }, [taskDetail]);

  // --- HANDLERS ---
  const handleUpdateTitleandDesc = async () => {
    setIsSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/task/${taskDetail._id}`,
        { title, description },
        { withCredentials: true }
      );
      toast.success("Task updated!");
      await fetchTask();
      setIsEditing(false);
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTeamAssign = async () => {
    if (!selectedTeam) return;
    setIsAssigning(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/task/${
          taskDetail._id
        }/assign-team`,
        { teamId: selectedTeam },
        { withCredentials: true }
      );
      console.log(res.data)
      toast.success("Team assigned successfully!");
      setIsAssignTeamDialogOpen(false);
      await fetchTask();
    } catch (e) {
      toast.error("Assignment failed");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleMilestoneAdd = () => {
    if (mileStoneInput.trim()) {
      handleAddMilestoneApi(mileStoneInput.trim());
    }
  };

  const handleAddMilestoneApi = async (newTitle) => {
    try {
      // Fix: Only send the NEW milestone. Do not include taskDetail.milestones.
      const newMilestone = { title: newTitle, completed: false };

      // We wrap it in an array because your backend likely expects 'milestones' to be a list to iterate over
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/task/${taskDetail._id}/milestone`,
        { milestones: [newMilestone] },
        { withCredentials: true }
      );

      toast.success("Milestone added");
      setMileStoneInput(""); // Clear input here to ensure it clears only on success
      fetchTask(); // Refresh data
    } catch (e) {
      console.error(e);
      toast.error("Failed to add milestone");
    }
  };

  const handleMilestoneToggle = async (milestoneId, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/task/${taskDetail._id}/milestone`,
        { milestoneId, completed: status },
        { withCredentials: true }
      );
      toast.success("Updated");
      fetchTask();
    } catch (e) {
      toast.error("Failed update");
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comment/${taskDetail._id}`,
        { author: user._id, content: comment },
        { withCredentials: true }
      );
      toast.success("Comment posted");
      setComment("");
      fetchTask();
    } catch (e) {
      toast.error("Failed to post comment");
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/task/${taskDetail._id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success("Status updated");
      fetchTask();
    } catch (e) {
      toast.error("Failed");
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/task/${taskDetail._id}`,
        { withCredentials: true }
      );
      toast.success("Task deleted");
      navigate("/tasks");
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  // --- HELPER: Initials ---
  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "??";

  // --- RENDER HELPERS ---
  const getPriorityBadge = (p) => {
    const colors = {
      High: "text-rose-700 bg-rose-50 border-rose-200",
      Medium: "text-amber-700 bg-amber-50 border-amber-200",
      Low: "text-emerald-700 bg-emerald-50 border-emerald-200",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${
          colors[p] || colors.Low
        }`}
      >
        {p}
      </span>
    );
  };

  const getStatusBadge = (s) => {
    const colors = {
      Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
      Pending: "bg-slate-100 text-slate-800 border-slate-200",
      Overdue: "bg-rose-100 text-rose-800 border-rose-200",
    };
    return (
      <span
        className={`flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold border ${
          colors[s] || colors.Pending
        }`}
      >
        {s} {isManagerOrBoss ? <ChevronDown /> : ""}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  if (!taskDetail)
    return (
      <div className="flex h-screen items-center justify-center">
        Task not found
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
                className="cursor-pointer hover:text-slate-900 hover:underline"
                onClick={() => navigate("/tasks")}
              >
                Tasks
              </span>
              <span>/</span>
              <span className="font-medium text-slate-900 truncate max-w-[200px] uppercase tracking-widest">
                ID-{taskDetail._id.slice(-4)}
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
          <div className="max-w-6xl mx-auto">
            {/* --- 1. HERO HEADER (Title & Status) --- */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                {isEditing ? (
                  <input
                    className="w-full text-3xl font-bold text-slate-900 border-b-2 border-blue-500 pb-2 focus:outline-none bg-transparent"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {taskDetail.title}
                  </h1>
                )}

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Dropdown */}
                  {isManagerOrBoss ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none flex">
                        {/* Change Status */}
                        {getStatusBadge(taskDetail.status)}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {["Pending", "In Progress", "Completed"].map((s) => (
                          <DropdownMenuItem
                            key={s}
                            onClick={() => handleStatusUpdate(s)}
                          >
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    getStatusBadge(taskDetail.status)
                  )}

                  {/* Actions */}
                  <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    {isManagerOrBoss && (
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Task"
                      >
                        <PenSquare size={18} />
                      </button>
                    )}
                    {user.role?.name === "Boss" && (
                      <button
                        onClick={handleDeleteTask}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* Badges Row */}
              <div className="flex items-center gap-3">
                {getPriorityBadge(taskDetail.priority)}
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <Calendar size={14} /> Due{" "}
                  {taskDetail.deadline
                    ? format(new Date(taskDetail.deadline), "MMM d, yyyy")
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* --- LEFT COLUMN (Description, Milestones, Chat) --- */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <div className="bg-white p-4 rounded-2xl">
                  {isEditing ? (
                    <div className="space-y-4">
                      <textarea
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 min-h-[150px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-y"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={handleUpdateTitleandDesc}
                          disabled={isSaving}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">
                      {taskDetail.description || "No description provided."}
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-200 my-6"></div>

                {/* Milestones */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="text-blue-600" size={20} />{" "}
                      Milestones
                    </h3>
                    <span className="text-sm font-medium text-slate-500">
                      {progressPercentage}% Complete
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="space-y-3">
                    {taskDetail.milestones?.map((ms, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                          ms.completed
                            ? "bg-slate-50 border-slate-200 opacity-70"
                            : "bg-white border-slate-200 shadow-sm hover:border-blue-300"
                        }`}
                      >
                        <button
                          disabled={!isManagerOrBoss}
                          onClick={() =>
                            handleMilestoneToggle(ms._id, !ms.completed)
                          }
                          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            ms.completed
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-slate-300 hover:border-blue-400"
                          }`}
                        >
                          {ms.completed && <CheckCircle2 size={16} />}
                        </button>
                        <span
                          className={`text-sm font-medium ${
                            ms.completed
                              ? "text-slate-500 line-through"
                              : "text-slate-800"
                          }`}
                        >
                          {ms.title}
                        </span>
                      </div>
                    ))}

                    {isManagerOrBoss && (
                      <div className="flex gap-2 mt-4">
                        <input
                          type="text"
                          placeholder="Add a new milestone..."
                          className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                          value={mileStoneInput}
                          onChange={(e) => setMileStoneInput(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleMilestoneAdd()
                          }
                        />
                        <Button
                          size="icon"
                          onClick={handleMilestoneAdd}
                          className="shrink-0 rounded-xl"
                        >
                          <Plus size={20} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 my-6"></div>

                {/* Discussion */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <MessageSquare className="text-blue-600" size={20} />{" "}
                    Discussion
                  </h3>

                  <div className="space-y-6 mb-8">
                    {taskDetail.comments?.length > 0 ? (
                      taskDetail.comments.map((c) => (
                        <div key={c._id} className="flex gap-4 group">
                          {/* Avatar */}
                          <div className="shrink-0">
                            {c.author?.profileImage ? (
                              <img
                                src={c.author.profileImage}
                                alt={c.author.firstName}
                                className="w-10 h-10 rounded-full object-cover shadow-sm border border-white"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm border border-white shadow-sm">
                                {getInitials(c.author?.firstName)}
                              </div>
                            )}
                          </div>
                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-bold text-slate-900 text-sm">
                                {c.author?.firstName} {c.author?.lastName}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatDistanceToNow(new Date(c.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-sm text-slate-700 leading-relaxed">
                              {c.content}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-slate-400 italic text-sm py-4">
                        No comments yet. Start the discussion.
                      </p>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <textarea
                      placeholder="Write a comment..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-2 resize-none min-h-11 max-h-32"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                      className="self-end p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* --- RIGHT COLUMN (Sidebar Properties) --- */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  {/* Assignees */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Assigned To
                    </h4>
                    {taskDetail.team?.members || taskDetail.team?.members > 0 ? (
                      <div className="flex flex-col gap-3">
                        {taskDetail.team?.members.map((emp) => (
                          <div
                            key={emp._id}
                            className="flex items-center gap-3"
                          >
                            {emp.profileImage ? (
                              <img
                                src={emp.profileImage}
                                className="w-8 h-8 rounded-full object-cover border border-slate-100"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                {getInitials(emp.firstName)}
                              </div>
                            )}
                            <span className="text-sm font-medium text-slate-700">
                              {emp.firstName} {emp.lastName}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        No employees assigned
                      </p>
                    )}
                  </div>

                  {/* Assigned Team (Visual Fix) */}
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Assigned Team
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Users size={16} />
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {taskDetail.team?.name || "No Team Assigned"}
                      </span>
                    </div>
                  </div>

                  {/* Manager (Profile Image Fix) */}
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Managed By
                    </h4>
                    <div className="flex items-center gap-3">
                      {taskDetail.assignedManager?.profileImage ? (
                        <img
                          src={taskDetail.assignedManager.profileImage}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          alt={taskDetail.assignedManager.firstName}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                          {getInitials(taskDetail.assignedManager?.firstName)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {taskDetail.assignedManager?.firstName}{" "}{taskDetail.assignedManager?.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {taskDetail.assignedManager?.jobTitle || "Manager"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Department
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                        <Layers size={16} />
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {taskDetail.department?.name || "General"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Box */}
                {isManagerOrBoss && !taskDetail.team && (
                  <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-600/20">
                    <h4 className="font-bold text-lg mb-2">Needs a Team?</h4>
                    <p className="text-blue-100 text-sm mb-4">
                      Assign this task to a specific team to start tracking
                      progress.
                    </p>

                    <Dialog
                      open={isAssignTeamDialogOpen}
                      onOpenChange={setIsAssignTeamDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold border-none"
                        >
                          Assign Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Team</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {departmentTeams.length > 0 ? (
                            departmentTeams.map((team) => (
                              <button
                                key={team._id}
                                onClick={() => setSelectedTeam(team._id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                                  selectedTeam === team._id
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-blue-300"
                                }`}
                              >
                                {team.name}
                              </button>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">
                              No teams available.
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={handleTeamAssign}
                          disabled={!selectedTeam || isAssigning}
                          className="w-full mt-6"
                        >
                          {isAssigning ? "Assigning..." : "Confirm Assignment"}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <NotificationPanel />
    </div>
  );
};

export default TaskDetails;
