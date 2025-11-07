import Sidebar from "@/components/Layout/Sidebar";
import axios from "axios";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  SaveIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  const fetchTask = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/task/getTask`,
      {
        withCredentials: true,
      }
    );

    console.log(res.data);
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
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case "overdue":
        return <AlertCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);
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
                <button className="flex-shrink-0 p-1 mr-4 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
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
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Task Header */}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(task.status)}
                      <h1 className="ml-3 text-2xl font-semibold text-gray-900">
                        {task.title}
                      </h1>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                  </div>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) =>
                            setTask({
                              ...task,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={task.description}
                          onChange={(e) =>
                            setTask({
                              ...task,
                              description: e.target.value,
                            })
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <SaveIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-700">{task.description}</p>
                  )}
                </div>
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
                  <h2 className="text-sm font-medium text-gray-900 mb-4">
                    Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Status
                      </label>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Priority
                      </label>
                      <select
                        value={task.priority}
                        onChange={(e) => handlePriorityChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={task.dueDate}
                        onChange={(e) =>
                          setTask({
                            ...task,
                            dueDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
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
    </div>
  );
};

export default TaskDetails;
