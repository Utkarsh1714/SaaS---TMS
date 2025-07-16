import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import { toast } from "sonner";

const AddEmpToTaskBtn = ({ taskId, taskData }) => {
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  console.log(taskData)

  // ✅ Extract the specific task based on taskId
  const task = taskData.find((t) => t._id === taskId);
  const assignedEmployeeIds = task?.assignedEmployees?.map((emp) => emp._id) || [];

  // ✅ Filter employees: exclude already assigned
  const filteredEmployees = employees.filter(emp => !assignedEmployeeIds.includes(emp._id));

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/employee`,
        { withCredentials: true }
      );
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleAdd = (id) => {
    setSelectedEmployees((prev) => [...prev, id]);
  };

  const handleRemove = (id) => {
    setSelectedEmployees((prev) => prev.filter((empId) => empId !== id));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (selectedEmployees.length === 0) {
      toast.warning("Please select at least one employee to add.");
      return;
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/task/${taskId}/employees/add`,
        { employeeIds: selectedEmployees },
        { withCredentials: true }
      );

      toast.success("Employees added to task successfully!");
      setAddEmployeeOpen(false);
      setSelectedEmployees([]);
    } catch (error) {
      console.error("Error adding employees to task:", error);
      toast.error("Failed to add employees to task.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full">
          <IoMdAdd /> Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-[600px] max-h-[80vh]"}>
        <DialogHeader>
          <DialogTitle>Add employees to the task</DialogTitle>
          <DialogDescription>
            Please select the employees from below.
          </DialogDescription>
          <form onSubmit={handleAddEmployee}>
            <ul className="space-y-3 mt-4 max-h-[50vh] overflow-y-auto">
              {filteredEmployees.map((emp) => {
                const isSelected = selectedEmployees.includes(emp._id);
                return (
                  <li
                    key={emp._id}
                    className="border rounded px-4 py-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{emp.username}</p>
                      <p className="text-sm text-gray-500">{emp.email}</p>
                      <p className="text-sm text-gray-400">
                        Role: {emp.role} | Dept: {emp.departmentId?.name}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant={isSelected ? "destructive" : "default"}
                      onClick={() =>
                        isSelected
                          ? handleRemove(emp._id)
                          : handleAdd(emp._id)
                      }
                    >
                      {isSelected ? "Remove" : "Add"}
                    </Button>
                  </li>
                );
              })}
            </ul>
            <Button type="submit" className="mt-6 w-full">
              Assign Selected Employees
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default AddEmpToTaskBtn;