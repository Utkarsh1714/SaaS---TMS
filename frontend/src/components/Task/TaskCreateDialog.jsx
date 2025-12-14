// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import DeptOption from "../DeptOption"; // Assuming this component exists
// import { Plus, X, Trash2, Calendar, Flag, Layers } from "lucide-react";

// const TaskCreateDialog = ({
//   open,
//   setOpen,
//   taskData,
//   setTaskData,
//   selectedDepartment,
//   setSelectedDepartment,
//   hasManager,
//   setHasManager,
//   mileStoneInput,
//   setMileStoneInput,
//   handleCreateTask,
//   loading,
//   toast,
// }) => {
  
//   // Handlers
//   const handleMilestoneAdd = () => {
//     if (mileStoneInput.trim()) {
//       setTaskData((prev) => ({
//         ...prev,
//         milestones: [...prev.milestones, { title: mileStoneInput.trim(), completed: false }],
//       }));
//       setMileStoneInput("");
//     }
//   };

//   const handleMilestoneDelete = (index) => {
//     const updated = taskData.milestones.filter((_, i) => i !== index);
//     setTaskData({ ...taskData, milestones: updated });
//   };

//   const handleDepartmentChange = (dept) => {
//     setSelectedDepartment(dept);
//     if (dept?.manager) {
//       setTaskData((prev) => ({
//         ...prev,
//         department: dept.value,
//         assignedManager: dept.manager._id,
//       }));
//       setHasManager(true);
//     } else {
//       setTaskData((prev) => ({ ...prev, department: dept.value, assignedManager: "" }));
//       setHasManager(false);
//       toast.warning("This department has no manager assigned.");
//     }
//   };

//   const isFormInvalid = !taskData?.title || !taskData?.description || !taskData?.deadline || !taskData?.department || !hasManager;

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95">
//           <Plus size={18} /> New Task
//         </button>
//       </DialogTrigger>
      
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white p-0 gap-0 rounded-2xl border-slate-200 shadow-2xl">
//         <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
//           <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
//              <Layers className="text-blue-600" size={20} /> Create New Task
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleCreateTask} className="p-6 space-y-5">
          
//           {/* Title Input */}
//           <div className="space-y-1.5">
//              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Title</label>
//              <input
//                 type="text"
//                 placeholder="e.g. Redesign Homepage"
//                 value={taskData?.title}
//                 onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
//                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                 required
//              />
//           </div>

//           {/* Description */}
//           <div className="space-y-1.5">
//              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
//              <textarea
//                 placeholder="Add details about the task..."
//                 value={taskData?.description}
//                 onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
//                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
//                 required
//              />
//           </div>

//           {/* Grid for Selectors */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//              {/* Department */}
//              <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
//                 <DeptOption
//                    selectedDept={selectedDepartment}
//                    setSelectedDept={handleDepartmentChange}
//                 />
//                 {selectedDepartment?.manager && (
//                    <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
//                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
//                       Manager: {selectedDepartment.manager.firstName}
//                    </p>
//                 )}
//              </div>

//              {/* Priority */}
//              <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
//                    <Flag size={12}/> Priority
//                 </label>
//                 <select
//                    value={taskData?.priority}
//                    onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
//                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
//                 >
//                    <option value="Low">Low Priority</option>
//                    <option value="Medium">Medium Priority</option>
//                    <option value="High">High Priority</option>
//                 </select>
//              </div>

//              {/* Deadline */}
//              <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
//                    <Calendar size={12}/> Due Date
//                 </label>
//                 <input
//                    type="date"
//                    value={taskData?.deadline}
//                    onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
//                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
//                    required
//                    min={new Date().toISOString().split("T")[0]}
//                 />
//              </div>
//           </div>

//           {/* Milestones Section */}
//           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
//              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Milestones (Optional)</label>
             
//              <div className="flex gap-2 mb-3">
//                 <input
//                    type="text"
//                    placeholder="Add a step..."
//                    className="flex-1 p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
//                    value={mileStoneInput}
//                    onChange={(e) => setMileStoneInput(e.target.value)}
//                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleMilestoneAdd())}
//                 />
//                 <button
//                    type="button"
//                    onClick={handleMilestoneAdd}
//                    disabled={!mileStoneInput.trim()}
//                    className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 disabled:opacity-50 transition-colors"
//                 >
//                    <Plus size={18} />
//                 </button>
//              </div>

//              {/* List */}
//              {taskData?.milestones.length > 0 && (
//                 <div className="space-y-2 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
//                    {taskData.milestones.map((ms, idx) => (
//                       <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
//                          <span className="text-sm text-slate-700 truncate flex-1">{ms.title}</span>
//                          <button
//                             type="button"
//                             onClick={() => handleMilestoneDelete(idx)}
//                             className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 transition-colors"
//                          >
//                             <Trash2 size={14} />
//                          </button>
//                       </div>
//                    ))}
//                 </div>
//              )}
//           </div>

//           {/* Submit Button */}
//           <div className="pt-2">
//              <Button
//                 type="submit"
//                 disabled={isFormInvalid || loading}
//                 className={`w-full h-11 font-bold rounded-xl transition-all ${
//                    isFormInvalid 
//                    ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
//                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
//                 }`}
//              >
//                 {loading ? "Creating Task..." : "Create Task"}
//              </Button>
//           </div>

//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default TaskCreateDialog;




