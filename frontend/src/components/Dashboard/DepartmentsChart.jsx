import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// Define a consistent color palette for departments
const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#6366F1",
  "#EF4444",
  "#3B82F6",
];

// Function to transform the data structure for Recharts
const transformDepartmentData = (departmentCounts) => {
  if (!departmentCounts || departmentCounts.length === 0) return [];

  return departmentCounts.map((item) => ({
    name: item.departmentName,
    value: item.employeeCount || 0,
  }));
};

const DepartmentsChart = ({ departmentCounts }) => {
  const data = departmentCounts
    ? transformDepartmentData(departmentCounts)
    : [];

  // --- NEW: Calculate Total Employees ---
  const totalEmployees = data.reduce((acc, curr) => acc + curr.value, 0);

  // If there are no employees, display a placeholder
  if (totalEmployees === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Employee Distribution by Department
        </h2>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No employee data available.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <span>Employee Distribution</span>
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800">
            Total: {totalEmployees}
          </span>
        </h2>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `Employees: ${value}`,
                props.payload.name,
              ]}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ padding: "0 10px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentsChart;
