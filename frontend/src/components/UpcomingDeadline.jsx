// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const UpcomingDeadline = () => {
//   const [task, setTask] = useState([]);

//   const upcomingDeadlines = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/dashboard/overview-data3`,
//         { withCredentials: true }
//       );
//       setTask(res.data);
//     } catch (error) {
//       console.error("Failed to fetch upcoming deadlines:", error);
//     }
//   };

//   useEffect(() => {
//     upcomingDeadlines();
//   }, []);

//   const hasTasks = task.length > 0;

//   return (
//     <div className="w-full max-h-[400px] overflow-hidden">
//       <h1 className="text-2xl font-semibold mb-4">Upcoming Deadlines</h1>

//       {!hasTasks ? (
//         <div className="w-full h-full flex items-center justify-center">
//           <p className="text-gray-500">There are no pending tasks.</p>
//         </div>
//       ) : (
//         <div className="relative overflow-x-auto shadow-md rounded-lg">
//           <div className="max-h-[350px] overflow-y-auto">
//             <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//               <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//                 <tr className="border-b sticky top-0 bg-gray-50 dark:bg-gray-700">
//                   <th scope="col" className="py-3 px-6">
//                     Task Name
//                   </th>
//                   <th scope="col" className="py-3 px-6">
//                     Assigned To
//                   </th>
//                   <th scope="col" className="py-3 px-6">
//                     Deadline
//                   </th>
//                   <th scope="col" className="py-3 px-6">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="overflow-y-scroll">
//                 {task.map((item) => (
//                   <tr
//                     key={item._id}
//                     className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
//                   >
//                     <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                       {item.title}
//                     </td>
//                     <td className="py-4 px-6">
//                       {item.assignedManager?.username}
//                     </td>
//                     <td className="py-4 px-6">
//                       {new Date(item.deadline).toLocaleDateString()}
//                     </td>
//                     <td className="py-4 px-6">
//                       <span
//                         className={`badge ${
//                           item.status === "Completed"
//                             ? "badge-success"
//                             : "badge-warning"
//                         } px-3`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingDeadline;




import axios from "axios";
import React, { useEffect, useState } from "react";
import { Clock, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const UpcomingDeadline = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const upcomingDeadlines = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard/overview-data3`,
          { withCredentials: true }
        );
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to fetch deadlines:", error);
      }
    };
    upcomingDeadlines();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="text-rose-500" size={20} />
          Upcoming Deadlines
        </h2>
        <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded-md">
           {tasks.length} Pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px] scrollbar-thin">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
             <CheckCircle2 size={32} className="mb-2 text-emerald-400 opacity-50" />
             <p className="text-sm">All caught up!</p>
          </div>
        ) : (
          tasks.map((item) => (
            <div key={item._id} className="group p-4 rounded-xl bg-white border border-slate-100 hover:border-rose-200 hover:shadow-sm transition-all relative overflow-hidden">
               <Link to={`/tasks/${item._id}`}>
               {/* Progress Bar Hint */}
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-xl"></div>
               
               <div className="flex justify-between items-start mb-2 pl-2">
                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                      item.priority === 'High' 
                      ? 'bg-rose-50 text-rose-700 border-rose-100' 
                      : 'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                      {item.priority || 'Normal'}
                  </span>
               </div>

               <div className="flex items-center justify-between pl-2 mt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                     <Calendar size={12} />
                     {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-400 mr-1">Assigned to:</span>
                     <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200" title={item.assignedManager?.username}>
                        {item.assignedManager?.username?.charAt(0) || "?"}
                     </div>
                  </div>
               </div>
               </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadline;