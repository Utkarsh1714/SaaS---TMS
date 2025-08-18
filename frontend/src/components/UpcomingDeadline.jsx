import axios from "axios";
import React, { useEffect, useState } from "react";

const UpcomingDeadline = () => {
  const [task, setTask] = useState([]);
  const upcomingDeadlines = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/dashboard/overview-data3`,
      { withCredentials: true }
    );
    setTask(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    upcomingDeadlines();
  }, []);
  return (
    <div className="w-full h-full">
      {task.length < 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1>There are no pending task</h1>
        </div>
      ) : (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Upcoming Deadlines</h1>
            <div className="">
              <table className="table">
                <thead>
                    <tr className="border-b">
                        <th className="border-r">Task Name</th>
                        <th className="border-r">Assigned To</th>
                        <th className="border-r">Deadline</th>
                        <th className="">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {task.map((item) => (
                        <tr key={item._id}>
                            <td>{item.title}</td>
                            <td>{item.assignedManager?.username}</td>
                            <td>{new Date(item.deadline).toLocaleDateString()}</td>
                            <td>
                                <span className={`badge ${item.status === "Completed" ? "badge-success" : "badge-warning"} px-1.5`}>
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
