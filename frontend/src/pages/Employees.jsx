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
import { useEffect, useState } from "react";
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

const Employees = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contactNo: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          const updated = [...prevEmployee, newEmployee];
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
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/employee`,
        {
          withCredentials: true,
        }
      );

      setEmployee(res.data);
    } catch (error) {
      console.log("Error fetching employee", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/employee/${id}`, {
        withCredentials: true,
      });

      setDeleteAlert(false);
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
      console.log("🔗 Socket connected:", socket.id);
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
      <div className="w-full flex items-end justify-end gap-4">
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

      {/* Employee List */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-5">
        {employee.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">
            No employees found.
          </p>
        )}

        {/* Card One */}
        {employee
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
                className="bg-white rounded-xl shadow-md border p-5 flex flex-col gap-3 hover:shadow-lg transition duration-300 relative"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-200 text-slate-800 font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl">
                    {initials}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {emp.username}
                    </h3>
                    <p className="text-sm text-gray-500">{emp.email}</p>
                    <p className="text-sm text-gray-500">
                      Department: {emp.departmentId?.name || "—"}
                    </p>
                    <p className="text-sm text-gray-500">Role: {emp.role}</p>
                    <div className="flex items-start justify-start gap-4">
                      <span className="inline-block mt-1 text-sm font-medium text-green-600 bg-green-100 px-3 py-2 rounded">
                        {emp.status}
                      </span>
                      <Button className={"mt-1 cursor-pointer"}>Message</Button>
                    </div>
                  </div>
                </div>

                {user.role === "Boss" && (
                  <Dialog open={deleteAlert} onOpenChange={setDeleteAlert}>
                    <DialogTrigger asChild>
                      <Button className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white cursor-pointer">
                        <MdDelete className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>
                          Are you sure you want to delete this user?
                        </DialogTitle>
                      </DialogHeader>
                      <div>
                        <Button
                          onClick={() => handleDelete(emp._id)}
                          className={"cursor-pointer"}
                        >
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Employees;
