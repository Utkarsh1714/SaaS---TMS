import { useAuth } from "@/context/AuthContext";
import { Clock, LayoutList, Loader } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="w-full h-full">
      <div className="stats shadow-xl block sm:inline-flex">
        <div className="stat">
          <div className="stat-title text-xl">Total Task</div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="stat-value">25.6K</h1>
            <LayoutList className="text-blue-400" />
          </div>
        </div>

        <div className="stat">
          <div className="stat-title text-xl">Pending</div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="stat-value">2.6M</h1>
            <Clock className="text-red-400" />
          </div>
        </div>

        <div className="stat">
          <div className="stat-title text-xl">In Progress</div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="stat-value">12K</h1>
            <Loader className={'text-yellow-400'}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
