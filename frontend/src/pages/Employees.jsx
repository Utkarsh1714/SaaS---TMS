// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import { useAuth } from "@/context/AuthContext";
// import { useEffect, useMemo, useState } from "react";
// import { FaFilter } from "react-icons/fa6";
// import { MdDelete, MdOutlineCreate } from "react-icons/md";
// import RoleSelect from "@/components/RoleSelect";
// import DeptOption from "@/components/DeptOption";
// import axios from "axios";
// import { RefreshCcw } from "lucide-react";
// import { toast } from "sonner";
// import { toast as hotToast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import socket from "@/utils/socket";
// import { FaUserEdit } from "react-icons/fa";
// import { IoSearch } from "react-icons/io5";
// import { RxCross1 } from "react-icons/rx";

// const Employees = () => {
//   const { user } = useAuth();
//   const [open, setOpen] = useState(false);
//   // const [deleteAlert, setDeleteAlert] = useState(false);
//   // const [editAlert, setEditAlert] = useState(false);
//   const [selectedRoles, setSelectedRoles] = useState(null);
//   const [selectedDept, setSelectedDept] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [employee, setEmployee] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     contactNo: "",
//   });

//   // Memorized filter login
//   const filteredEmployees = useMemo(() => {
//     const lowerCasedTerm = searchTerm.toLowerCase();
//     if (!lowerCasedTerm) return employee;
//     return employee.filter((emp) => {
//       const nameMatch = emp.username.toLowerCase().includes(lowerCasedTerm);
//       const roleMatch = emp.role.toLowerCase().includes(lowerCasedTerm);
//       const deptMatch = emp.departmentId?.name
//         ?.toLowerCase()
//         .includes(lowerCasedTerm);
//       return nameMatch || roleMatch || deptMatch;
//     });
//   }, [searchTerm, employee]);

//   // Memorize suggestions generation
//   const searchSuggestions = useMemo(() => {
//     if (!searchTerm) return [];

//     const lowerCasedTerm = searchTerm.toLowerCase();
//     const suggestions = new Set();

//     employee.forEach((emp) => {
//       // Suggest employee names
//       if (emp.username.toLowerCase().includes(lowerCasedTerm)) {
//         suggestions.add(emp.username);
//       }
//       // Suggest roles
//       if (emp.role.toLowerCase().includes(lowerCasedTerm)) {
//         suggestions.add(emp.role);
//       }
//       // Suggest departments
//       if (emp.departmentId?.name.toLowerCase().includes(lowerCasedTerm)) {
//         suggestions.add(emp.departmentId.name);
//       }
//     });

//     return Array.from(suggestions).slice(0, 10); // Return top 10 suggestions
//   }, [searchTerm, employee]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const clearSearchTerm = () => {
//     setSearchTerm("");
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setSearchTerm(suggestion);
//     setShowSuggestions(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = {
//         ...formData,
//         role: selectedRoles.value,
//         departmentId: selectedDept.value,
//         organizationId: user.organizationId,
//       };

//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/employee`,
//         payload,
//         {
//           withCredentials: true,
//         }
//       );

//       toast.success("Employee created successfully");
//       setFormData({ username: "", email: "", contactNo: "" });
//       setSelectedDept(null);
//       setSelectedRoles(null);
//       setOpen(false);

//       const newEmployee = res.data;

//       // Add to state only if not already present
//       setEmployee((prevEmployee) => {
//         const exists = prevEmployee.some((emp) => emp._id === newEmployee._id);
//         if (!exists) {
//           const updated = [newEmployee, ...prevEmployee];
//           return updated;
//         }
//         return prevEmployee;
//       });
//     } catch (err) {
//       console.error(err);

//       // Check for duplicate email error
//       if (
//         err?.response?.data?.message?.includes("already registered") ||
//         err?.response?.data?.message?.includes("duplicate")
//       ) {
//         hotToast.error("⚠️ This email is already registered!");
//       } else {
//         toast.error("Something went wrong while creating the employee");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAllEmployee = async (e) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/employee`,
//         {
//           withCredentials: true,
//         }
//       );

