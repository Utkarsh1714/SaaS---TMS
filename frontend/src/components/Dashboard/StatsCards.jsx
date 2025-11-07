import React from "react";
import {
  UsersIcon,
  ClipboardCheckIcon,
  Clock, // Used for Active Employee (from original Home.jsx)
  AlertCircleIcon,
  ChartNoAxesCombined, // Used for Average Completion (from original Home.jsx)
  LayoutList,
} from "lucide-react";
import { Link } from "react-router-dom";

// Reusable Stat Card Component (kept as is)
const StatCard = ({ title, value, icon, bgColor, subTitle, link }) => {
  return (
    <Link to={`/${link}`}>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-md ${bgColor}`}>
              {icon}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {title}
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {value || 0}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        {subTitle && (
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm text-gray-500 truncate">{subTitle}</div>
          </div>
        )}
      </div>
    </Link>
  );
};

// Main StatsCards Component (Updated to use dynamic props)
const StatsCards = ({
  taskCount,
  activeUser,
  overdueTaskCount,
  averageCompletionDays,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Tasks"
        value={taskCount}
        icon={<LayoutList className="h-6 w-6 text-blue-600" />}
        bgColor="bg-blue-50"
        subTitle="Total tasks in the system"
        link="tasks"
      />
      <StatCard
        title="Active Employee"
        value={activeUser}
        icon={<Clock className="h-6 w-6 text-green-600" />}
        bgColor="bg-green-50"
        subTitle="Are online now (or active sessions)"
        link="employees"
      />
      <StatCard
        title="Overdue Tasks"
        value={overdueTaskCount}
        icon={<AlertCircleIcon className="h-6 w-6 text-red-600" />}
        bgColor="bg-red-50"
        subTitle="Tasks past their deadline"
        link="tasks"
      />
      <StatCard
        title="Avg Completion (Days)"
        value={averageCompletionDays ? averageCompletionDays.toFixed(1) : 0}
        icon={<ChartNoAxesCombined className="h-6 w-6 text-indigo-600" />}
        bgColor="bg-indigo-50"
        subTitle="Avg time to complete a task"
        link="dashboard"
      />
    </div>
  );
};

export default StatsCards;
