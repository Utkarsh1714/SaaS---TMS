// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const UpcomingDeadline = () => {
//   const [task, setTask] = useState([]);
//   const upcomingDeadlines = async () => {
//     const res = await axios.get(
//       `${import.meta.env.VITE_API_URL}/api/dashboard/overview-data3`,
//       { withCredentials: true }
//     );
//     console.log(res.data);
//     setTask(res.data);
//   };

//   useEffect(() => {
//     upcomingDeadlines();
//   }, []);
//   return (
//     <div className="w-full h-full">
//       {task.length < 0 ? (
//         <div className="w-full h-full flex flex-col items-center justify-center">
//           <h1>There are no pending task</h1>
//         </div>
//       ) : (
//         <div className="w-full">
//           <h1 className="text-2xl font-semibold mb-4">Upcoming Deadlines</h1>
//           <div className="">
//             <table className="table">
//               <thead>
//                 <tr className="border-b">
//                   <th className="border-r">Task Name</th>
//                   <th className="border-r">Assigned To</th>
//                   <th className="border-r">Deadline</th>
//                   <th className="">Status</th>
//                 </tr>
//               </thead>
//               <div className="overflow-y-scroll max-h-[300px] w-full">
//                 <tbody>
//                   {task.map((item) => (
//                     <tr key={item._id}>
//                       <td>{item.title}</td>
//                       <td>{item.assignedManager?.username}</td>
//                       <td>{new Date(item.deadline).toLocaleDateString()}</td>
//                       <td>
//                         <span
//                           className={`badge ${
//                             item.status === "Completed"
//                               ? "badge-success"
//                               : "badge-warning"
//                           } px-1.5`}
//                         >
//                           {item.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </div>
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

const UpcomingDeadline = () => {
  const [task, setTask] = useState([]);
  
  const upcomingDeadlines = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/dashboard/overview-data3`,
        { withCredentials: true }
      );
      setTask(res.data);
    } catch (error) {
      console.error("Failed to fetch upcoming deadlines:", error);
    }
  };

  useEffect(() => {
    upcomingDeadlines();
  }, []);
  
  const hasTasks = task.length > 0;

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-semibold mb-4">Upcoming Deadlines</h1>
      
      {!hasTasks ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500">There are no pending tasks.</p>
        </div>
      ) : (
        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <div className="max-h-[350px] overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="border-b sticky top-0 bg-gray-50 dark:bg-gray-700">
                  <th scope="col" className="py-3 px-6">Task Name</th>
                  <th scope="col" className="py-3 px-6">Assigned To</th>
                  <th scope="col" className="py-3 px-6">Deadline</th>
                  <th scope="col" className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {task.map((item) => (
                  <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item.title}
                    </td>
                    <td className="py-4 px-6">{item.assignedManager?.username}</td>
                    <td className="py-4 px-6">{new Date(item.deadline).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`badge ${item.status === "Completed" ? "badge-success" : "badge-warning"} px-1.5`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingDeadline;