import NotificationPanel from "@/components/Dashboard/NotificationPanel";
import DepartmentEmployeeDistribution from "@/components/Departments/DepartmentEmployeeDistribution";
import DepartmentList from "@/components/Departments/DepartmentList";
import DepartmentSummary from "@/components/Departments/DepartmentSummary";
import Sidebar from "@/components/Layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import axios from "axios";
import {
  BellDot,
  BellIcon,
  PlusIcon,
  RefreshCcw,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdOutlineCreate } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Departments = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggleNotificationPanel, notifications } = useNotifications();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchSuggestions = useMemo(() => {
    if (!searchTerm) return [];

    const lowerCasedTerm = searchTerm.toLowerCase();
    const suggestions = new Set();

    departments.forEach((dep) => {
      if (dep.name.toLowerCase().includes(lowerCasedTerm)) {
        suggestions.add(dep.name);
      }
      // if (emp.role.toLowerCase().includes(lowerCasedTerm)) {
      //   suggestions.add(emp.role);
      // }
      // if (emp.departmentId?.name.toLowerCase().includes(lowerCasedTerm)) {
      //   suggestions.add(emp.departmentId.name);
      // }
    });

    return Array.from(suggestions).slice(0, 10);
  }, [searchTerm, departments]);

  // NEW: Memoized filtered departments to prevent re-calculating on every render
  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) {
      return departments;
    }
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, departments]);

  const clearSearchTerm = () => {
    setSearchTerm("");
  };

  // Handle click on suggestion
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false); // Hide suggestions after selection
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/department`,
        { name, description, budget },
        { withCredentials: true }
      );

      const newDepartment = res.data.department;

      // Add the new department to state if not already present
      setDepartments((prevDepartment) => {
        const exists = prevDepartment.some(
          (dept) => dept.id === newDepartment._id
        );
        if (!exists)
          return [
            ...prevDepartment,
            { ...newDepartment, totalEmployees: 0, manager: null },
          ];
        return prevDepartment;
      });

      setName("");
      setDescription("");
      setBudget("");
      toast.success("Department created successfully");
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/department/${id}`, {
      withCredentials: true,
    });

    toast.success("Department deleted successfully");
    setDeleteOpen(false);
    setDepartments((dept) => dept.filter((dept) => dept._id !== id));
  };

  const fetchDepartmentDetails = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/department/details`,
        { withCredentials: true }
      );
      setLoading(false);
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching department details:", error);
      toast.error("Failed to fetch department details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentDetails();
  }, []);
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
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Departments
            </h1>
            {user.role?.name === "Boss" && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new department.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="w-full border px-3 py-2 rounded-md"
                    />
                    <input
                      type="text"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                      className="w-full border px-3 py-2 rounded-md"
                    />
                    <input
                      type="number"
                      name="budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Budget"
                      className="w-full border px-3 py-2 rounded-md"
                    />
                    <Button type="submit" className="w-full">
                      {loading ? "Creating..." : "Create Department"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <DepartmentList
                loading={loading}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                departments={departments}
              />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <DepartmentSummary departmentId={selectedDepartment} />
              <DepartmentEmployeeDistribution
                departmentId={selectedDepartment}
              />
            </div>
          </div>
        </main>
      </div>
      <NotificationPanel />
    </div>
  );
};

export default Departments;
