// import React, { useMemo, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// // Helper function to map month number to short name
// const getMonthName = (monthNumber) => {
//   const date = new Date(2000, monthNumber - 1, 1);
//   return date.toLocaleString("en-US", { month: "short" });
// };

// // Component now accepts monthlyTaskCompletion as a prop
// const TasksChart = ({ monthlyTaskCompletion }) => {
//   const [filter, setFilter] = useState("This year");

//   const displayData = useMemo(() => {
//     // A. structure the incoming data into a structured Recharts needs
//     const transformedData = monthlyTaskCompletion.map((item) => ({
//       name: getMonthName(item.month),
//       month: item.month,
//       completed: item.Completed,
//       active: item.Active,
//       pending: item.Pending,
//     }));

//     // Find the current month number
//     const currentMonth = new Date().getMonth() + 1;

//     if (filter === "This year" || filter === "Last 12 months") {
//       return transformedData;
//     } else if (filter === "Last 6 months") {
//       const sortedData = [...transformedData].sort((a, b) => a.month - b.month);
//       return sortedData.slice(-6);
//     }

//     return transformedData;
//   }, [monthlyTaskCompletion, filter]);

//   const handleFilterChange = (e) => {
//     setFilter(e.target.value);
//   };
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-medium text-gray-900">Task Completion</h2>
//         <div className="flex items-center space-x-2">
//           <select
//             className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//             value={filter}
//             onChange={handleFilterChange}
//           >
//             <option>Last 12 months</option>
//             <option>Last 6 months</option>
//             <option>This year</option>
//           </select>
//         </div>
//       </div>
//       <div className="h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             // Use the dynamically generated chartData
//             data={displayData}
//             margin={{
//               top: 20,
//               right: 30,
//               left: 0,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" vertical={false} />
//             {/* dataKey is now 'name' from the transformed data */}
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             {/* dataKey properties match the keys in the transformed data */}
//             <Bar
//               dataKey="completed"
//               name="Completed"
//               stackId="a"
//               fill="#4F46E5"
//             />
//             <Bar dataKey="active" name="Active" stackId="a" fill="#10B981" />
//             <Bar dataKey="pending" name="Pending" stackId="a" fill="#EF4444" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default TasksChart;



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
import { Filter } from "lucide-react";

// Helper function
const getMonthName = (monthNumber) => {
  const date = new Date(2000, monthNumber - 1, 1);
  return date.toLocaleString("en-US", { month: "short" });
};

const TasksChart = ({ monthlyTaskCompletion }) => {
  const [filter, setFilter] = useState("This year");

  const displayData = useMemo(() => {
    const transformedData = monthlyTaskCompletion.map((item) => ({
      name: getMonthName(item.month),
      month: item.month,
      Completed: item.Completed, // Capitalized to match legend
      Active: item.Active,
      Pending: item.Pending,
    }));

    if (filter === "Last 6 months") {
      return [...transformedData].sort((a, b) => a.month - b.month).slice(-6);
    }
    return transformedData;
  }, [monthlyTaskCompletion, filter]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-lg font-bold text-slate-900">Task Analytics</h2>
           <p className="text-sm text-slate-500">Completion overview over time</p>
        </div>
        
        <div className="relative">
           <select
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8 cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>This year</option>
            <option>Last 6 months</option>
            <option>Last 12 months</option>
          </select>
          <Filter className="absolute right-2.5 top-3 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748B', fontSize: 12}} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748B', fontSize: 12}} 
            />
            <Tooltip 
                cursor={{fill: '#F1F5F9'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
            />
            <Legend wrapperStyle={{paddingTop: '20px'}} iconType="circle" />
            <Bar dataKey="Completed" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} maxBarSize={50}/>
            <Bar dataKey="Active" stackId="a" fill="#10B981" />
            <Bar dataKey="Pending" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TasksChart;