//       setLoading(false);
//       setEmployee(res.data);
//     } catch (error) {
//       console.log("Error fetching employee", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${import.meta.env.VITE_API_URL}/api/employee/${id}`, {
//         withCredentials: true,
//       });
//       toast("Employee deleted successfully");
//       setEmployee((prev) => prev.filter((emp) => emp._id !== id));
//     } catch (error) {
//       console.log(error);
//       alert(error?.response?.data?.message || "Delete failed");
//     }
//   };

//   useEffect(() => {
//     getAllEmployee();
//   }, []);

//   useEffect(() => {
//     if (!user?.organizationId) return;

//     const handleConnect = () => {
//       socket.emit("joinOrgRoom", user.organizationId);
//     };

//     const handleStatusUpdate = ({ userId, status }) => {
//       console.log("📬 Status update received:", userId, status);
//       setEmployee((prev) =>
//         prev.map((emp) => (emp._id === userId ? { ...emp, status } : emp))
//       );
//     };

//     socket.on("connect", handleConnect);
//     socket.on("statusUpdate", handleStatusUpdate);

//     // If socket is already connected, manually call it
//     if (socket.connected) handleConnect();

//     return () => {
//       socket.off("connect", handleConnect);
//       socket.off("statusUpdate", handleStatusUpdate);
//     };
//   }, [user.organizationId]);

//   return (
//     <div className="w-full h-full p-5">
//       <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
//         <div className="relative w-full max-w-md">
//           <div className="flex items-center justify-between gap-2 rounded-full bg-[#121212]">
//             <input
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onFocus={() => setShowSuggestions(true)} // NEW: Show suggestions on focus
//               // NEW: Hide suggestions on blur with a small delay to allow clicking
//               onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
//               className="w-full bg-transparent py-2 placeholder:text-gray-400 rounded-l-full text-white outline-none px-4"
//               type={"text"}
//               placeholder={"Search by name, role, or department..."}
//               autoComplete="off" // NEW: Prevent browser's default autocomplete
//             />
//             <div className="flex items-center justify-center gap-2">
//               {searchTerm?.length > 0 && (
//                 <button onClick={clearSearchTerm}>
//                   <RxCross1 color="white" />
//                 </button>
//               )}
//               <button className="bg-[#222222] px-4 py-2.5 rounded-r-full">
//                 <IoSearch color="white" size={20} />
//               </button>
//             </div>
//           </div>
//           {/* Suggestion Dropdown */}
//           {showSuggestions && searchSuggestions.length > 0 && (
//             <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
//               {searchSuggestions.map((suggestion, index) => (
//                 <li
//                   key={index}
//                   className="px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-100"
//                   // Use onMouseDown to prevent the onBlur from firing first
//                   onMouseDown={() => handleSuggestionClick(suggestion)}
//                 >
//                   {suggestion}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className="flex items-center justify-between gap-2">
//           {user.role === "Boss" && (
//             <Dialog open={open} onOpenChange={setOpen}>
//               <DialogTrigger asChild>
//                 <Button className="bg-slate-200 text-black hover:text-white rounded-md cursor-pointer">
//                   <MdOutlineCreate />
//                   Create
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[500px]">
//                 <DialogHeader>
//                   <DialogTitle>Create New Employee</DialogTitle>
//                   <DialogDescription>
//                     Fill in the details to add a new employee.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <form className="space-y-4" onSubmit={handleSubmit}>
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     placeholder="Full Name"
//                     className="w-full border px-3 py-2 rounded-md"
//                   />
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Email"
//                     className="w-full border px-3 py-2 rounded-md"
//                   />
//                   <input
//                     type="text"
//                     name="contactNo"
//                     value={formData.contactNo}
//                     onChange={handleChange}
//                     placeholder="Contact Number"
//                     className="w-full border px-3 py-2 rounded-md"
//                   />
//                   <DeptOption
//                     selectedDept={selectedDept}
//                     setSelectedDept={setSelectedDept}
//                   />
//                   <RoleSelect
//                     selectedRoles={selectedRoles}
//                     setSelectedRoles={setSelectedRoles}
//                   />
//                   <Button type="submit" className="w-full">
//                     {loading ? "Creating..." : "Create Employee"}
//                   </Button>
//                 </form>
//               </DialogContent>
//             </Dialog>
//           )}
//           <DropdownMenu>
//             <DropdownMenuTrigger>
//               <Button variant="outline" className={"cursor-pointer"}>
//                 <FaFilter className="mr-2" />
//                 Filter
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start">
//               <DropdownMenuGroup>
//                 <DropdownMenuItem>Active</DropdownMenuItem>
//                 <DropdownMenuItem>Inactive</DropdownMenuItem>
//                 <DropdownMenuItem>On Leave</DropdownMenuItem>
//               </DropdownMenuGroup>
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <Button
//             onClick={getAllEmployee}
//             variant={"ghost"}
//             className={"cursor-pointer"}
//           >
//             <RefreshCcw /> Refresh
//           </Button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center h-full gap-3">
//           <p className="text-lg">Loading employee data</p>
//           <span className="loading loading-dots loading-xl"></span>
//         </div>
//       ) : (
//         <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-5">
//           {employee.length > 0 && filteredEmployees === 0 ? (
//             <p className="text-gray-500 text-center col-span-full">
//               No employees found.
//             </p>
//           ) : filteredEmployees.length === 0 ? (
//             <p className="text-gray-500 text-center col-span-full">
//               No employees found. Please create one.
//             </p>
//           ) : (
//             <>
//               {filteredEmployees
//                 .filter((emp) => emp._id?.toString() !== user._id?.toString())
//                 .map((emp) => {
//                   const initials = emp.username
//                     .split(" ")
//                     .map((word) => word[0])
//                     .join("")
//                     .toUpperCase();