import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeptOption from "../DeptOption"; 
import { Plus, Trash2, Calendar, Flag, Layers, CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext"; // <--- 1. Import Hook

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
  handleCreateTask, // This is the API handler from parent
  loading,
  toast,
}) => {
  
  const { addNotification } = useNotifications(); // <--- 2. Get function

  // --- Handlers ---

  const handleMilestoneAdd = () => {
    if (mileStoneInput.trim()) {
      setTaskData((prev) => ({
        ...prev,
        milestones: [...prev.milestones, { title: mileStoneInput.trim(), completed: false }],
      }));
      setMileStoneInput("");
    }
  };

  const handleMilestoneDelete = (index) => {
    const updated = taskData.milestones.filter((_, i) => i !== index);
    setTaskData({ ...taskData, milestones: updated });
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
      setTaskData((prev) => ({ ...prev, department: dept.value, assignedManager: "" }));
      setHasManager(false);
      toast.warning("This department has no manager assigned.");
    }
  };

  // --- 3. Wrapper Submit Handler ---
  const onSubmitWrapper = async (e) => {
    e.preventDefault();
    
    // validation
    if (!taskData?.title || !taskData?.department || !hasManager) {
        toast.error("Please fill in all required fields correctly.");
        return;
    }

    try {
        // Await the parent's API call
        await handleCreateTask(e);

        // ✅ Add Notification to History
        addNotification({
            title: "Task Created",
            message: `Task "${taskData.title}" was successfully assigned to ${selectedDepartment?.label}.`,
            type: "task", // You can style this icon in NotificationPanel
            timestamp: new Date().toISOString(),
            meta: { department: selectedDepartment?.label }
        });

    } catch (error) {
        console.error("Task creation failed", error);
        // Toast is likely handled in parent, but safety check here
    }
  };

  const isFormInvalid = !taskData?.title || !taskData?.description || !taskData?.deadline || !taskData?.department || !hasManager;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 text-sm">
          <Plus size={18} /> New Task
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white p-0 gap-0 rounded-2xl border-slate-200 shadow-2xl">
        <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Layers size={20} /> 
             </div>
             Create New Task
          </DialogTitle>
        </DialogHeader>

        {/* Use the wrapper handler */}
        <form onSubmit={onSubmitWrapper} className="p-6 space-y-5">
          
          {/* Title Input */}
          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Title <span className="text-rose-500">*</span></label>
             <input
                type="text"
                placeholder="e.g. Redesign Homepage"
                value={taskData?.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                required
             />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description <span className="text-rose-500">*</span></label>
             <textarea
                placeholder="Add details about the task..."
                value={taskData?.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
                required
             />
          </div>

          {/* Grid for Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
             {/* Department */}
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department <span className="text-rose-500">*</span></label>
                <DeptOption
                   selectedDept={selectedDepartment}
                   setSelectedDept={handleDepartmentChange}
                />
                {selectedDepartment?.manager ? (
                   <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5 font-bold bg-emerald-50 px-2 py-1 rounded-md w-fit">
                      <CheckCircle2 size={12}/> Manager: {selectedDepartment.manager.firstName}
                   </p>
                ) : selectedDepartment && (
                   <p className="text-xs text-rose-500 mt-1 font-medium">No manager assigned.</p>
                )}
             </div>

             {/* Priority */}
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                   <Flag size={12}/> Priority
                </label>
                <div className="relative">
                    <select
                        value={taskData?.priority}
                        onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
                    >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                </div>
             </div>

             {/* Deadline */}
             <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                   <Calendar size={12}/> Due Date <span className="text-rose-500">*</span>
                </label>
                <input
                   type="date"
                   value={taskData?.deadline}
                   onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
                   className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                   required
                   min={new Date().toISOString().split("T")[0]}
                />
             </div>
          </div>

          {/* Milestones Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Milestones (Optional)</label>
             
             <div className="flex gap-2 mb-3">
                <input
                   type="text"
                   placeholder="Add a sub-task or milestone..."
                   className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
                   value={mileStoneInput}
                   onChange={(e) => setMileStoneInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleMilestoneAdd())}
                />
                <button
                   type="button"
                   onClick={handleMilestoneAdd}
                   disabled={!mileStoneInput.trim()}
                   className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 hover:text-blue-600 disabled:opacity-50 transition-all active:scale-95"
                >
                   <Plus size={18} />
                </button>
             </div>

             {/* List */}
             {taskData?.milestones.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                   {taskData.milestones.map((ms, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm animate-in slide-in-from-bottom-2 fade-in duration-300">
                         <div className="flex items-center gap-2 overflow-hidden">
                            <span className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">{idx + 1}</span>
                            <span className="text-sm text-slate-700 truncate">{ms.title}</span>
                         </div>
                         <button
                            type="button"
                            onClick={() => handleMilestoneDelete(idx)}
                            className="text-slate-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
                         >
                            <Trash2 size={16} />
                         </button>
                      </div>
                   ))}
                </div>
             ) : (
                <p className="text-xs text-slate-400 text-center py-2 italic">No milestones added yet.</p>
             )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
             <Button
                type="submit"
                disabled={isFormInvalid || loading}
                className={`w-full h-12 font-bold rounded-xl text-base transition-all ${
                   isFormInvalid 
                   ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                   : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-95"
                }`}
             >
                {loading ? "Creating Task..." : "Create Task"}
             </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreateDialog;