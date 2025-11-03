import React, { useEffect, useState } from "react";
import {
  UserIcon,
  BuildingIcon,
  CalendarIcon,
  BarChartIcon,
  PencilIcon,
  Loader,
  User,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const DepartmentSummary = ({ departmentId }) => {
  const { user } = useAuth();
  const [department, setDepartment] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");

  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  const formatDate = (isoDateString) => {
    if (!isoDateString) return "N/A";

    try {
      const date = new Date(isoDateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      return new Intl.DateTimeFormat("en-US", options).format(date);
    } catch (error) {
      console.error("Invalid date string:", isoDateString, error);
      return "Invalid Date";
    }
  };

  const fetchDepartmentDetails = async (id) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/department/details/${id}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setDepartment(res.data);
      setFormattedDate(formatDate(res.data.createdAt));
    } catch (error) {
      console.error("Error fetching department details:", error);
      // Optionally handle error state
    }
  };

  useEffect(() => {
    if (departmentId) {
      setDepartment(null);
      setFormattedDate("");
      fetchDepartmentDetails(departmentId);
    }
  }, [departmentId]);

  if (!departmentId || !department) {
    return (
      <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center h-48">
        {departmentId ? (
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <Loader className="h-10 w-10 animate-spin text-blue-500" />
            <p className="ml-3 text-lg text-gray-700">
              Loading department details...
            </p>
          </div>
        ) : (
          "Select a department to view details."
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <span
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#DBEAFE] text-blue-600 font-semibold text-lg`}
          >
            {department?.name.charAt(0)}
          </span>
          <h2 className="ml-3 text-lg font-medium text-gray-900">
            {department?.name} Department
          </h2>
        </div>
        <Link to={`/departments/${department._id}`}>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </button>
        </Link>
      </div>
      <div className="px-6 py-5">
        <p className="text-gray-700 mb-6">
          {department.description ||
            "No description available for this department."}
        </p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0 gap-4">
            {/* <img
              src={department.manager.avatar}
              alt={department.manager.name}
              className="h-12 w-12 rounded-full mr-4"
            /> */}
            <span
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#DBEAFE] text-blue-600 font-semibold text-lg`}
            >
              {department.manager?.username.charAt(0) || <User />}
            </span>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {department.manager?.username || "No Manager Assigned"}
              </h3>
              <p className="text-sm text-gray-500">
                {department.manager?.role}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600">
                <UserIcon className="h-5 w-5" />
              </span>
              <div className="ml-2">
                <p className="text-xs text-gray-500">Employees</p>
                <p className="text-sm font-medium">
                  {department.totalEmployees}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-green-100 text-green-600">
                <BarChartIcon className="h-5 w-5" />
              </span>
              <div className="ml-2">
                <p className="text-xs text-gray-500">Budget</p>
                <p className="text-sm font-medium">
                  ₹{formatter.format(department.budget)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-yellow-100 text-yellow-600">
                <BuildingIcon className="h-5 w-5" />
              </span>
              <div className="ml-2">
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium">
                  {user.organizationId?.country || "India"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-purple-100 text-purple-600">
                <CalendarIcon className="h-5 w-5" />
              </span>
              <div className="ml-2">
                <p className="text-xs text-gray-500">Established</p>
                <p className="text-sm font-medium">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Teams</h3>
          <div className="flex flex-wrap gap-2">
            {department.teams.map((team, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${department.color}`}
              >
                {team}
              </span>
            ))}
          </div>
        </div> */}
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View Department Members
        </button>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Department Reports
        </button>
      </div>
    </div>
  );
};
export default DepartmentSummary;
