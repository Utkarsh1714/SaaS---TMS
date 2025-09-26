import React from 'react'
import {
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  ListIcon,
} from 'lucide-react'

// Helper component for stat cards - keep as provided in the new structure
const StatCard = ({ title, value, change, trend, icon, bgColor }) => {
    // Simplified StatCard to just show data, removed the change/trend logic for simplicity as it relies on external data.
    return (
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
                    <div className="text-2xl font-semibold text-gray-900">{value}</div>
                </dd>
                </dl>
            </div>
            </div>
        </div>
        </div>
    )
}

const TaskStats = ({ tasks }) => {
    // Calculating basic stats from the tasks array (Assuming a simple structure for now)
    const totalTasks = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const overdue = tasks.filter(t => t.status === 'Overdue').length;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Tasks"
        value={totalTasks}
        icon={<ListIcon className="h-6 w-6 text-blue-600" />}
        bgColor="bg-blue-50"
      />
      <StatCard
        title="In Progress"
        value={inProgress}
        icon={<ClockIcon className="h-6 w-6 text-yellow-600" />}
        bgColor="bg-yellow-50"
      />
      <StatCard
        title="Completed"
        value={completed}
        icon={<CheckCircleIcon className="h-6 w-6 text-green-600" />}
        bgColor="bg-green-50"
      />
      <StatCard
        title="Overdue"
        value={overdue}
        icon={<AlertCircleIcon className="h-6 w-6 text-red-600" />}
        bgColor="bg-red-50"
      />
    </div>
  )
}
export default TaskStats