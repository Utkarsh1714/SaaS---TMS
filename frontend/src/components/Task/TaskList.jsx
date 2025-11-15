import React from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  TagIcon,
  MoreHorizontalIcon,
  CalendarIcon,
  Trash2, // Using Trash2 from lucide-react for delete icon
} from "lucide-react";
import AddEmpToTaskBtn from "@/components/AddEmpToTaskBtn";
import { Button } from "@/components/ui/button";

const DESCRIPTION_CHAR_LIMIT = 15;
const TITLE_CHAR_LIMIT = 10;

// Helper to get status icon based on the full status string
const getStatusIcon = (status) => {
  const s = status.toLowerCase();
  if (s === "completed") {
    return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
  } else if (s === "in progress" || s === "pending") {
    return <ClockIcon className="h-5 w-5 text-yellow-600" />;
  } else if (s === "overdue") {
    return <AlertCircleIcon className="h-5 w-5 text-red-600" />;
  }
  return <ClockIcon className="h-5 w-5 text-gray-600" />;
};

// Helper to get priority class
const getPriorityClass = (priority) => {
  switch (priority) {
    case "High":
    case "Urgent":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const TaskItem = ({ task, userRole, userId, navigate, handleDeleteTask }) => {
  const isDescriptionLong = task.description.length > DESCRIPTION_CHAR_LIMIT;

  const displayDescription = isDescriptionLong
    ? task.description.substring(0, DESCRIPTION_CHAR_LIMIT) + "..."
    : task.description;

  const displayTitle =
    task.title.length > TITLE_CHAR_LIMIT
      ? task.title.substring(0, TITLE_CHAR_LIMIT) + "..."
      : task.title;

  const assigneeName = task.assignedManager?.username || "Unassigned";

  return (
    <div className="p-4 hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* Status Icon & Title/Description */}
          <div className="pt-1">{getStatusIcon(task.status)}</div>
          <div className="flex-1">
            <h3
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => navigate(`/tasks/${task._id}`)}
            >
              {displayTitle}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {displayDescription}
              {isDescriptionLong && (
                <span
                  onClick={() => navigate(`/tasks/${task._id}`)}
                  className="text-blue-500 cursor-pointer ml-1 font-normal hover:underline"
                >
                  view
                </span>
              )}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800`}
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {task.department?.name || "No Dept"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end min-w-[150px]">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(
              task.priority
            )}`}
          >
            {task.priority} Priority
          </span>

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <p>{task.deadline?.slice(0, 10)}</p>
          </div>

          <p className="text-xs text-gray-600 mt-1">
            Assigned:{" "}
            <span className="font-medium text-gray-800">{assigneeName}</span>
          </p>

          <div className="mt-3 flex space-x-2">
            {userRole === "Manager" && task.assignedManager?._id === userId && (
              <AddEmpToTaskBtn
                taskId={task._id}
                taskData={[]}
                className="text-xs p-1"
              />
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
              onClick={() => handleDeleteTask(task._id)}
              disabled={userRole !== "Boss"} // Assuming only Boss can delete
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              onClick={() => navigate(`/tasks/${task._id}`)}
            >
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskList = ({
  tasks,
  loading,
  getNoTasksMessage,
  navigate,
  handleDeleteTask,
  user,
}) => {
  console.log(tasks);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 gap-3 bg-white shadow rounded-lg">
        <p className="text-lg">Loading task data</p>
        <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="py-12 px-5 text-center">
          <p className="text-gray-500">{getNoTasksMessage()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Tasks ({tasks.length})
          </h2>
          {/* Simplified Sorting - can be expanded later */}
          <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option>Sort by: Priority</option>
            <option>Sort by: Newest</option>
            <option>Sort by: Deadline</option>
          </select>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            userRole={user.role.name}
            userId={user._id}
            navigate={navigate}
            handleDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
