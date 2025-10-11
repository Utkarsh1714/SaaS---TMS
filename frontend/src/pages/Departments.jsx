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
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdOutlineCreate } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Departments = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

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
        { name },
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
    <div className="w-full h-[90vh] px-4 py-5">
      <div className="w-full flex items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <div className="flex items-center justify-between gap-2 rounded-full bg-[#121212]">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)} // NEW: Show suggestions on focus
              // NEW: Hide suggestions on blur with a small delay to allow clicking
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="w-full py-2 placeholder:text-gray-200 rounded-l-full text-white outline-none px-4"
              type={"text"}
              placeholder={"Search..."}
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
          {showSuggestions && searchTerm && filteredDepartments.length > 0 && (
            <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredDepartments.map((dept) => (
                <li
                  key={dept._id}
                  className="px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-100"
                  // Use onMouseDown to prevent the onBlur from firing first
                  onMouseDown={() => handleSuggestionClick(dept.name)}
                >
                  {dept.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
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
                    placeholder="Department Name"
                    className="w-full border px-3 py-2 rounded-md"
                  />
                  <Button type="submit" className="w-full">
                    {loading ? "Creating..." : "Create Department"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
          <Button
            onClick={() => fetchDepartmentDetails()}
            variant={"ghost"}
            className={"cursor-pointer"}
          >
            <RefreshCcw /> <span className="hidden sm:flex">Refresh</span>
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-full gap-3">
          <p className="text-lg">Loading departments data</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      ) : (
        <>
          {departments.length > 0 && filteredDepartments.length === 0 ? (
            <p>No department found. Please create an department!</p>
          ) : filteredDepartments.length === 0 ? (
            <p className="text-center mt-10">
              No departments exist. Please create one!
            </p>
          ) : (
            <div className="Departments-cards w-full grid sm:grid-cols-2 md:grid-cols-2 gap-4 mt-6">
              {filteredDepartments.map((dept) => (
                <div
                  key={dept._id}
                  className="p-4 bg-white shadow-md rounded-lg flex items-center justify-between gap-0.5"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-black">
                      {dept.name}
                    </h2>
                    <div className="mt-2 text-gray-700 text-sm space-y-1">
                      <p>
                        <span className="font-medium">Manager:</span>{" "}
                        {dept.manager ? dept.manager.username : "Not assigned"}
                      </p>
                      {dept.manager?.email && (
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {dept.manager ? dept.manager.email : ""}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Total Employees:</span>{" "}
                        {dept.totalEmployees}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start justify-start">
                    <Button
                      onClick={() => navigate(`/departments/${dept._id}`)}
                      className={
                        "cursor-pointer bg-green-600 hover:bg-green-600 hover:opacity-70 w-full"
                      }
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Departments;