//                   return (
//                     <div
//                       key={emp._id}
//                       className="bg-white rounded-xl shadow-md border p-5 flex justify-between hover:shadow-lg transition duration-300"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="flex-1">
//                           <div className="flex items-center justify-start gap-2">
//                             <div className="bg-slate-200 text-slate-800 font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl">
//                               {initials}
//                             </div>
//                             <h4 className="text-lg font-semibold text-slate-800">
//                               {emp.username}
//                             </h4>
//                           </div>
//                           <div className="py-2">
//                             <p className="text-sm text-gray-500">{emp.email}</p>
//                             <p className="text-sm text-gray-500">
//                               <span className="text-gray-600 font-semibold">
//                                 Department :-
//                               </span>{" "}
//                               {emp.departmentId?.name || "—"}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                               <span className="text-gray-600 font-semibold">
//                                 Role :-
//                               </span>{" "}
//                               {emp.role}
//                             </p>
//                           </div>
//                           <div className="flex items-start justify-start gap-4">
//                             <span className="inline-block mt-1 text-sm font-medium text-green-600 bg-green-100 px-3 py-2 rounded">
//                               {emp.status}
//                             </span>
//                             <Button className={"mt-1 cursor-pointer"}>
//                               Message
//                             </Button>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex flex-col items-start justify-start gap-2">
//                         {user.role === "Boss" && (
//                           <>
//                             <Button
//                               onClick={() => navigate(`/employees/${emp._id}`)}
//                               className={
//                                 "cursor-pointer bg-green-600 hover:bg-green-600 hover:opacity-70"
//                               }
//                             >
//                               <FaUserEdit className="w-4 h-4" />
//                             </Button>
//                             <Dialog>
//                               <DialogTrigger asChild>
//                                 <Button className="bg-red-500 hover:bg-red-600 text-white cursor-pointer w-full">
//                                   <MdDelete className="w-4 h-4" />
//                                 </Button>
//                               </DialogTrigger>
//                               <DialogContent className="sm:max-w-[425px]">
//                                 <DialogHeader>
//                                   <DialogTitle>Delete Employee</DialogTitle>
//                                   <DialogDescription>
//                                     Are you sure you want to delete{" "}
//                                     <span className="font-semibold">{emp.username}</span>? This
//                                     action cannot be undone.
//                                   </DialogDescription>
//                                 </DialogHeader>
//                                 <div className="flex justify-end gap-3 pt-4">
//                                   <DialogTrigger asChild>
//                                       <Button variant="outline">Cancel</Button>
//                                   </DialogTrigger>
//                                   <Button
//                                     variant="destructive"
//                                     onClick={() => handleDelete(emp._id)}
//                                   >
//                                     Delete
//                                   </Button>
//                                 </div>
//                               </DialogContent>
//                             </Dialog>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Employees;

