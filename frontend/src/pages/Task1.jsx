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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { VscSettings } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import './Tasks.css'
import { MoreHorizontal } from "lucide-react";

const Task1 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [hasManager, setHasManager] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [mileStoneInput, setMileStoneInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("None");

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    department: "",
    assignedManager: "",
    deadline: "",
    priority: "Medium",
    milestones: [],
  });

  // Fetch task function
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
        case "Pending":
          queryParams = "?status=Pending";
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
      // REMOVED: Initialization of showFullDescription state
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create task function
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

  // Delete task funtion
  const handleDeleteTask = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/task/${id}`,
        { withCredentials: true }
      );
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setLoading(false);
      toast.success("Task deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete the task. Please try again later");
      console.error("Failed to delete the task", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = (e) => {
    e.preventDefault();
    setActiveFilter("None");
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

  const getNoTasksMessage = () => {
    if (activeFilter === "None") {
      return "No tasks available.";
    } else if (activeFilter === "Completed") {
      return "No tasks found with the status 'Completed'.";
    } else if (activeFilter === "In Progress") {
      return "No tasks found with the status 'In Progress'.";
    } else if (activeFilter === "Overdue") {
      return "No tasks found that are 'Overdue'.";
    } else if (activeFilter === "Pending") {
      return "No tasks found with the status 'Pending'.";
    } else if (activeFilter.includes("priority")) {
      // Catches both Low/High priority filters
      return `No tasks found when filtered by '${activeFilter}'.`;
    } else if (activeFilter.includes("Created")) {
      // Catches Recently/Oldest created
      return `No tasks found when filtered by '${activeFilter}'.`;
    }
    return "No tasks available for this filter."; // Fallback message
  };

  return (
    <div className="w-full h-full px-3 py-5">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center justify-center gap-1.5">
          <Input
            placeholder="Find tasks..."
            className={"bg-[#363636] text-white placeholder:text-gray-300"}
          />
          <Button className={"hidden sm:flex"}>
            <VscSettings />
            Status
          </Button>
          <Button className={"hidden sm:flex"}>
            <VscSettings />
            Priority
          </Button>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Button className={"bg-slate-200 text-black hidden sm:flex"}>
            <MdDeleteSweep />
            Delete
          </Button>
          <Button className={"sm:hidden"}>
            <VscSettings />
          </Button>
          {user.role === "Boss" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className={"cursor-pointer rounded-md"}>
                  <IoMdAddCircleOutline />
                  Add Task
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
        </div>
      </div>
    </div>
  );
};

export default Task1;
