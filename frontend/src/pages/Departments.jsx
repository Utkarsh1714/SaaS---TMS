import DeptOption from "@/components/DeptOption";
import RoleSelect from "@/components/RoleSelect";
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
import React, { useEffect, useState } from "react";
import { MdOutlineCreate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Departments = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();

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
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/department/${id}`,
      { withCredentials: true }
    );

    toast.success("Department deleted successfully");
    setDeleteOpen(!deleteOpen);
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
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Departments</h1>
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
            <RefreshCcw /> Refresh
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
          {departments.length === 0 ? (
            <p>No department found. Please create an department!</p>
          ) : (
            <div className="Departments-cards w-full grid sm:grid-cols-2 md:grid-cols-2 gap-4 mt-6">
              {departments.map((dept) => (
                <div
                  key={dept._id}
                  className="p-4 bg-white shadow-md rounded-lg flex items-center justify-between gap-0.5"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-600">
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
                  <div className="flex items-center justify-center flex-col gap-2">
                    <Button
                      onClick={() => navigate(`/departments/${dept._id}`)}
                      className={
                        "cursor-pointer bg-green-600 hover:bg-green-600 hover:opacity-70 w-full"
                      }
                    >
                      Edit
                    </Button>
                    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                      <DialogTrigger asChild>
                        <Button className="cursor-pointer bg-red-600 w-full">
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Delete Department</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete the department?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-end justify-end gap-4">
                          <Button
                            onClick={() => setDeleteOpen(!deleteOpen)}
                            className={
                              "cursor-pointer bg-red-600 hover:bg-red-600 hover:opacity-60"
                            }
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleDelete(dept._id)}
                            className={"cursor-pointer"}
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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
