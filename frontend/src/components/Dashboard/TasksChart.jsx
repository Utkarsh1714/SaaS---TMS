import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Helper function to map month number to short name
const getMonthName = (monthNumber) => {
  const date = new Date(2000, monthNumber - 1, 1);
  return date.toLocaleString("en-US", { month: "short" });
};

// Component now accepts monthlyTaskCompletion as a prop
const TasksChart = ({ monthlyTaskCompletion }) => {
  const [filter, setFilter] = useState("This year");

  const displayData = useMemo(() => {
    // A. structure the incoming data into a structured Recharts needs
    const transformedData = monthlyTaskCompletion.map((item) => ({
      name: getMonthName(item.month),
      month: item.month,
      completed: item.Completed,
      active: item.Active,
      overdue: item.Overdue,
    }));

    // Find the current month number
    const currentMonth = new Date().getMonth() + 1;

    if (filter === "This year" || filter === "Last 12 months") {
      return transformedData;
    } else if (filter === "Last 6 months") {
      const sortedData = [...transformedData].sort((a, b) => a.month - b.month);
      return sortedData.slice(-6);
    }

    return transformedData;
  }, [monthlyTaskCompletion, filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Task Completion</h2>
        <div className="flex items-center space-x-2">
          <select
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={filter}
            onChange={handleFilterChange}
          >
            <option>Last 12 months</option>
            <option>Last 6 months</option>
            <option>This year</option>
          </select>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            // Use the dynamically generated chartData
            data={displayData}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            {/* dataKey is now 'name' from the transformed data */}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* dataKey properties match the keys in the transformed data */}
            <Bar
              dataKey="completed"
              name="Completed"
              stackId="a"
              fill="#4F46E5"
            />
            <Bar dataKey="active" name="Active" stackId="a" fill="#10B981" />
            <Bar dataKey="overdue" name="Overdue" stackId="a" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TasksChart;
