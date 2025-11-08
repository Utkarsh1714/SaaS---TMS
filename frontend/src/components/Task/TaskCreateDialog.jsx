import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeptOption from "../DeptOption";
import { MdDeleteForever, MdOutlineCreate } from "react-icons/md";
import { PlusIcon } from "lucide-react";

const TaskCreateDialog = ({
  open,
  setOpen,
  taskData,
  setTaskData,
  selectedDepartment,
  setSelectedDepartment,
  hasManager,
  setHasManager,
  mileStoneInput,
  setMileStoneInput,
  handleCreateTask,
  loading,
  toast,
}) => {
  const handleMilestoneAdd = () => {
    if (mileStoneInput.trim()) {
      setTaskData((prev) => ({
        ...prev,
        milestones: [
          ...prev.milestones,
          { title: mileStoneInput.trim(), completed: false },
        ],
      }));
      setMileStoneInput("");
    }
  };

  const handleMilestoneDelete = (index) => {
    const updatedMilestones = taskData.milestones.filter((_, i) => i !== index);
    setTaskData({
      ...taskData,
      milestones: updatedMilestones,
    });
  };

  const handleDepartmentChange = (dept) => {
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
  };

  const isFormInvalid =
    !taskData?.title ||
    !taskData?.description ||
    !taskData?.deadline ||
    !taskData?.department ||
    !hasManager;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Task
        </button>
      </DialogTrigger>
      <DialogContent
        className={"sm:max-w-[500px] max-h-[90vh] overflow-y-scroll"}
      >
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task.
          </DialogDescription>
          <form onSubmit={handleCreateTask} className="space-y-4 pt-4">
            <input
              type="text"
              placeholder="Task Title"
              value={taskData?.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Task Description"
              value={taskData?.description}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border rounded min-h-[100px]"
              required
            />
            <DeptOption
              selectedDept={selectedDepartment}
              setSelectedDept={handleDepartmentChange}
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
              value={taskData?.deadline}
              onChange={(e) =>
                setTaskData({ ...taskData, deadline: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
              min={new Date().toISOString().split("T")[0]}
            />
            <select
              value={taskData?.priority}
              onChange={(e) =>
                setTaskData({ ...taskData, priority: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {/* Milestone Input/List */}
            <div className="w-full h-auto flex flex-col items-start justify-start border p-2 rounded">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Milestones (Optional)
              </label>
              <div className="w-full flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add a milestone step..."
                  className="w-full p-2 border rounded text-sm"
                  value={mileStoneInput}
                  onChange={(e) => setMileStoneInput(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleMilestoneAdd}
                  disabled={!mileStoneInput?.trim()}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400"
                >
                  Add
                </Button>
              </div>
              {taskData?.milestones.length > 0 && (
                <div className="w-full max-h-44 overflow-y-scroll mt-2 p-1 border-t border-gray-200">
                  {taskData?.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 text-sm bg-gray-50 rounded mb-1"
                    >
                      <span className="truncate">{milestone.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => handleMilestoneDelete(index)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700 h-6 w-6"
                      >
                        <MdDeleteForever size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isFormInvalid || loading}
              className={`w-full ${
                isFormInvalid
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
  );
};

export default TaskCreateDialog;
