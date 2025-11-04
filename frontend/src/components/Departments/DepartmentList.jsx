import React from "react";
import {
  BuildingIcon,
  ChevronRightIcon,
  UserIcon,
  MoreHorizontalIcon,
  Loader2,
} from "lucide-react";
const DepartmentList = ({
  loading,
  selectedDepartment,
  setSelectedDepartment,
  departments,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <BuildingIcon className="h-5 w-5 mr-2 text-gray-500" />
          All Departments
        </h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="ml-3 text-lg text-gray-600">Loading departments...</p>
          </div>
        ) : (
          departments.map((department, i) => (
            <li key={i}>
              <button
                onClick={() => setSelectedDepartment(department._id)}
                className={`w-full text-left px-6 py-4 hover:bg-gray-50 flex items-center justify-between ${
                  selectedDepartment === department._id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#DBEAFE] text-blue-600 font-semibold text-lg`}
                  >
                    {department.name.charAt(0)}
                  </span>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {department.name}
                    </p>
                    <div className="flex items-center mt-1">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">
                        {department.totalEmployees} employees
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {selectedDepartment === department.id ? (
                    <ChevronRightIcon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button className="w-full text-sm text-blue-600 hover:text-blue-500 font-medium">
          View Department Structure
        </button>
      </div>
    </div>
  );
};
export default DepartmentList;
