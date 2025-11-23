// import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Legend,
//   Tooltip,
// } from "recharts";

// // Define a consistent color palette for departments
// const COLORS = [
//   "#4F46E5",
//   "#10B981",
//   "#F59E0B",
//   "#EC4899",
//   "#6366F1",
//   "#EF4444",
//   "#3B82F6",
// ];

// // Function to transform the data structure for Recharts
// const transformDepartmentData = (departmentCounts) => {
//   if (!departmentCounts || departmentCounts.length === 0) return [];

//   return departmentCounts.map((item) => ({
//     name: item.departmentName,
//     value: item.employeeCount || 0,
//   }));
// };

// const DepartmentsChart = ({ departmentCounts }) => {
//   const data = departmentCounts
//     ? transformDepartmentData(departmentCounts)
//     : [];

//   // --- NEW: Calculate Total Employees ---
//   const totalEmployees = data.reduce((acc, curr) => acc + curr.value, 0);

//   // If there are no employees, display a placeholder
//   if (totalEmployees === 0) {
//     return (
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-lg font-medium text-gray-900 mb-4">
//           Employee Distribution by Department
//         </h2>
//         <div className="h-80 flex items-center justify-center text-gray-500">
//           No employee data available.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-medium text-gray-900 flex items-center space-x-1">
//           <span>Employee Distribution</span>
//           <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 md:px-5 py-0.5 text-sm font-medium text-indigo-800">
//             Total: {totalEmployees}
//           </span>
//         </h2>
//       </div>
//       <div className="h-100 xl:h-120">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               outerRadius={100}
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip
//               formatter={(value, name, props) => [
//                 `Employees: ${value}`,
//                 props.payload.name,
//               ]}
//             />
//             <Legend
//               layout="horizontal"
//               align="center"
//               verticalAlign="bottom"
//               wrapperStyle={{ padding: "0 10px" }}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default DepartmentsChart;


import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Users } from "lucide-react";

const COLORS = [
  "#3B82F6", // Blue-500
  "#10B981", // Emerald-500
  "#F59E0B", // Amber-500
  "#EC4899", // Pink-500
  "#6366F1", // Indigo-500
  "#EF4444", // Red-500
];

const transformDepartmentData = (departmentCounts) => {
  if (!departmentCounts || departmentCounts.length === 0) return [];
  return departmentCounts.map((item) => ({
    name: item.departmentName,
    value: item.employeeCount || 0,
  }));
};

const DepartmentsChart = ({ departmentCounts }) => {
  const data = departmentCounts ? transformDepartmentData(departmentCounts) : [];
  const totalEmployees = data.reduce((acc, curr) => acc + curr.value, 0);

  if (totalEmployees === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Users className="text-slate-300" size={32} />
        </div>
        <h3 className="text-slate-900 font-semibold">No Data Available</h3>
        <p className="text-slate-500 text-sm mt-1">Add employees to see department distribution.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[400px] flex flex-col relative">
      <div className="flex justify-between items-start mb-2">
        <div>
           <h2 className="text-lg font-bold text-slate-900">Department Split</h2>
           <p className="text-sm text-slate-500">Employee distribution by team</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}  // Makes it a Donut
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={6} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
               itemStyle={{color: '#1E293B', fontWeight: 600}}
            />
            <Legend 
               verticalAlign="bottom" 
               height={36} 
               iconType="circle" 
               iconSize={8}
               wrapperStyle={{ fontSize: '12px', color: '#64748B' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Centered Text inside Donut */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
           <span className="block text-3xl font-extrabold text-slate-900">{totalEmployees}</span>
           <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Employees</span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsChart;