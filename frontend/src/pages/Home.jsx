import BarChart from "@/components/BarChart";
import { useAuth } from "@/context/AuthContext";
import { Clock, LayoutList, Loader } from "lucide-react";
import { MdOutlineAutoGraph } from "react-icons/md";
import { SlGraph } from "react-icons/sl";

const Home = () => {
  return (
    <div className="w-full h-full py-5 px-5 sm:px-2 space-y-6">
      <div className="w-full grid sm:grid-col-2 md:grid-cols-3 grid-cols-1 sm:flex-row justify-between gap-4 sm:gap-4">
        <div className="stats w-full shadow-md bg-amber-100">
          <div className="stat">
            <div className="stat-title text-2xl">Total Task</div>
            <div className="flex items-start justify-start gap-2">
              <h1 className="stat-value">25.6K</h1>
              <LayoutList className="text-blue-400 mt-3" />
            </div>
          </div>

          <div className="stat">
            <div className="stat-title text-2xl">Pending</div>
            <div className="flex items-start justify-start gap-2">
              <h1 className="stat-value">2.6M</h1>
              <Clock className="text-red-400 mt-3" />
            </div>
          </div>

          <div className="stat">
            <div className="stat-title text-2xl">In Progress</div>
            <div className="flex items-start justify-start gap-2">
              <h1 className="stat-value">12K</h1>
              <Loader className={"text-yellow-400 mt-3"} />
            </div>
          </div>
        </div>
        <div className="stats shadow-md bg-blue-100">
          <div className="stat flex items-center justify-center">
            <div className="flex items-center justify-center">
              <MdOutlineAutoGraph size={60} className="text-blue-500" />
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="stat-title text-2xl">Completed Task</div>
              <h1 className="stat-value">25.6K</h1>
            </div>
          </div>
        </div>
        <div className="stats w-fit shadow-md bg-gray-50">
          <div className="stat flex items-start justify-start">
            <h1>Upcomming Meetings</h1>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 items-center justify-between gap-5">
        <div className="m-auto w-full">
          <BarChart />
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="stats shadow-md bg-gray-50">
            <div className="stat flex flex-col items-start justify-start">
              <h1>Upcomming Meetings Will be shown here</h1>
              <h1>Upcomming Meetings Will be shown here</h1>
              <h1>Upcomming Meetings Will be shown here</h1>
            </div>
          </div>
          <div className="stats shadow-md bg-gray-50">
            <div className="stat flex flex-col items-start justify-start">
              <h1>Upcomming Meetings Will be shown here</h1>
              <h1>Upcomming Meetings Will be shown here</h1>
              <h1>Upcomming Meetings Will be shown here</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
