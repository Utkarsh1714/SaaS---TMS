import AddEmpToTaskBtn from "@/components/AddEmpToTaskBtn";
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
import { IoSearch } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { MdDelete, MdDeleteForever, MdOutlineCreate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DESCRIPTION_CHAR_LIMIT = 15;
const TITLE_CHAR_LIMIT = 10;

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [open, setOpen] = useState(false);
  const [hasManager, setHasManager] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [mileStoneInput, setMileStoneInput] = useState("");
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    department: "",
    assignedManager: "",
    deadline: "",
    priority: "Medium",
    milestones: [],
    organizationId: ""
  });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("None");
  const [originalTasks, setOriginalTasks] = useState([]);
  const navigate = useNavigate();

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
      setOriginalTasks(res.data);
      console.log(originalTasks);
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

    // const payload = {
    //   ...taskData,
    //   organizationId: user.organizationId,
    // };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/task/create`,
        taskData,
        { withCredentials: true }
      );

      const newTask = res.data.task;

      setTasks((prev) => [newTask, ...prev]);
      setOriginalTasks((prev) => [newTask, ...prev]);

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
        milestones: []
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
    setSearchTerm("");
    fetchTasks("None");
    toast.success("Tasks refreshed successfully!");
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    fetchTasks(filter);
  };

  const clearSearchTerm = () => {
    setSearchTerm("");
  };

  const getNoTasksMessage = () => {
    if (activeFilter === "None") {
      return "No tasks are available at the moment. Kindly check again later !";
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

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setTasks(originalTasks);
      return;
    }

    const filteredTasks = originalTasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTasks(filteredTasks);

    if (filteredTasks.length === 0) {
      toast.warning(`No task found for department: "${searchTerm}`);
    } else {
      toast.success(`Found ${filteredTasks.length} task(s).`);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchTasks(activeFilter);
    console.log(tasks);
  }, [user, activeFilter, navigate]);

  useEffect(() => {
    console.log("Original Tasks State:", originalTasks);
  }, [originalTasks]);

  return (
    <div className="w-full h-full p-5">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-5">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center justify-between gap-2 rounded-full bg-[#121212]">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={
                "w-full py-2 placeholder:text-gray-200 rounded-l-full text-white outline-none px-4"
              }
              type={"text"}
              placeholder={"Search..."}
            />
            <div className="flex items-center justify-center gap-2">
              {searchTerm?.length > 0 && (
                <button onClick={clearSearchTerm}>
                  <RxCross1 color="white" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="bg-[#222222] px-4 py-2.5 rounded-r-full"
              >
                <IoSearch color="white" size={20} />
              </button>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className={"cursor-pointer"}>
                <FaFilter />
                Filter
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
        </div>
        <div className="flex items-start justify-start gap-2">
          <div>
            {user.role === "Boss" && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className={"cursor-pointer rounded-md"}>
                    <MdOutlineCreate />
                    Create<span className="hidden md:block">task</span>
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
          <div>
            <Button
              onClick={handleRefresh}
              variant={"ghost"}
              className={"cursor-pointer"}
            >
              <RefreshCcw /> <span className="hidden md:block">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full gap-3">
          <p className="text-lg">Loading task data</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      ) : (
        <>
          {tasks.length === 0 ? (
            <div className="w-full text-center pt-56">
              <p className="text-gray-500">{getNoTasksMessage()}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tasks.map((task) => {
                const isDescriptionLong =
                  task.description.length > DESCRIPTION_CHAR_LIMIT;

                const displayDescription = isDescriptionLong
                  ? task.description.substring(0, DESCRIPTION_CHAR_LIMIT) +
                    "..."
                  : task.description;

                const displayTitle =
                  task.title.length > TITLE_CHAR_LIMIT
                    ? task.title.substring(0, TITLE_CHAR_LIMIT) + "..."
                    : task.title;

                return (
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
                        {/* Displaying title with simple truncation */}
                        <h2 className="text-2xl font-bold text-slate-700">
                          {displayTitle}
                        </h2>
                        {/* Displaying description with '... More' button to navigate */}
                        <p className="text-md font-semibold text-gray-600 mb-2">
                          {displayDescription}
                          {isDescriptionLong && (
                            <span
                              onClick={() => navigate(`/tasks/${task._id}`)}
                              className="text-blue-500 cursor-pointer ml-1 font-normal" // Added font-normal to make 'More' less bold than description text itself
                            >
                              view
                            </span>
                          )}
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
                        <span className="font-semibold">Assigned to</span> :-{" "}
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

                      {/* The "View Task" button is now potentially redundant if "More" handles navigation */}
                      {/* You might want to remove this if "More" is the primary navigation method */}
                      <div className="w-full flex items-center justify-between">
                        <Button
                          variant="outline"
                          className="cursor-pointer w-[85%] shadow-xl hover:shadow-gray-400 hover:shadow-lg hover:scale-3d duration-150 ease-in-out"
                          onClick={() => navigate(`/tasks/${task._id}`)}
                        >
                          View Task
                        </Button>
                        <Button
                          variant="outline"
                          className="cursor-pointer shadow-xl bg-red-500 text-white hover:shadow-gray-400 hover:shadow-lg hover:scale-3d duration-150 ease-in-out"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <MdDelete />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tasks;
