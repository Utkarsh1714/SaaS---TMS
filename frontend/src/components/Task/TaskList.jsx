import React from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Trash2,
  Calendar,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const TaskList = ({ tasks, loading, handleDeleteTask, user, navigate }) => {
  console.log(tasks);
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-slate-300" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No tasks found</h3>
        <p className="text-slate-500">
          Try adjusting your filters or create a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <tr
                key={task._id}
                className="group hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="cursor-pointer"
                  >
                    <div className="font-semibold text-slate-900">
                      {task.title}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {task.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {task.assignedManager?.profileImage ? (
                      <div className="rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                        <a href={task.assignedManager?.profileImage} target="_blank" className="h-8 w-8 rounded-full">
                          <img
                            src={task.assignedManager?.profileImage}
                            alt={task.assignedManager?.firstName}
                            className="rounded-full w-full h-full object-cover"
                          />
                        </a>
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                        {task.assignedManager?.firstName?.[0]}
                      </div>
                    )}

                    <span className="text-sm text-slate-600">
                      {task.assignedManager?.firstName}{" "}
                      {task.assignedManager?.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {user.role.name === "Boss" && (
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className="p-2 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Badges
const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-emerald-100 text-emerald-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Pending: "bg-slate-100 text-slate-600",
    Overdue: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
        styles[status] || styles["Pending"]
      }`}
    >
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    High: "text-rose-600 bg-rose-50 border-rose-100",
    Medium: "text-amber-600 bg-amber-50 border-amber-100",
    Low: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
};

export default TaskList;
