import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit, MdDelete, MdOutlineCreate } from "react-icons/md";
import { FaPlus, FaUserEdit } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import DeptOption from "@/components/DeptOption";
import RoleSelect from "@/components/RoleSelect";
import { toast } from "sonner";

const DepartmentDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(false);

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

      setDepartment((prev) => ({
        ...prev,
        employees: [...prev.employees, newEmployee],
        totalEmployees: prev.totalEmployees + 1,
      }));
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

  useEffect(() => {
    const fetchDept = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/department/details/${id}`,
        { withCredentials: true }
      );
      setDepartment(res.data);
      console.log(res.data);
    };
    fetchDept();
  }, [id]);

  const handleDelete = async (empId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/employee/${empId}`,
        { withCredentials: true }
      );
      setDepartment((prev) => ({
        ...prev,
        employees: prev.employees.filter((e) => e._id !== empId),
        totalEmployees: prev.totalEmployees - 1,
      }));
      setDeleteAlert(false);
    } catch (err) {
      console.error("Failed to delete employee:", err);
    }
  };

  if (!department) return <div>Loading...</div>;

  return (
    <div className="w-full h-full px-5 py-2">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="bg-slate-200 cursor-pointer"
        >
          <IoIosArrowBack className="mr-1" /> Back
        </Button>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className={"cursor-pointer"}
        >
          <MdEdit className="mr-1" /> Edit
        </Button>
      </div>

      {/* Department Info */}
      <div className="w-full flex items-center justify-between pt-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-orange-400">
          {department.name} Department
        </h1>
      </div>
      <div className="w-full flex justify-between flex-col md:flex-row">
        <div className="pt-3">
          <h2 className="font-semibold">
            Manager:{" "}
            <span className="font-normal">
              {department?.manager?.username || "Not assigned"}
            </span>
          </h2>
          <p className="font-semibold">
            Email:{" "}
            <span className="font-normal">
              {department?.manager?.email || "Not assigned"}
            </span>
          </p>
        </div>
        {department.manager ? (
          <div className="flex items-start justify-start gap-2 py-3 md:py-0">
            <Button
              onClick={() => navigate(`/employees/${department.manager.id}`)}
              variant={"outline"}
              className="cursor-pointer bg-orange-400 text-white"
            >
              View Manager
            </Button>
            <Button className={"cursor-pointer"}>Chat with Manager</Button>
          </div>
        ) : (
          ""
        )}
      </div>

      <div>
        <p className="font-semibold">
          Total Employees:{" "}
          <span className="font-normal">
            {department?.totalEmployees || "No employee in this department"}
          </span>
        </p>
      </div>

      {/* Employee List */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-5">
        {department?.employees.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">
            No employees found.
          </p>
        )}

        {department?.employees.map((emp) => {
          const initials = emp.username
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();

          return (
            <div
              key={emp._id}
              className="w-full bg-white rounded-xl shadow-md border p-5 flex justify-between hover:shadow-lg transition duration-300"
            >
              {/* Left - Employee Info */}
              <div className="w-full flex items-center gap-2">
                <div className="w-full">
                  <div className="flex items-start justify-start gap-2">
                    <div className=" bg-slate-200 text-slate-800 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                      {initials}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      {emp.username}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">{emp.email}</p>
                  <p className="text-sm text-gray-500">
                    Role: {emp.role || "—"}
                  </p>
                  <div className="flex items-start justify-start gap-4">
                    <Button
                      onClick={() => navigate("/chat")}
                      className="mt-2 cursor-pointer"
                    >
                      Message
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right - Actions */}
              <div className="flex flex-col items-start justify-start gap-2">
                {user.role === "Boss" && (
                  <>
                    <Button
                      onClick={() => navigate(`/employees/${emp._id}`)}
                      className="cursor-pointer bg-green-600 hover:bg-green-600 hover:opacity-70 text-white"
                    >
                      <FaUserEdit className="w-4 h-4" />
                    </Button>
                    <Dialog open={deleteAlert} onOpenChange={setDeleteAlert}>
                      <DialogTrigger asChild>
                        <Button className="bg-red-500 hover:bg-red-600 text-white cursor-pointer">
                          <MdDelete className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure you want to delete this user?
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-x-3">
                          <Button
                            onClick={() => handleDelete(emp._id)}
                            className="cursor-pointer"
                          >
                            Delete
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteAlert(false)}
                            className="cursor-pointer"
                          >
                            Cancel
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
      </div>

      {/* Add Employee Button at Bottom */}
      {user.role === "Boss" && (
        <div className=" flex justify-center absolute bottom-0 right-0 m-10">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-200 text-black hover:text-white rounded-md cursor-pointer">
                <FaPlus />
                Add Employee
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
        </div>
      )}
    </div>
  );
};

export default DepartmentDetails;
