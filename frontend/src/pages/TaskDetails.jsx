import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import axios from "axios";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { MdDeleteForever } from "react-icons/md";
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
  AlertCircleIcon,
  ArrowLeftIcon,
  BellDot,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  Plus,
  PlusIcon,
  SaveIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

const TaskDetails = () => {
  const { user, logout } = useAuth();
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { toggleNotificationPanel, notifications } = useNotifications();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAssignTeamDialogOpen, setIsAssignTeamDialogOpen] = useState(false);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updatingMilestone, setUpdatingMilestone] = useState(false);
  const [creatingMilestone, setCreatingMilestone] = useState(false);
  const [addingComment, setAddingComment] = useState(false);

  const [taskDetail, setTaskDetail] = useState(null);
  const [departmentTeams, setDepartmentTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [deadline, setDeadline] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [task, setTask] = useState({
    id: taskId,
    title: "Update website homepage design",
    description:
      "Implement the new hero section and update navigation. This includes redesigning the main hero area with new imagery, updating the navigation menu structure, and ensuring responsive design across all devices.",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
    createdDate: "2024-01-01",
    assignees: [
      {
        id: 1,
        name: "Jane Cooper",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        id: 2,
        name: "Cody Fisher",
        avatar:
          "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
    tags: ["Design", "Website", "Frontend"],
    comments: [
      {
        id: 1,
        author: "Jane Cooper",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        content:
          "Started working on the hero section. Should have the first draft ready by tomorrow.",
        timestamp: "2 hours ago",
      },
      {
        id: 2,
        author: "Cody Fisher",
        avatar: "https",
        content: "Great! I'll review it once you're done and provide feedback.",
        timestamp: "1 hour ago",
      },
    ],
  });

  const [milestones, setMilestones] = useState([]);
  const [mileStoneInput, setMileStoneInput] = useState("");
  const [isSavingMilestones, setIsSavingMilestones] = useState(false);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  const getInitials = (username) => {
    if (!username) return "";
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const fetchTask = async () => {
    if (!loading) setLoading(true); // Show loader on refetch
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task/${taskId}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setTaskDetail(res.data);
      // Set form states from fetched data
      setTitle(res.data.title);
      setDescription(res.data.description);
      setDepartmentTeams(res.data.department?.teams || []);
      setTaskStatus(res.data.status);
      setTaskPriority(res.data.priority);
      setDeadline(res.data.deadline);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTitleandDesc = async () => {
    // ... (Your existing function, which is correct)
    setIsSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/task/${taskDetail._id}`,
        { title, description },
        { withCredentials: true }
      );
      toast.success("Task updated successfully!");
      await fetchTask(); // Refetch
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTeamAssign = async () => {
    // ... (Your existing function, which is correct)
    setIsAssigning(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/task/${
          taskDetail._id
        }/assign-team`,
        { teamId: selectedTeam },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Team assigned to task successfully");
        setIsAssignTeamDialogOpen(false);
        setSelectedTeam(null);
        await fetchTask(); // Refetch to show new team name
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to assign team.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleTaskDetailUpdate = async () => {
    // ... (Your existing function, which is correct)
    setUpdating(true);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/task/${taskDetail._id}/status`,
        { status: taskStatus, priority: taskPriority, deadline: deadline },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Task details updated successfully");
        await fetchTask(); // Refetch
        setIsUpdatingDetails(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task details.");
    } finally {
      setUpdating(false);
    }
  };

  const handleMilestoneToggle = async (milestoneId, newStatus) => {
    setUpdatingMilestone(true);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/task/${taskDetail._id}/milestone`,
        { milestoneId, completed: newStatus },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Milestone updated!");
        fetchTask();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update milestone.");
    } finally {
      setUpdatingMilestone(false);
    }
  };

  const handleMilestoneAdd = () => {
    if (mileStoneInput.trim()) {
      setMilestones((prev) => [
        ...prev,
        { title: mileStoneInput.trim(), completed: false },
      ]);
      setMileStoneInput("");
    }
  };

  const handleMilestoneDelete = (index) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    if (milestones.length === 0) {
      toast.error("Please add at least one milestone.");
      return;
    }

    setIsSavingMilestones(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/task/${taskDetail._id}/milestone`,
        { milestones },
        { withCredentials: true }
      );

      toast.success("Milestones added successfully!");
      await fetchTask();
      setCreatingMilestone(false);
      setMilestones([]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add milestones.");
    } finally {
      setIsSavingMilestones(false);
    }
  };

  const handleAddComment = async (taskId) => {
    setAddingComment(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comment/${taskId}`,
        { author: user._id, content: comment },
        { withCredentials: true }
      );
      toast.success("Comment added successfully!");
      setComment("");
      await fetchTask();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment.");
    } finally {
      setAddingComment(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "In Progress":
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case "Overdue":
        return <AlertCircleIcon className="h-5 w-5 text-red-600" />;
      case "Pending":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isManagerOrBoss =
    user?.role?.name === "Boss" || user?.role?.name === "Manager";

  const milestoneTargets = useMemo(() => {
    if (!taskDetail?.milestones || taskDetail.milestones.length === 0) {
      return { completeTargetIndex: -1, incompleteTargetIndex: -1 };
    }
    const firstIncompleteIndex = taskDetail.milestones.findIndex(
      (m) => !m.completed
    );
    let incompleteTargetIndex = -1;
    if (firstIncompleteIndex === -1) {
      incompleteTargetIndex = taskDetail.milestones.length - 1;
    } else if (firstIncompleteIndex > 0) {
      incompleteTargetIndex = firstIncompleteIndex - 1;
    }
    return {
      completeTargetIndex: firstIncompleteIndex,
      incompleteTargetIndex: incompleteTargetIndex,
    };
  }, [taskDetail?.milestones]);

  const members = taskDetail?.assignedEmployees ?? [];

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <p>Loading Task Details...</p>
      </div>
    );
  }

  if (!taskDetail) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <p>Task not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
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
                <button
                  onClick={() => navigate("/tasks")}
                  className="ml-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Tasks
                </button>
              </div>
              <div className="flex items-center">
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
                <div className="ml-3 relative">
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
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row space-y-4 items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(taskDetail?.status)}
                      <h1 className="ml-3 text-2xl font-semibold text-gray-900">
                        {taskDetail?.title}
                      </h1>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      {!taskDetail?.team && isManagerOrBoss && (
                        <Dialog
                          open={isAssignTeamDialogOpen}
                          onOpenChange={setIsAssignTeamDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                              Assign Team
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Select a team to complete the task
                              </DialogTitle>
                            </DialogHeader>
                            <div className="p-4">
                              <h3 className="text-sm font-medium text-gray-500 mb-3">
                                Select a Team
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {departmentTeams.map((team) => (
                                  <button
                                    key={team._id}
                                    onClick={() =>
                                      setSelectedTeam(
                                        selectedTeam === team._id
                                          ? null
                                          : team._id
                                      )
                                    }
                                    className={`inline-flex cursor-pointer items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                      selectedTeam === team._id
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                  >
                                    {team.name}
                                  </button>
                                ))}
                              </div>
                              <hr className="my-5" />
                              <Button
                                onClick={handleTeamAssign}
                                disabled={!selectedTeam || isAssigning}
                                className={"w-full"}
                              >
                                {isAssigning ? "Assigning..." : "Assign Team"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {isEditing ? (
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant={"destructive"}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                      )}
                    </div>
                  </div>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        onClick={handleUpdateTitleandDesc}
                        disabled={isSaving}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                      >
                        <SaveIcon className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-700">{taskDetail?.description}</p>
                  )}
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                      {taskDetail?.title} - Milestones
                    </h2>
                    {creatingMilestone ? (
                      <Button
                        onClick={() => setCreatingMilestone(false)}
                        className={"mb-6"}
                        variant={"destructive"}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCreatingMilestone(true)}
                        className={"mb-6"}
                      >
                        <Plus className="mr-2 h-4 w-4" /> MileStone
                      </Button>
                    )}
                  </div>
                  {taskDetail?.milestones &&
                  taskDetail.milestones.length > 0 ? (
                    <div className="overflow-x-auto pt-10 pb-4 px-10">
                      <ol className="flex items-center w-full">
                        {taskDetail.milestones.map((milestone, index) => {
                          const isLastItem =
                            index === taskDetail.milestones.length - 1;
                          const showCompleteButton =
                            isManagerOrBoss &&
                            index === milestoneTargets.completeTargetIndex;
                          const showIncompleteButton =
                            isManagerOrBoss &&
                            index === milestoneTargets.incompleteTargetIndex;
                          const isLineBlue = milestone.completed;

                          return (
                            <li
                              key={milestone._id || index}
                              className={`flex items-center ${
                                !isLastItem ? "flex-1" : "" // The <li> grows, except for the last one
                              }`}
                            >
                              <div className="relative flex flex-col items-center group">
                                <div className="absolute bottom-full mb-3 w-32 text-center">
                                  {showCompleteButton && (
                                    <button
                                      disabled={updatingMilestone}
                                      onClick={() =>
                                        handleMilestoneToggle(
                                          milestone._id,
                                          true
                                        )
                                      }
                                      className="whitespace-nowrap px-2 py-0.5 text-xs rounded-md shadow-sm bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                                    >
                                      Set to Complete
                                    </button>
                                  )}
                                  {showIncompleteButton && (
                                    <button
                                      disabled={updatingMilestone}
                                      onClick={() =>
                                        handleMilestoneToggle(
                                          milestone._id,
                                          false
                                        )
                                      }
                                      className="whitespace-nowrap px-2 py-0.5 text-xs rounded-md shadow-sm bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
                                    >
                                      Set Incomplete
                                    </button>
                                  )}
                                </div>
                                <div
                                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ${
                                    milestone.completed
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-200 text-gray-600"
                                  }`}
                                >
                                  {milestone.completed ? (
                                    <CheckCircleIcon className="w-4 h-4" />
                                  ) : (
                                    <span className="text-xs font-semibold">
                                      {index + 1}
                                    </span>
                                  )}
                                </div>

                                <p className="mt-2 text-xs font-semibold text-gray-700 whitespace-nowrap px-2">
                                  {milestone.title}
                                </p>
                              </div>
                              {!isLastItem && (
                                <div
                                  className={`flex-1 h-0.5 mb-6 ${
                                    isLineBlue ? "bg-blue-600" : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  ) : (
                    !creatingMilestone && (
                      <p className="text-sm text-gray-500">
                        No milestones have been set for this task.
                      </p>
                    )
                  )}
                  {creatingMilestone && (
                    <form onSubmit={handleCreateMilestone}>
                      <div className="w-full h-auto flex flex-col items-start justify-start border p-2 rounded">
                        <label className="text-sm font-medium text-gray-700 mb-2">
                          Add New Milestones
                        </label>
                        <div className="w-full flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Add a milestone step..."
                            className="w-full p-2 border rounded text-sm"
                            value={mileStoneInput}
                            onChange={(e) => setMileStoneInput(e.target.value)}
                          />
                          <Button
                            type="button"
                            onClick={handleMilestoneAdd}
                            disabled={!mileStoneInput?.trim()}
                            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400"
                          >
                            Add
                          </Button>
                        </div>
                        {milestones.length > 0 && (
                          <div className="w-full max-h-44 overflow-y-scroll mt-2 p-1 border-t border-gray-200">
                            {milestones.map((milestone, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 text-sm bg-gray-50 rounded mb-1"
                              >
                                <span className="truncate">
                                  {milestone.title}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="button"
                                  onClick={() => handleMilestoneDelete(index)}
                                  className="text-red-500 hover:bg-red-50 hover:text-red-700 h-6 w-6"
                                >
                                  <MdDeleteForever size={16} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        variant={"secondary"}
                        type="submit"
                        className="mt-4"
                        disabled={isSavingMilestones || milestones.length === 0}
                      >
                        {isSavingMilestones ? "Saving..." : "Save Milestones"}
                      </Button>
                    </form>
                  )}
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Comments
                  </h2>
                  <div className="space-y-4">
                    {taskDetail?.comments.length === 0 ||
                    taskDetail?.comments === null ? (
                      <p className="text-sm text-gray-500">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      taskDetail?.comments.map((comment) => (
                        <div key={comment._id} className="flex space-x-3">
                          <div className="h-10 w-10 rounded-full mb-4 bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                            {getInitials(comment.author?.username)}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-medium text-gray-900">
                                  {comment.author?.username}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(
                                    new Date(comment.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-4">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleAddComment(taskDetail._id)}
                      className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {/* --- Team & Details --- */}
                <div className="bg-white shadow rounded-lg p-6">
                  {/* --- Team Display --- */}
                  <div className="flex flex-col items-center justify-between mb-4 bg-slate-200 py-3 px-1 rounded-md">
                    <h2 className="text-xl text-center font-medium text-blue-600">
                      Team
                    </h2>
                    <div className="font-semibold flex items-center justify-center text-center">
                      {taskDetail.team?.name || ( // Use taskDetail
                        <p className="text-md font-normal text-center">
                          Not Assigned
                        </p>
                      )}
                    </div>
                  </div>

                  {/* --- Details Header --- */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl text-center font-medium text-gray-900">
                      Details
                    </h2>
                    {isManagerOrBoss &&
                      (isUpdatingDetails ? (
                        <Button
                          variant={"destructive"}
                          onClick={() => setIsUpdatingDetails(false)}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button onClick={() => setIsUpdatingDetails(true)}>
                          Update
                        </Button>
                      ))}
                  </div>

                  {/* --- Details Form / Display --- */}
                  {isUpdatingDetails ? (
                    <div className="space-y-4">
                      {/* --- Status Select --- */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          Status
                        </label>
                        <select
                          value={taskStatus}
                          onChange={(e) => setTaskStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                      {/* --- Priority Select --- */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          Priority
                        </label>
                        <select
                          value={taskPriority}
                          onChange={(e) => setTaskPriority(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      {/* --- Deadline Input --- */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={deadline ? deadline.slice(0, 10) : ""}
                          onChange={(e) => setDeadline(e.target.value)}
                          min={minDate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <Button
                          onClick={() => handleTaskDetailUpdate(taskDetail._id)}
                          disabled={updating}
                          className="text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                        >
                          {updating ? "Updating..." : "Update"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* --- Status Display --- */}
                      <div>
                        <h1 className="block text-xs font-medium text-gray-700 mb-2">
                          Status
                        </h1>
                        <p
                          className={`w-full px-3 py-2 rounded-md text-sm font-semibold text-center ${getStatusClasses(
                            taskDetail?.status
                          )}`}
                        >
                          {taskDetail?.status}
                        </p>
                      </div>
                      {/* --- Priority Display --- */}
                      <div>
                        <h1 className="block text-xs font-medium text-gray-700 mb-2">
                          Priority
                        </h1>
                        <p
                          className={`w-full px-3 py-2 rounded-md text-sm font-semibold text-center ${getPriorityClasses(
                            taskDetail?.priority
                          )}`}
                        >
                          {taskDetail?.priority}
                        </p>
                      </div>
                      {/* --- Due Date Display --- */}
                      <div>
                        <h1 className="block text-xs font-medium text-gray-700 mb-2">
                          Due Date
                        </h1>
                        <p
                          className={`w-full px-3 py-2 rounded-md text-sm font-semibold text-center border bg-slate-100`}
                        >
                          {taskDetail?.deadline
                            ? new Date(taskDetail.deadline).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Activity */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-medium text-gray-900">
                      Assignees
                    </h2>
                    <button className="text-blue-600 hover:text-blue-700">
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {members.length > 0 ? (
                      members.map((assignee) => (
                        <div
                          key={assignee._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            {assignee.avatar ? (
                              <img
                                src={assignee.avatar}
                                alt={assignee.username}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                                {getInitials(assignee.username)}
                              </div>
                            )}

                            <span className="ml-3 text-sm text-gray-900">
                              {assignee.username}
                            </span>
                          </div>
                          <button className="text-gray-400 hover:text-red-600">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No team is assigned to task or team don't have any
                        members.
                      </p>
                    )}
                  </div>
                </div>
                {/* Manager */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-medium text-gray-900">
                      Task Manager
                    </h2>
                    <button className="text-blue-600 hover:text-blue-700">
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-0.5 rounded-full text-xs font-medium text-blue-800">
                    <div className="flex items-center">
                      {taskDetail?.assignedManager.avatar ? (
                        <img
                          src={taskDetail?.assignedManager.avatar}
                          alt={taskDetail?.assignedManager.username}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                          {getInitials(taskDetail?.assignedManager.username)}
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <h2 className="ml-3 text-sm text-gray-900">
                          {taskDetail?.assignedManager.username}
                        </h2>
                        <p className="ml-3 text-xs text-gray-500">
                          {taskDetail?.assignedManager.jobTitle}
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-600">
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {/* Activity */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-sm font-medium text-gray-900 mb-4">
                    Activity
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-blue-600 mt-2"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">Task created</p>
                        <p className="text-xs text-gray-500">
                          {task.createdDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-green-600 mt-2"></div>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">
                          Status changed to In Progress
                        </p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
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
