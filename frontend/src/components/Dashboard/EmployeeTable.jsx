import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { UsersIcon, SearchIcon, FilterIcon, Loader } from "lucide-react";

// --- CONFIGURATION CONSTANTS ---
const EMPLOYEES_PER_PAGE = 5;

const calculatePercentageChange = (current, previous) => {
  // Handle division by zero or invalid input
  if (previous === 0 || !previous || !current) return "N/A";

  const change = ((current - previous) / previous) * 100;
  // Format to two decimal places and prepend '+' for positive change
  return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
};

// Calculates the percentage of 'part' out of 'whole'
const calculatePercentage = (part, whole) => {
  if (whole === 0 || !whole || !part) return "0.00%";
  const percentage = (part / whole) * 100;
  return percentage.toFixed(2) + "%";
};

const EmployeeTable = ({ onStatsCalculated }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentEmployeeCount, setCurrentEmployeeCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/employee/all-employee`,
          { withCredentials: true }
        );

        const employeesData = res.data;

        setEmployees(employeesData);
        setCurrentEmployeeCount(employeesData.length);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    setCurrentPage(1);

    return employees.filter(
      (employee) =>
        // Assuming employee objects have 'username', 'email', 'role', and a department name nested
        employee.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.departmentId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // 3. PAGINATION CALCULATIONS
  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);

  // Calculate the slice boundaries
  const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE;
  const endIndex = startIndex + EMPLOYEES_PER_PAGE;

  // Slice the array to get only the employees for the current page
  const employeesToDisplay = filteredEmployees.slice(startIndex, endIndex);

  // --- Helper for Tailwind classes based on status ---
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800";
      case "Terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // --- Handlers for Pagination Buttons ---
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // --- Render States (Loading/Error/Data) ---
  if (loading) {
    // ... (loading state unchanged)
    return (
      <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-3 text-gray-600">Loading employee list...</p>
      </div>
    );
  }

  if (error) {
    // ... (error state unchanged)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 shadow rounded-lg p-6 h-96 flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-medium text-gray-900 flex flex-col md:flex-row items-center">
            <span className="flex items-center justify-center">
              <UsersIcon className="h-5 w-5 mr-2 text-gray-500" />
              Employees
            </span>
            {/* Optional: Display current total count here */}
            <span className="ml-2 text-sm text-gray-500">
              ({currentEmployeeCount} Total)
            </span>
          </h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Filter button kept for structure, requires additional logic */}
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FilterIcon className="h-4 w-4 mr-1" />
              Filter
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-scroll">
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
                Job Role
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
            {employeesToDisplay.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm
                    ? "No employees match your search on this page."
                    : "No employee data available."}
                </td>
              </tr>
            ) : (
              // --- DISPLAY PAGINATED DATA ---
              employeesToDisplay.map((employee) => (
                <tr key={employee._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-600">
                        {employee.username?.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.jobTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.departmentId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        employee.status
                      )}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900">
                      View
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* --- PAGINATION FOOTER --- */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">
              {employeesToDisplay.length > 0 ? startIndex + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(endIndex, filteredEmployees.length)}
            </span>{" "}
            of <span className="font-medium">{filteredEmployees.length}</span>{" "}
            results
            {/* Optionally show total fetched if filteredEmployees.length != employees.length */}
            {filteredEmployees.length !== employees.length && (
              <span> (from {employees.length} total)</span>
            )}
          </div>
          <div className="flex-1 flex justify-end items-center">
            <div className="text-sm text-gray-500 mr-4">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </div>

            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-white ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={
                currentPage === totalPages || filteredEmployees.length === 0
              }
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md -ml-px text-gray-700 bg-white ${
                currentPage === totalPages || filteredEmployees.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