// EmployeesPage.jsx
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

const calculatePercentageChange = (current, previous) => {
  // Check for invalid or zero previous value to avoid division by zero
  if (previous === 0 || !previous || !current) return "N/A";

  const change = ((current - previous) / previous) * 100;
  // Format to two decimal places and prepend '+' for positive change
  return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
};

const EmployeesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contactNo: "",
  });
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  const [employeeCount, setEmployeeCount] = useState(null);
  const [newHiresCount, setNewHiresCount] = useState(0);
  const [yoyGrowthPercentage, setYoYGrowthPercentage] = useState("0.00%");

  const getAllEmployee = async () => {
    setLoading(true);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/employee`,
        {
          withCredentials: true,
        }
      );
      const { employees, stats } = res.data;

      const newHires = employees.filter((employee) => {
        const createdDate = new Date(employee.createdAt);
        return createdDate > sevenDaysAgo;
      });

      setEmployee(employees);
      setEmployeeCount(stats.currentCount);
      setNewHiresCount(newHires.length);

      const yoyPercentage = calculatePercentageChange(
        stats.currentCount,
        stats.lastYearCount
      );
      setYoYGrowthPercentage(yoyPercentage);
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

    console.log(res.data);
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
      setIsCreateDialogOpen(false);

      const newEmployee = res.data;
      setEmployee((prevEmployee) => {
        const exists = prevEmployee.some((emp) => emp._id === newEmployee._id);
        if (!exists) {
          return [newEmployee, ...prevEmployee];
        }
        return prevEmployee;
      });
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

  // Memorize suggestions generation (from old Employees.jsx)
  const searchSuggestions = useMemo(() => {
    if (!searchTerm) return [];

    const lowerCasedTerm = searchTerm.toLowerCase();
    const suggestions = new Set();

    employee.forEach((emp) => {
      if (emp.username.toLowerCase().includes(lowerCasedTerm)) {
        suggestions.add(emp.username);
      }
      if (emp.role.toLowerCase().includes(lowerCasedTerm)) {
        suggestions.add(emp.role);
      }
      if (emp.departmentId?.name.toLowerCase().includes(lowerCasedTerm)) {
        suggestions.add(emp.departmentId.name);
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }, [searchTerm, employee]);

  // --- Effects ---

  useEffect(() => {
    getAllEmployee();
    getDepartmentCount();
  }, []);

  // useEffect(() => {
  //   // Only update if employee is not null/undefined and is an array
  //   if (employee && Array.isArray(employee)) {
  //     setEmployeeCount(employee.length);
  //   }
  // }, [employee]);

  // Socket for real-time updates (from old Employees.jsx)
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

    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("statusUpdate", handleStatusUpdate);
    };
  }, [user.organizationId]);

  // --- JSX Structure ---

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - assuming you have a Sidebar component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
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
                <div className="ml-4 flex items-center lg:ml-0 relative w-64">
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
                      type="search"
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
                  {/* Suggestion Dropdown */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <ul className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
                <button className="flex-shrink-0 p-1 mr-4 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
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
        {/* Main Content */}
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
              {user.role === "Boss" && (
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
                      <RoleSelect
                        selectedRoles={selectedRoles}
                        setSelectedRoles={setSelectedRoles}
                      />
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
          {/* Employee Stats - assuming it fetches real data or you're fine with dummy data */}
          <EmployeeStats
            totalEmployee={employeeCount}
            employeeIncresed={yoyGrowthPercentage}
            newHires={newHiresCount}
          />
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Department Distribution - assuming it fetches real data or you're fine with dummy data */}
            <div className="lg:col-span-1">
              <DepartmentDistribution />
            </div>
            {/* Employee Directory */}
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
                        Filter
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white shadow-lg rounded-md p-1"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                          Inactive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">
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
                filteredEmployees={filteredEmployees}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default EmployeesPage;
