import React from "react";
import {
  BuildingIcon,
  ChevronRightIcon,
  UserIcon,
  MoreHorizontalIcon,
} from "lucide-react";
const DepartmentList = ({
  selectedDepartment,
  setSelectedDepartment,
  departments,
}) => {
  console.log(departments);
  //   const departments = [
  //     {
  //       id: 'engineering',
  //       name: 'Engineering',
  //       employeeCount: 42,
  //       managerName: 'Michael Johnson',
  //       managerAvatar:
  //         'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //       color: 'bg-blue-100 text-blue-800',
  //     },
  //     {
  //       id: 'marketing',
  //       name: 'Marketing',
  //       employeeCount: 21,
  //       managerName: 'Sarah Davis',
  //       managerAvatar:
  //         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //       color: 'bg-green-100 text-green-800',
  //     },
  //     {
  //       id: 'sales',
  //       name: 'Sales',
  //       employeeCount: 25,
  //       managerName: 'Robert Wilson',
  //       managerAvatar:
  //         'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //       color: 'bg-yellow-100 text-yellow-800',
  //     },
  //     {
  //       id: 'hr',
  //       name: 'Human Resources',
  //       employeeCount: 12,
  //       managerName: 'Emily Thompson',
  //       managerAvatar:
  //         'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //       color: 'bg-pink-100 text-pink-800',
  //     },
  //     {
  //       id: 'finance',
  //       name: 'Finance',
  //       employeeCount: 16,
  //       managerName: 'David Brown',
  //       managerAvatar:
  //         'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //       color: 'bg-indigo-100 text-indigo-800',
  //     },
  //     {
  //       id: 'design',
  //       name: 'Design',
  //       employeeCount: 12,
  //       managerName: 'Jessica Miller',
  //       managerAvatar:
  //         'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  //       color: 'bg-purple-100 text-purple-800',
  //     },
  //   ]
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <BuildingIcon className="h-5 w-5 mr-2 text-gray-500" />
          All Departments
        </h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {departments.map((department, i) => (
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
        ))}
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
