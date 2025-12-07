import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Users,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

const EMPLOYEES_PER_PAGE = 11;

const EmployeeTable = ({ onStatsCalculated }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/employee/all-employee`,
          { withCredentials: true }
        );
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
        setError("Failed to load data.");
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
        employee.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.departmentId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);
  const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE;
  const employeesToDisplay = filteredEmployees.slice(
    startIndex,
    startIndex + EMPLOYEES_PER_PAGE
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "On Leave":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Terminated":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  if (error)
    return (
      <div className="h-64 flex items-center justify-center bg-rose-50 rounded-2xl border border-rose-100 text-rose-600">
        {error}
      </div>
    );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-blue-600" size={20} />
            Team Members
          </h2>
          <p className="text-sm text-slate-500 hidden sm:block">
            {employees.length} total employees
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead className="bg-slate-50/50">
            <tr>
              {["Employee", "Role", "Department", "Status", ""].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider first:pl-6 last:pr-6"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employeesToDisplay.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-slate-500 text-sm"
                >
                  No results found.
                </td>
              </tr>
            ) : (
              employeesToDisplay.map((emp) => (
                <tr
                  key={emp._id}
                  className="group hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {emp.profileImage ? (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
                          <img src={emp.profileImage} alt={emp.firstName} className="rounded-full h-full w-full object-cover"/>
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm border border-blue-200">
                          {emp.firstName?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {emp.firstName}{" "}{emp.lastName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {emp.jobTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium text-xs border border-slate-200">
                      {emp.departmentId?.name || "Unassigned"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClass(
                        emp.status
                      )}`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/employees/${emp._id}`}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg inline-block"
                    >
                      <MoreHorizontal size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-b-2xl">
        <span className="text-xs text-slate-500 font-medium">
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
