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

import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { MdDelete, MdOutlineCreate } from "react-icons/md";
import RoleSelect from "@/components/RoleSelect";
import DeptOption from "@/components/DeptOption";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { toast as hotToast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import socket from "@/utils/socket";
import { FaUserEdit } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

const Employees = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  // const [deleteAlert, setDeleteAlert] = useState(false);
  // const [editAlert, setEditAlert] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contactNo: "",
  });

  // Memorized filter login
  const filteredEmployees = useMemo(() => {
    const lowerCasedTerm = searchTerm.toLowerCase();
    if (!lowerCasedTerm) return employee;
    return employee.filter((emp) => {
      const nameMatch = emp.username.toLowerCase().includes(lowerCasedTerm);
      const roleMatch = emp.role.toLowerCase().includes(lowerCasedTerm);
      const deptMatch = emp.departmentId?.name
        ?.toLowerCase()
        .includes(lowerCasedTerm);
      return nameMatch || roleMatch || deptMatch;
    });
  }, [searchTerm, employee]);

  // Memorize suggestions generation
  const searchSuggestions = useMemo(() => {
    if (!searchTerm) return [];

    const lowerCasedTerm = searchTerm.toLowerCase();
    const suggestions = new Set();

    employee.forEach((emp) => {
      // Suggest employee names
      if (emp.username.toLowerCase().includes(lowerCasedTerm)) {
        suggestions.add(emp.username);
      }
      // Suggest roles
      if (emp.role.toLowerCase().includes(lowerCasedTerm)) {
        suggestions.add(emp.role);
      }
      // Suggest departments
      if (emp.departmentId?.name.toLowerCase().includes(lowerCasedTerm)) {
        suggestions.add(emp.departmentId.name);
      }
    });

    return Array.from(suggestions).slice(0, 10); // Return top 10 suggestions
  }, [searchTerm, employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearSearchTerm = () => {
    setSearchTerm("");
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        role: selectedRoles.value,
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
      setFormData({ username: "", email: "", contactNo: "" });
      setSelectedDept(null);
      setSelectedRoles(null);
      setOpen(false);

      const newEmployee = res.data;

      // Add to state only if not already present
      setEmployee((prevEmployee) => {
        const exists = prevEmployee.some((emp) => emp._id === newEmployee._id);
        if (!exists) {
          const updated = [newEmployee, ...prevEmployee];
          return updated;
        }
        return prevEmployee;
      });
    } catch (err) {
      console.error(err);

      // Check for duplicate email error
      if (
        err?.response?.data?.message?.includes("already registered") ||
        err?.response?.data?.message?.includes("duplicate")
      ) {
        hotToast.error("⚠️ This email is already registered!");
      } else {
        toast.error("Something went wrong while creating the employee");
      }
    } finally {
      setLoading(false);
    }
  };

  const getAllEmployee = async (e) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/employee`,
        {
          withCredentials: true,
        }
      );

      setLoading(false);
      setEmployee(res.data);
    } catch (error) {
      console.log("Error fetching employee", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/employee/${id}`, {
        withCredentials: true,
      });
      toast("Employee deleted successfully");
      setEmployee((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    getAllEmployee();
  }, []);

  useEffect(() => {
    if (!user?.organizationId) return;

    const handleConnect = () => {
      socket.emit("joinOrgRoom", user.organizationId);
    };

    const handleStatusUpdate = ({ userId, status }) => {
      console.log("📬 Status update received:", userId, status);
      setEmployee((prev) =>
        prev.map((emp) => (emp._id === userId ? { ...emp, status } : emp))
      );
    };

    socket.on("connect", handleConnect);
    socket.on("statusUpdate", handleStatusUpdate);

    // If socket is already connected, manually call it
    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("statusUpdate", handleStatusUpdate);
    };
  }, [user.organizationId]);

  return (
    <div className="w-full h-full p-5">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <div className="flex items-center justify-between gap-2 rounded-full bg-[#121212]">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)} // NEW: Show suggestions on focus
              // NEW: Hide suggestions on blur with a small delay to allow clicking
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="w-full bg-transparent py-2 placeholder:text-gray-400 rounded-l-full text-white outline-none px-4"
              type={"text"}
              placeholder={"Search by name, role, or department..."}
              autoComplete="off" // NEW: Prevent browser's default autocomplete
            />
            <div className="flex items-center justify-center gap-2">
              {searchTerm?.length > 0 && (
                <button onClick={clearSearchTerm}>
                  <RxCross1 color="white" />
                </button>
              )}
              <button className="bg-[#222222] px-4 py-2.5 rounded-r-full">
                <IoSearch color="white" size={20} />
              </button>
            </div>
          </div>
          {/* Suggestion Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-100"
                  // Use onMouseDown to prevent the onBlur from firing first
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          {user.role === "Boss" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-slate-200 text-black hover:text-white rounded-md cursor-pointer">
                  <MdOutlineCreate />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Employee</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new employee.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border px-3 py-2 rounded-md"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full border px-3 py-2 rounded-md"
                  />
                  <input
                    type="text"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    className="w-full border px-3 py-2 rounded-md"
                  />
                  <DeptOption
                    selectedDept={selectedDept}
                    setSelectedDept={setSelectedDept}
                  />
                  <RoleSelect
                    selectedRoles={selectedRoles}
                    setSelectedRoles={setSelectedRoles}
                  />
                  <Button type="submit" className="w-full">
                    {loading ? "Creating..." : "Create Employee"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className={"cursor-pointer"}>
                <FaFilter className="mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>Active</DropdownMenuItem>
                <DropdownMenuItem>Inactive</DropdownMenuItem>
                <DropdownMenuItem>On Leave</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={getAllEmployee}
            variant={"ghost"}
            className={"cursor-pointer"}
          >
            <RefreshCcw /> Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full gap-3">
          <p className="text-lg">Loading employee data</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-5">
          {employee.length > 0 && filteredEmployees === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No employees found.
            </p>
          ) : filteredEmployees.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No employees found. Please create one.
            </p>
          ) : (
            <>
              {filteredEmployees
                .filter((emp) => emp._id?.toString() !== user._id?.toString())
                .map((emp) => {
                  const initials = emp.username
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <div
                      key={emp._id}
                      className="bg-white rounded-xl shadow-md border p-5 flex justify-between hover:shadow-lg transition duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-start gap-2">
                            <div className="bg-slate-200 text-slate-800 font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl">
                              {initials}
                            </div>
                            <h4 className="text-lg font-semibold text-slate-800">
                              {emp.username}
                            </h4>
                          </div>
                          <div className="py-2">
                            <p className="text-sm text-gray-500">{emp.email}</p>
                            <p className="text-sm text-gray-500">
                              <span className="text-gray-600 font-semibold">
                                Department :-
                              </span>{" "}
                              {emp.departmentId?.name || "—"}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="text-gray-600 font-semibold">
                                Role :-
                              </span>{" "}
                              {emp.role}
                            </p>
                          </div>
                          <div className="flex items-start justify-start gap-4">
                            <span className="inline-block mt-1 text-sm font-medium text-green-600 bg-green-100 px-3 py-2 rounded">
                              {emp.status}
                            </span>
                            <Button className={"mt-1 cursor-pointer"}>
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start justify-start gap-2">
                        {user.role === "Boss" && (
                          <>
                            <Button
                              onClick={() => navigate(`/employees/${emp._id}`)}
                              className={
                                "cursor-pointer bg-green-600 hover:bg-green-600 hover:opacity-70"
                              }
                            >
                              <FaUserEdit className="w-4 h-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="bg-red-500 hover:bg-red-600 text-white cursor-pointer w-full">
                                  <MdDelete className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Delete Employee</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold">{emp.username}</span>? This
                                    action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end gap-3 pt-4">
                                  <DialogTrigger asChild>
                                      <Button variant="outline">Cancel</Button>
                                  </DialogTrigger>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(emp._id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Employees;
