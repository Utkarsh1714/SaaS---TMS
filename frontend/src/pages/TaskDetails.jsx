import NotificationPanel from "@/components/Dashboard/NotificationPanel";
import Sidebar from "@/components/Layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import axios from "axios";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellDot,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  Pencil,
  PlusIcon,
  SaveIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const TaskDetails = () => {
  const { user } = useAuth();
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { addNotification, toggleNotificationPanel, notifications } =
    useNotifications();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAssignTeamDialogOpen, setIsAssignTeamDialogOpen] = useState(false);
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [taskDetail, setTaskDetail] = useState(null);
  const [departmentTeams, setDepartmentTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [taskStatus, setTaskStatus] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [deadline, setDeadline] = useState("");
  const [teamName, setTeamName] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Mock task data - in a real app, this would come from an API
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

  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task/${taskId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setTaskDetail(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setDepartmentTeams(res.data.department.teams);
      setTaskStatus(res.data.status);
      setTaskPriority(res.data.priority);
      setDeadline(res.data.deadline);
      setTeamName(res.data.team?.name);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTitleandDesc = async (taskId) => {
    setIsSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/task/${taskId}`,
        { title, description },
        {
          withCredentials: true,
        }
      );
      toast.success("Task updated successfully!");
      await fetchTask();
      setIsSaving(false);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTeamAssign = async (id) => {
    setIsAssigning(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/task/${id}/assign-team`,
        { teamId: selectedTeam },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Team assigned to task successfully");
        setIsAssignTeamDialogOpen(false); // ✅ THIS CLOSES THE DIALOG
        setSelectedTeam(null);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to assign team.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleTaskDetailUpdate = async (id) => {
    setUpdating(true);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/task/${id}/status`,
        { status: taskStatus, priority: taskPriority, deadline: deadline },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Task details updated successfully");
        await fetchTask();
        setUpdating(false);
        setIsUpdatingDetails(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task details.");
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setTask({
      ...task,
      status: newStatus,
    });
  };
  const handlePriorityChange = (newPriority) => {
    setTask({
      ...task,
      priority: newPriority,
    });
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "In Progress":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case "Overdue":
        return <AlertCircleIcon className="h-5 w-5 text-red-600" />;
      case "Pending":
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
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

  useEffect(() => {
    fetchTask();
  }, [taskId, teamName]);
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
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Task Header */}
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col md:flex-row space-y-4 items-start justify-between mb-4">
                      <div className="flex items-center">
                        {getStatusIcon(taskDetail?.status)}
                        <h1 className="ml-3 text-2xl font-semibold text-gray-900">
                          {taskDetail?.title}
                        </h1>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        {!taskDetail?.team
                          ? (user.role.name === "Boss" ||
                              user.role.name === "Manager") && (
                              <Dialog
                                open={isAssignTeamDialogOpen}
                                onOpenChange={setIsAssignTeamDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    onClick={() => setIsEditing(false)}
                                    className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                  >
                                    Assign Team
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Select a team to complete the task
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="bg-white shadow rounded-lg p-4">
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
                                          className={`
                                                inline-flex cursor-pointer items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                                                ${
                                                  selectedTeam === team._id
                                                    ? "bg-blue-600 text-white shadow-sm"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }
                                        `}
                                        >
                                          {team.name}
                                        </button>
                                      ))}
                                    </div>
                                    <hr className="my-5" />
                                    <Button
                                      onClick={() =>
                                        handleTeamAssign(taskDetail._id)
                                      }
                                      disabled={!selectedTeam}
                                      className={"w-full"}
                                    >
                                      {isAssigning
                                        ? "Assigning..."
                                        : "Assign Team"}
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )
                          : ""}

                        {isEditing ? (
                          <Button
                            onClick={() => setIsEditing(false)}
                            variant={"destructive"}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button onClick={() => setIsEditing(true)}>
                            <Pencil size={20} color="white" />
                          </Button>
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
                          onClick={() =>
                            handleUpdateTitleandDesc(taskDetail._id)
                          }
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <SaveIcon className="h-4 w-4 mr-2" />
                          {!isSaving ? "Save Changes" : "Saving..."}
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700">
                          {taskDetail?.description}
                        </p>
                        <p className="text-gray-700">display milestone here</p>
                      </>
                    )}
                  </div>
                )}

                {/* Comments Section */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Comments
                  </h2>
                  <div className="space-y-4">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-medium text-gray-900">
                                {comment.author}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <textarea
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status & Priority */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex flex-col items-center justify-between mb-4 bg-slate-200 py-3 rounded-md">
                    <h2 className="text-xl text-center font-medium text-blue-600">
                      Team
                    </h2>
                    <p className="font-semibold">
                      {teamName || (
                        <span className="text-md font-normal">
                          Not Assigned
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl text-center font-medium text-gray-900">
                      Details
                    </h2>
                    {(user.role.name === "Boss" ||
                      user.role.name === "Manager") &&
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
                  {isUpdatingDetails ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          Status
                        </label>
                        <select
                          value={taskStatus}
                          onChange={(e) => setTaskStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          Priority
                        </label>
                        <select
                          value={taskPriority}
                          onChange={(e) => setTaskPriority(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
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
                      {isUpdatingDetails && (
                        <div className="flex items-center justify-center">
                          <Button
                            onClick={() =>
                              handleTaskDetailUpdate(taskDetail._id)
                            }
                            className="text-white bg-blue-600 hover:bg-blue-700"
                          >
                            {updating ? "Updating..." : "Update"}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
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
                      <div>
                        <h1 className="block text-xs font-medium text-gray-700 mb-2">
                          Priority
                        </h1>
                        <p
                          className={`w-full px-3 py-2 rounded-md text-sm font-semibold text-center ${getPriorityClasses(
                            taskDetail?.priority
                          )}`}
                        >
                          {taskDetail?.priority} Priority
                        </p>
                      </div>
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
                {/* Assignees */}
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
                    {task.assignees.map((assignee) => (
                      <div
                        key={assignee.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="ml-3 text-sm text-gray-900">
                            {assignee.name}
                          </span>
                        </div>
                        <button className="text-gray-400 hover:text-red-600">
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Tags */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-medium text-gray-900">Tags</h2>
                    <button className="text-blue-600 hover:text-blue-700">
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button className="ml-1 text-blue-600 hover:text-blue-800">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
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
