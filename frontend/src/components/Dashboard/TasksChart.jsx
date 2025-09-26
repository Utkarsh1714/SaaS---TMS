// import React from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// // Function to transform the flat priority object into Recharts data array
// const transformPriorityData = (priorityCount) => {
//   // Map the object to an array of { name: "Priority", count: value } objects
//   return Object.keys(priorityCount).map(key => ({
//     name: key,
//     count: priorityCount[key]
//   }));
// };

// const TasksChart = ({ taskPriorityCount }) => {
//     console.log("Task Priority Count:", taskPriorityCount); // Debug log
//   // Transform the fetched data
//   const data = taskPriorityCount ? transformPriorityData(taskPriorityCount) : [];

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-medium text-gray-900">Task Priority Distribution</h2>
//         <div className="flex items-center space-x-2">
//           {/* Kept dropdown for context, though it's now static */}
//           <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
//             <option>All Tasks</option>
//             <option>Last 30 Days</option>
//             <option>This Quarter</option>
//           </select>
//         </div>
//       </div>
//       <div className="h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             data={data}
//             margin={{
//               top: 20,
//               right: 30,
//               left: 0,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar
//               dataKey="count"
//               name="Tasks by Priority"
//               fill="#4F46E5"
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default TasksChart;

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Helper function to map month number to short name
const getMonthName = (monthNumber) => {
  const date = new Date(2000, monthNumber - 1, 1);
  return date.toLocaleString('en-US', { month: 'short' });
};

// Component now accepts monthlyTaskCompletion as a prop
const TasksChart = ({ monthlyTaskCompletion }) => {
  
  // Transform the data structure for Recharts
  const chartData = monthlyTaskCompletion.map(item => ({
    // Convert month number (1-12) to short month name (Jan, Feb, etc.)
    name: getMonthName(item.month), 
    completed: item.Completed,
    active: item.Active,
    overdue: item.Overdue,
  }));
  
  const displayData = chartData; 

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Task Completion</h2>
        <div className="flex items-center space-x-2">
          {/* NOTE: You should implement actual state/logic to filter the data here */}
          <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option>Last 12 months</option> {/* Updated to reflect the fetched data */}
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