import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { UsersIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const ChartLoading = () => (
  <div className="flex justify-center items-center h-full">
    <p className="text-gray-500">Loading chart data...</p>
  </div>
);

const stringToHSLColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;

  // We use fixed saturation and lightness for nice, readable colors
  // You can adjust these percentages
  const saturation = "70%";
  const lightness = "45%";

  return `hsl(${hue}, ${saturation}, ${lightness})`;
};

const DepartmentEmployeeDistribution = ({ departmentId }) => {
  const [departmentData, setDepartmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDepartmentDetails = async (id) => {
    setIsLoading(true); // Set loading to true
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/department/details/${id}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setDepartmentData(res.data);
    } catch (error) {
      console.error("Error fetching department details:", error);
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  useEffect(() => {
    if (departmentId) {
      setDepartmentData(null);
      fetchDepartmentDetails(departmentId);
    }
  }, [departmentId]);
  const rawTeams = departmentData?.teams || [];

  const data = rawTeams.map((team) => ({
    name: team.name,
    employees: team.members.length,
    fill: stringToHSLColor(team._id || team.name),
  }));

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="h-96">
          <ChartLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <UsersIcon className="h-5 w-5 mr-2 text-gray-500" />
          Team Distribution
        </h2>
      </div>
      <div className="px-6 py-5">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={false}
                // tick={{ fontSize: 12 }}
                // angle={-45}
                // textAnchor="end"
                // interval={0}
                // height={80}
              />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="employees" name="Employees" barSize={30}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <span
                className="h-3 w-3 rounded-full mr-2"
                style={{
                  backgroundColor: item.fill,
                }}
              ></span>
              <div>
                <p className="text-xs text-gray-500">{item.name}</p>
                <p className="text-sm font-medium">{item.employees}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentEmployeeDistribution;
