// EmployeeDirectory.jsx
import React from "react";
import { BuildingIcon } from "lucide-react";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ExternalLinkIcon,
  Trash2Icon,
  EditIcon,
  MessageSquareIcon,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "on leave":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getInitials = (username) => {
  if (!username) return "";
  return username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

// Helper component for the Grid View
const EmployeeCard = ({ employee, user, navigate, handleDelete }) => {
  const initials = getInitials(employee.username);
  const statusClasses = getStatusStyles(employee.status);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4 flex flex-col items-center">
        <div className="h-24 w-24 rounded-full mb-4 bg-blue-100 text-blue-800 flex items-center justify-center text-3xl font-bold">
          {initials}
        </div>
        <h3 className="text-lg font-medium text-gray-900">
          {employee.username}
        </h3>
        <p className="text-sm text-gray-600">{employee.role}</p>
        <span
          className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}
        >
          {employee.status}
        </span>
      </div>
      <div className="border-t border-gray-200 px-4 py-3 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <MailIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <p className="truncate">{employee.email}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <PhoneIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <p>{employee.contactNo || "—"}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <BuildingIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <p>{employee.departmentId?.name || "—"}</p>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-around">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
          <MessageSquareIcon className="h-4 w-4" />
        </button>
        {user.role === "Boss" && (
          <>
            <button
              onClick={() => navigate(`/employees/${employee._id}`)}
              className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
            >
              <EditIcon className="h-4 w-4" />
            </button>
            <DeleteDialog employee={employee} handleDelete={handleDelete} />
          </>
        )}
      </div>
    </div>
  );
};

// Helper component for the Delete Dialog
const DeleteDialog = ({ employee, handleDelete }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center">
        <Trash2Icon className="h-4 w-4" />
      </button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{employee.username}</span>? This
          action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-3 pt-4">
        <DialogTrigger asChild>
          <Button variant="outline">Cancel</Button>
        </DialogTrigger>
        <Button
          variant="destructive"
          onClick={() => handleDelete(employee._id)}
        >
          Delete
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// Main EmployeeDirectory Component
const EmployeeDirectory = ({
  view,
  employees,
  loading,
  searchTerm,
  filteredEmployees,
  handleDelete,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-3 text-lg text-gray-600">Loading employee data...</p>
      </div>
    );
  }

  const employeesToDisplay = filteredEmployees.filter(
    (emp) => emp._id?.toString() !== user._id?.toString()
  );

  if (employees.length > 0 && employeesToDisplay.length === 0) {
    return (
      <div className="p-6 bg-white shadow rounded-lg">
        <p className="text-gray-500 text-center">
          {searchTerm
            ? "No employees found matching your search."
            : "No other employees found."}
        </p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="p-6 bg-white shadow rounded-lg">
        <p className="text-gray-500 text-center">
          No employees found. Please create one.
        </p>
      </div>
    );
  }

  if (view === "grid") {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
          {employeesToDisplay.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              user={user}
              navigate={navigate}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    );
  } else {
    // List View
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeesToDisplay.map((employee) => (
                <tr
                  key={employee._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-800">
                        {getInitials(employee.username)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.departmentId?.name || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(
                        employee.status
                      )}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-gray-500 hover:text-blue-600 p-1">
                        <MessageSquareIcon className="h-4 w-4" />
                      </button>
                      {user.role === "Boss" && (
                        <>
                          <button
                            onClick={() =>
                              navigate(`/employees/${employee._id}`)
                            }
                            className="text-gray-500 hover:text-green-600 p-1"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <DeleteDialog
                            employee={employee}
                            handleDelete={handleDelete}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination placeholder - can be implemented later */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{employeesToDisplay.length}</span>{" "}
              of <span className="font-medium">{employees.length - 1}</span>{" "}
              employees
            </span>
            <div className="flex space-x-2">
              <button
                disabled
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default EmployeeDirectory;
// Note: BuildingIcon is used in the List View and should be imported if available
// For now, I'll add a temporary import for it inside this file
