import AddEmpToTaskBtn from "@/components/AddEmpToTaskBtn";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
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
  const [activeFilter, setActiveFilter] = useState("None");
  const navigate = useNavigate();

  const fetchTasks = async (filter = "None") => {
    try {
      let endpoint = "";
      let queryParams = "";

      if (user.role === "Boss") {
        endpoint = `api/task/boss`;
      } else if (user.role === "Manager") {
        endpoint = `api/task/manager`;
      } else {
        endpoint = `api/task/employee`;
      }

      // Construct query parameters based on the active filter
      switch (filter) {
        case "Low priority to High":
          queryParams = "?sort=priority&order=asc";
          break;
        case "High priority to Low":
          queryParams = "?sort=priority&order=desc";
          break;
        case "Recently Created":
          queryParams = "?sort=createdAt&order=desc";
          break;
        case "Oldest Created":
          queryParams = "?sort=createdAt&order=asc";
          break;
        case "In Progress":
          queryParams = "?status=In Progress";
          break;
        case "Completed":
          queryParams = "?status=Completed";
          break;
        case "Overdue":
          queryParams = "?status=Overdue";
          break;
        default:
          queryParams = ""; // No filter applied
          break;
      }

      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/${endpoint}${queryParams}`,
        {
          withCredentials: true,
        }
      );

      setLoading(false);
      setTasks(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
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

  const handleRefresh = (e) => {
    e.preventDefault();
    setActiveFilter("None"); // Reset filter on refresh
    fetchTasks("None");
    toast.success("Tasks refreshed successfully!");
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    fetchTasks(filter);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchTasks(activeFilter);
  }, [user, activeFilter, navigate]);

  // Helper function to get the appropriate "No tasks" message
  const getNoTasksMessage = () => {
    if (activeFilter === "None") {
      toast.error("No tasks available.")
      return "No tasks available.";
    } else if (activeFilter === "Completed") {
      toast.error("No tasks found with the status 'Completed'.")
      return "No tasks found with the status 'Completed'.";
    } else if (activeFilter === "In Progress") {
      toast.error("No tasks found with the status 'In Progress'.")
      return "No tasks found with the status 'In Progress'.";
    } else if (activeFilter === "Overdue") {
      toast.error("No tasks found that are 'Overdue'.")
      return "No tasks found that are 'Overdue'.";
    } else if (activeFilter.includes("priority")) {
      toast.error(`No tasks found when filtered by '${activeFilter}'.`)
      // Catches both Low/High priority filters
      return `No tasks found when filtered by '${activeFilter}'.`;
    } else if (activeFilter.includes("Created")) {
      // Catches Recently/Oldest created
      return `No tasks found when filtered by '${activeFilter}'.`;
    }
    toast.error("No tasks available for this filter.")
    return "No tasks available for this filter."; // Fallback message
  };

  return (
    <div className="w-full h-full p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center justify-center space-x-3">
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
                        setTaskData({
                          ...taskData,
                          description: e.target.value,
                        })
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className={"cursor-pointer"}>
                <FaFilter className="mr-2" />
                Filter {activeFilter !== "None" ? activeFilter : ""}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("Low priority to High")}
                >
                  Low priority to High
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("High priority to Low")}
                >
                  High priority to Low
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("Recently Created")}
                >
                  Recently Created
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("Oldest Created")}
                >
                  Oldest Created
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("Pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("In Progress")}
                >
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("Completed")}
                >
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("Overdue")}>
                  Overdue
                </DropdownMenuItem>
                {activeFilter !== "None" && (
                  <DropdownMenuItem onClick={() => handleFilterChange("None")}>
                    Clear Filter
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={handleRefresh}
            variant={"ghost"}
            className={"cursor-pointer"}
          >
            <RefreshCcw /> Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full gap-3">
          <p className="text-lg">Loading task</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      ) : (
        <>
          {tasks.length === 0 ? (
            <p className="text-gray-500">{getNoTasksMessage()}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="relative p-4 border rounded-r-lg shadow-sm bg-white hover:shadow-xl hover:scale-3d duration-150 ease-in-out"
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 rounded ${
                      task.priority === "High"
                        ? "bg-red-600"
                        : task.priority === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-700">
                        {task.title}
                      </h2>
                      <p className="text-xl font-semibold text-gray-600">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[
                        ...Array(
                          task.priority === "High"
                            ? 3
                            : task.priority === "Medium"
                            ? 2
                            : 1
                        ),
                      ].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-2xl">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {user.role !== "Manager" && (
                    <h4 className={`text-md mt-2 text-gray-600`}>
                      <span className="font-semibold">Assigned manager</span> :-{" "}
                      {task.assignedManager?.username}
                    </h4>
                  )}

                  <div className="w-full flex items-center justify-between gap-5">
                    <p className="text-md text-gray-600">
                      <span className="font-semibold">Deadline :- </span>{" "}
                      {task.deadline?.slice(0, 10)}
                    </p>
                    <p>
                      Priority :-{" "}
                      <span
                        className={`${
                          task.priority === "High"
                            ? "text-red-600"
                            : task.priority === "Medium"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 mt-4">
                    {user.role === "Manager" &&
                      task.assignedManager?._id === user._id && (
                        <AddEmpToTaskBtn taskId={task._id} taskData={tasks} />
                      )}

                    <Button
                      variant="default"
                      className={`w-full cursor-pointer ${
                        task.status === "In Progress"
                          ? "bg-yellow-500 hover:bg-yellow-500/65 hover:text-white"
                          : task.status === "Completed"
                          ? "bg-green-500 hover:bg-green-500/65 hover:text-white"
                          : ""
                      }`}
                    >
                      {task.status}
                    </Button>

                    <Button
                      variant="outline"
                      className="cursor-pointer w-full shadow-xl hover:shadow-gray-400 hover:shadow-lg hover:scale-3d duration-150 ease-in-out"
                      onClick={() => navigate(`/tasks/${task._id}`)}
                    >
                      View Task
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

export default Tasks;
