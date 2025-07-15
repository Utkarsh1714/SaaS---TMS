import DepartmentSelect from "@/components/DepartmentSelect";
import DeptOption from "@/components/DeptOption";
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
import React, { useEffect, useState } from "react";
import { MdDeleteForever, MdOutlineCreate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [hasManager, setHasManager] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [mileStoneInput, setMileStoneInput] = useState("");
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    department: "",
    assignedManager: "", // You can use a dropdown if needed
    deadline: "",
    priority: "Medium",
    milestones: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      let endpoint = "";

      if (user.role === "Boss") {
        endpoint = `api/task/boss`;
      } else if (user.role === "Manager") {
        endpoint = `api/task/manager`;
      } else {
        endpoint = `api/task/employee`;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/${endpoint}`,
        {
          withCredentials: true,
        }
      );

      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/task/create`,
        taskData,
        { withCredentials: true }
      );
      
      const newTask = res.data.task;

      setTasks((prev) => [newTask, ...prev]);

      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
      setOpen(false);
      setTaskData({
        title: "",
        description: "",
        department: "",
        assignedManager: "",
        deadline: "",
        priority: "Medium",
        milestones: [],
      });
      setSelectedDepartment([]);
      setHasManager(true);
      setMileStoneInput("");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [user]);

  return (
    <div className="w-full h-full p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {user.role === "Boss" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className={"cursor-pointer rounded-md"}>
                <MdOutlineCreate />
                Create task
              </Button>
            </DialogTrigger>
            <DialogContent className={"sm:max-w-[500px]"}>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new task.
                </DialogDescription>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={taskData.title}
                    onChange={(e) =>
                      setTaskData({ ...taskData, title: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                  <textarea
                    placeholder="Task Description"
                    value={taskData.description}
                    onChange={(e) =>
                      setTaskData({ ...taskData, description: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                  <DeptOption
                    selectedDept={selectedDepartment}
                    setSelectedDept={(dept) => {
                      setSelectedDepartment(dept);

                      if (dept?.manager) {
                        setTaskData((prev) => ({
                          ...prev,
                          department: dept.value,
                          assignedManager: dept.manager._id,
                        }));
                        setHasManager(true);
                      } else {
                        setTaskData((prev) => ({
                          ...prev,
                          department: dept.value,
                          assignedManager: "",
                        }));
                        setHasManager(false);
                        toast.warning(
                          "This department does not have a manager assigned. Please assign a manager before creating a task."
                        );
                      }
                    }}
                  />
                  {selectedDepartment?.manager && (
                    <p className="text-md text-yellow-500 mt-1">
                      Manager:{" "}
                      <span className="font-medium">
                        {selectedDepartment.manager.username}
                      </span>
                    </p>
                  )}
                  <input
                    type="date"
                    value={taskData.deadline}
                    onChange={(e) =>
                      setTaskData({ ...taskData, deadline: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <select
                    value={taskData.priority}
                    onChange={(e) =>
                      setTaskData({ ...taskData, priority: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {/* Add mileStone field */}
                  <div className="w-full h-auto flex flex-col items-start justify-start">
                    <div className="w-full flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Milestone (optional)"
                        className="w-full p-2 border rounded"
                        value={mileStoneInput}
                        onChange={(e) => setMileStoneInput(e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (mileStoneInput.trim()) {
                            setTaskData({
                              ...taskData,
                              milestones: [
                                ...taskData.milestones,
                                { title: mileStoneInput, completed: false },
                              ],
                            });
                            setMileStoneInput("");
                          }
                        }}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        Add Milestone
                      </Button>
                    </div>
                    {taskData.milestones.length > 0 && (
                      <div className="w-full max-h-44 overflow-hidden overflow-y-scroll mt-2">
                        {taskData.milestones.map((milestone, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded mb-2"
                          >
                            <span>{milestone.title}</span>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const updatedMilestones =
                                  taskData.milestones.filter(
                                    (_, i) => i !== index
                                  );
                                setTaskData({
                                  ...taskData,
                                  milestones: updatedMilestones,
                                });
                              }}
                            >
                              <MdDeleteForever />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={
                      !taskData.title ||
                      !taskData.description ||
                      !taskData.deadline ||
                      !taskData.department ||
                      !hasManager
                    }
                    className={`w-full ${
                      !taskData.title ||
                      !taskData.description ||
                      !taskData.deadline ||
                      !taskData.department ||
                      !hasManager
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    }`}
                  >
                    {!loading ? "Create Task" : "Creating..."}
                  </Button>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold text-yellow-700">
                {task.title}
              </h2>
              <p className="text-sm text-gray-600">Status: {task.status}</p>
              <p className="text-sm">Deadline: {task.deadline?.slice(0, 10)}</p>
              <p className="text-sm">
                Employees: {task.assignedEmployees?.length || 0}
              </p>

              {/* Show "Add Employee" only if logged-in user is the assignedManager */}
              {user.role === "Manager" && task.assignedManager === user._id && (
                <Button
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate(`/tasks/${task._id}/add-employee`)}
                >
                  + Add Employee
                </Button>
              )}

              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={() => navigate(`/tasks/${task._id}`)}
              >
                View Task
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
