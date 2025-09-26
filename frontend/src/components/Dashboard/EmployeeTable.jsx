import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UsersIcon, SearchIcon, FilterIcon, Loader } from 'lucide-react';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Employee Data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/employee/`,
          { withCredentials: true }
        );
        // Assuming the API returns an array of employee objects
        setEmployees(res.data); 
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // 2. Filter Logic
  const filteredEmployees = employees.filter(
    (employee) =>
      // Assuming employee objects have 'name', 'email', 'role', and 'department' fields
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Helper for Tailwind classes based on status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 3. Render States (Loading/Error/Data)
  
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-3 text-gray-600">Loading employee list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 shadow rounded-lg p-6 h-96 flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <UsersIcon className="h-5 w-5 mr-2 text-gray-500" />
            Employees
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
            {filteredEmployees.length === 0 ? (
                <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        {searchTerm ? "No employees match your search." : "No employee data available."}
                    </td>
                </tr>
            ) : (
                filteredEmployees.map((employee) => (
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
                        {employee.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.departmentId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(employee.status)}`}
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
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-medium">{filteredEmployees.length}</span> of{' '}
            <span className="font-medium">{employees.length}</span> employees
          </div>
          <div className="flex-1 flex justify-end">
            {/* Pagination buttons (functional logic not implemented) */}
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;