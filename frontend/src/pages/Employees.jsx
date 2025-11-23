import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Layout/Sidebar";
import {
  BellIcon,
  SearchIcon,
  UserIcon,
  PlusIcon,
  FilterIcon,
  DownloadIcon,
  UploadIcon,
  RefreshCcw,
  ListIcon,
  GridIcon,
  BellDot,
} from "lucide-react";
import EmployeeDirectory from "@/components/Employee/EmployeeDirectory ";
import EmployeeStats from "@/components/Employee/EmployeeStats";
import DepartmentDistribution from "@/components/Employee/DepartmentDistribution ";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { toast as hotToast } from "react-hot-toast";
import socket from "@/utils/socket";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeptOption from "@/components/DeptOption";
import RoleSelect from "@/components/RoleSelect";
import { RxCross1 } from "react-icons/rx";
import NotificationPanel from "@/components/Dashboard/NotificationPanel";
import { useNotifications } from "@/context/NotificationContext";
import DepartmentsChart from "@/components/Dashboard/DepartmentsChart";

const EMPLOYEES_PER_PAGE = 6;

const calculatePercentageChange = (current, previous) => {
  // Check for invalid or zero previous value to avoid division by zero
  if (previous === 0 || !previous || !current) return "N/A";

  const change = ((current - previous) / previous) * 100;
  // Format to two decimal places and prepend '+' for positive change
  return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
};

const EmployeesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggleNotificationPanel, notifications } = useNotifications();

  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contactNo: "",
    jobTitle: "",
    roleName: "",
  });
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  const [employeeCount, setEmployeeCount] = useState(null);
  const [newHiresCount, setNewHiresCount] = useState(0);
  const [yoyGrowthPercentage, setYoYGrowthPercentage] = useState("0.00%");
  const [activeEmployeeCount, setActiveEmployeeCount] = useState(null);

  const [departmentCount, setDepartmentCount] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const getAllEmployee = async () => {
    setLoading(true);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/employeePage/analytics`,
        {
          withCredentials: true,
        }
      );

      const {
        totalEmployeeCount,
        newHiresThisMonth,
        activeEmployeeCount,
        employeeList,
      } = res.data;

      setEmployee(employeeList);
      setEmployeeCount(totalEmployeeCount);
      setNewHiresCount(newHiresThisMonth);
      setActiveEmployeeCount(activeEmployeeCount);
    } catch (error) {
      console.error("Error fetching employee", error);
      toast.error("Failed to fetch employee data.");
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentCount = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/employeePage/data1`,
      { withCredentials: true }
    );
    setDepartmentCount(res.data.data);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/employee/${id}`, {
        withCredentials: true,
      });
      toast.success("Employee deleted successfully");
      setEmployee((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const payload = {
        ...formData,
        departmentId: selectedDept.value,
        organizationId: user.organizationId,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/employee`,
        payload,
        {
          withCredentials: true,
        }
      );

      toast.success("Employee created successfully");
      setFormData({
        username: "",
        email: "",
        contactNo: "",
        jobTitle: "",
        roleName: "",
      });
      setSelectedDept(null);
      // setSelectedRoles(null);
      setIsCreateDialogOpen(false);

      // fetch employee list
      getAllEmployee();

      // const newEmployee = res.data;
      // setEmployee((prevEmployee) => {
      //   const exists = prevEmployee.some((emp) => emp._id === newEmployee._id);
      //   if (!exists) {
      //     return [newEmployee, ...prevEmployee];
      //   }
      //   return prevEmployee;
      // });
    } catch (err) {
      console.error(err);
      if (
        err?.response?.data?.message?.includes("already registered") ||
        err?.response?.data?.message?.includes("duplicate")
      ) {
        hotToast.error("⚠️ This email is already registered!");
      } else {
        toast.error("Something went wrong while creating the employee");
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const clearSearchTerm = () => {
    setSearchTerm("");
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  // Memorized filter logic (from old Employees.jsx)
  const filteredEmployees = useMemo(() => {
    setCurrentPage(1);

    const lowerCasedTerm = searchTerm.toLowerCase();

    let filteredBySearch = employee.filter((emp) => {
      const nameMatch = emp.username.toLowerCase().includes(lowerCasedTerm);
      const roleMatch = emp.jobTitle.toLowerCase().includes(lowerCasedTerm);
      const deptMatch = emp.departmentId?.name
        ?.toLowerCase()
        .includes(lowerCasedTerm);
      return nameMatch || roleMatch || deptMatch;
    });

    if (statusFilter !== "All") {
      // Normalize status to match data (assuming data uses "Active", "Inactive", "On Leave")
      const targetStatus = statusFilter;

      filteredBySearch = filteredBySearch.filter(
        (emp) => emp.status === targetStatus
      );
    }

    return filteredBySearch;
  }, [searchTerm, employee, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);

  const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE;
  const endIndex = startIndex + EMPLOYEES_PER_PAGE;

  const employeesToDisplay = filteredEmployees.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // Search feature
  const searchSuggestions = useMemo(() => {
    if (!searchTerm) return [];

    const lowerCasedTerm = searchTerm.toLowerCase();
    const suggestions = new Set();

    employee.forEach((emp) => {
      if (emp.username?.toLowerCase().includes(lowerCasedTerm)) {
        suggestions.add(emp.username);
      }
      if (emp.jobTitle?.toLowerCase().includes(lowerCasedTerm)) {
        suggestions.add(emp.jobTitle);
      }
      if (emp.departmentId?.name?.toLowerCase().includes(lowerCasedTerm)) {
        suggestions.add(emp.departmentId.name);
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }, [searchTerm, employee]);

  useEffect(() => {
    getAllEmployee();
    getDepartmentCount();
  }, []);

  useEffect(() => {
    const orgId = user?.organizationId?._id;

    if (!orgId) {
      console.log("Socket: Waiting for organization ID...");
      return;
    }

    const handleConnect = () => {
      socket.emit("joinOrgRoom", orgId);
    };

    const handleStatusUpdate = ({ userId, status }) => {
      console.log("📬 Status update received:", userId, status);
      setEmployee((prev) =>
        prev.map((emp) => (emp._id === userId ? { ...emp, status } : emp))
      );
    };

    const handleConnectError = (error) => {
      console.error("❌ Socket Connection Error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("statusUpdate", handleStatusUpdate);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("statusUpdate", handleStatusUpdate);
    };
  }, [user?.organizationId?._id]);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </button>
                <div className="ml-4 flex flex-col items-center lg:ml-0 relative w-64">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 150)
                      }
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search by name, role, or department..."
                      type="text"
                      autoComplete="off"
                    />
                    {searchTerm?.length > 0 && (
                      <button
                        onClick={clearSearchTerm}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <RxCross1 className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <ul className="absolute z-20 w-full mt-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-100"
                          onMouseDown={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={toggleNotificationPanel}
                  className="flex-shrink-0 p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">View notifications</span>
                  {notifications && notifications.length > 0 ? (
                    <BellDot className="h-6 w-6 text-green-500" />
                  ) : (
                    <BellIcon className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                <div className="ml-3 relative">
                  <div>
                    <button className="flex items-center max-w-xs bg-gray-100 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <span className="sr-only">Open user menu</span>
                      <UserIcon className="h-8 w-8 rounded-full p-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">
              Employee Directory
            </h1>
            <div className="flex flex-wrap space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <UploadIcon className="h-4 w-4 mr-2" />
                Import
              </button>
              {user.role?.name === "Boss" && (
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Employee
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-white">
                    <DialogHeader>
                      <DialogTitle>Create New Employee</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new employee.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleCreateSubmit}>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <input
                        type="text"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        placeholder="Contact Number"
                        className="w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <DeptOption
                        selectedDept={selectedDept}
                        setSelectedDept={setSelectedDept}
                      />
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="Job Ttile"
                        className="w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <input
                        type="text"
                        name="roleName"
                        value={formData.roleName}
                        onChange={handleChange}
                        placeholder="Role Name"
                        className="w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      {/* <RoleSelect
                        selectedRoles={selectedRoles}
                        setSelectedRoles={setSelectedRoles}
                      /> */}
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={createLoading}
                      >
                        {createLoading ? (
                          <>
                            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Creating...
                          </>
                        ) : (
                          "Create Employee"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          <EmployeeStats
            totalEmployee={employeeCount}
            employeeIncresed={yoyGrowthPercentage}
            newHires={newHiresCount}
            activeEmployee={activeEmployeeCount}
          />
          <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="lg:col-span-1">
              <DepartmentsChart departmentCounts={departmentCount} />
            </div>
            <div className="lg:col-span-2">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center space-x-0 rounded-md shadow-sm border border-gray-300">
                  <button
                    onClick={() => setView("grid")}
                    className={`inline-flex items-center px-3 py-1.5 border-r border-gray-300 text-sm font-medium ${
                      view === "grid"
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 bg-white hover:bg-gray-50"
                    } rounded-l-md`}
                  >
                    <GridIcon className="h-5 w-5 mr-1" />
                    Grid
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium ${
                      view === "list"
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 bg-white hover:bg-gray-50"
                    } rounded-r-md`}
                  >
                    <ListIcon className="h-5 w-5 mr-1" />
                    List
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <FilterIcon className="h-4 w-4 mr-1" />
                        {statusFilter === "All" ? "Filter" : statusFilter}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white shadow-lg rounded-md p-1"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleStatusFilter("All")}
                          className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                        >
                          All Employees
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                          onClick={() => handleStatusFilter("Active")}
                        >
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                          onClick={() => handleStatusFilter("Inactive")}
                        >
                          Inactive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                          onClick={() => handleStatusFilter("On Leave")}
                        >
                          On Leave
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    onClick={getAllEmployee}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    disabled={loading}
                  >
                    <RefreshCcw
                      className={`h-4 w-4 mr-1 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </button>
                </div>
              </div>
              <EmployeeDirectory
                view={view}
                employees={employee}
                loading={loading}
                searchTerm={searchTerm}
                handleDelete={handleDelete}
                filteredEmployees={filteredEmployees}
                employeesToDisplay={employeesToDisplay}
                currentPage={currentPage}
                totalPages={totalPages}
                goToPreviousPage={goToPreviousPage}
                goToNextPage={goToNextPage}
              />
            </div>
          </div>
        </main>
      </div>
      <NotificationPanel />
    </div>
  );
};
export default EmployeesPage;
