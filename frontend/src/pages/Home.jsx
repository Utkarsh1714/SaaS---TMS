import BarChart from "@/components/BarChart";
import DepartmentsEmpChart from "@/components/DepartmentsEmpChart";
import MonthlyTrendChart from "@/components/MonthlyTrendChart";
import TaskStatusChart from "@/components/TaskStatusChart";
import UpcomingDeadline from "@/components/UpcomingDeadline";
import axios from "axios";
import { ChartNoAxesCombined, Clock, LayoutList, Loader } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

const Home = () => {
  const [data, setData] = useState({});
  const [taskPriorityCount, setTaskPriorityCount] = useState({});
  const [taskStatusCount, setTaskStatusCount] = useState({});
  const [departmentCount, setDepartmentCount] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dashboard/overview-data1`,
          { withCredentials: true }
        );
        console.log(res.data);
        // Set the state with the fetched data
        setData(res.data);
        setTaskPriorityCount(res.data.taskPriorityCount);
        setDepartmentCount(res.data.departmentCount);
        setTaskStatusCount(res.data.taskStatusCount);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched or an error occurs
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full py-5 px-5 sm:px-2 space-y-6">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-10">
        <div className="w-full bg-gray-400/10 rounded-xl grid grid-cols-1 sm:grid-cols-2 items-center justify-between gap-5 p-12">
          <div className="w-full stats shadow-md bg-amber-100">
            <div className="stat">
              <div className="stat-title text-xl">Total Task</div>
              <div className="flex items-start justify-start gap-2">
                <h1 className="stat-value">{data.taskCount}</h1>
                <LayoutList className="text-blue-400 mt-3" />
              </div>
            </div>
          </div>

          <div className="w-full stats shadow-md bg-amber-100">
            <div className="stat">
              <div className="stat-title text-xl">Active Employee</div>
              <div className="flex items-start justify-start gap-2">
                <h1 className="stat-value">{data.activeUser}</h1>
                <Clock className="text-red-400 mt-3" />
              </div>
              <div className="stat-desc">Are online now</div>
            </div>
          </div>

          <div className="w-full stats shadow-md bg-amber-100">
            <div className="stat">
              <div className="stat-title text-xl">Overdue Task</div>
              <div className="flex items-start justify-start gap-2">
                <h1 className="stat-value">{data.overdueTaskCount}</h1>
                <Loader className={"text-yellow-400 mt-3"} />
              </div>
              <div className="stat-title text-sm">Task per deadline</div>
            </div>
          </div>

          <div className="w-full stats shadow-md bg-amber-100">
            <div className="stat">
              <div className="stat-title text-xl">
                Average Completion (days)
              </div>
              <div className="flex items-start justify-start gap-2">
                <h1 className="stat-value">{data.averageCompletionDays}</h1>
                <ChartNoAxesCombined className={"text-yellow-400 mt-3"} />
              </div>
              <div className="stat-title text-sm">
                Avg time take to complete task
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-400/10 rounded-xl p-8">
          <TaskStatusChart taskStatusCount={taskStatusCount} />
        </div>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center justify-between gap-5">
        <div className="m-auto w-full">
          {loading ? (
            <p>Loading Chart...</p>
          ) : (
            <BarChart taskPriorityCounts={taskPriorityCount} />
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="m-auto w-full">
            {loading ? (
              <p>Loading Chart...</p>
            ) : (
              <DepartmentsEmpChart departmentCounts={departmentCount} />
            )}
          </div>
        </div>
        <div className="w-full flex items-center justify-between gap-5">
          <div className="stats shadow-md bg-gray-50">
            <div className="stat flex flex-col items-start justify-start overflow-visible p-0">
              <MonthlyTrendChart />
            </div>
          </div>
        </div>
        <div className="w-full max-h-[450px] shadow-xl px-6 py-4 overflow-scroll">
          <UpcomingDeadline />
        </div>
      </div>
    </div>
  );
};

export default Home;
