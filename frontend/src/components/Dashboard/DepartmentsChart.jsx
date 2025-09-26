import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

// Define a consistent color palette for departments
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#EF4444', '#3B82F6'];

// CORRECTED Function to transform the data structure for Recharts
const transformDepartmentData = (departmentCounts) => {
  if (!departmentCounts || departmentCounts.length === 0) return [];
  
  // Use 'departmentName' for the name/label and 'employeeCount' for the value
  return departmentCounts.map(item => ({
    name: item.departmentName, // The label for the pie slice
    value: item.employeeCount || 0, // The numerical value for the slice size
  }));
};

const DepartmentsChart = ({ departmentCounts }) => {
  // Use the corrected transformation function
  const data = departmentCounts ? transformDepartmentData(departmentCounts) : [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Employee Distribution by Department
        </h2>
        <div className="flex items-center space-x-2">
          <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option>Total Employees</option>
            <option>Active Employees</option>
          </select>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="40%" // Move to the left to make room for the legend on the right
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              // Correctly display the department name and percentage in the label
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              // Custom formatter to show the department name and employee count on hover
              formatter={(value, name, props) => [`Employees: ${value}`, props.payload.name]}
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle" 
              wrapperStyle={{ right: 0 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentsChart;