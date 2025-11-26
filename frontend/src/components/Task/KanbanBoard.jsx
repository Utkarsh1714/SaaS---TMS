import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  DragOverlay, // 👈 Import this
  defaultDropAnimationSideEffects, 
} from "@dnd-kit/core";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal, Calendar } from "lucide-react";

// Column Definitions
const columns = [
  { id: "Pending", title: "To Do", color: "bg-slate-100 border-slate-200" },
  { id: "In Progress", title: "In Progress", color: "bg-blue-50 border-blue-100" },
  { id: "Completed", title: "Done", color: "bg-emerald-50 border-emerald-100" },
  { id: "Overdue", title: "Overdue", color: "bg-rose-50 border-rose-100" },
];

const KanbanBoard = ({ tasks, onUpdateStatus, navigate }) => {
  // State to track the specific task currently being dragged
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // Prevent accidental drags
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // Reset active task immediately
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    let newStatus = over.id;

    const isColumn = columns.some((col) => col.id === over.id);

    if (!isColumn) {
      const overTask = tasks.find((t) => t._id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      } else {
        return;
      }
    }

    const currentTask = tasks.find((t) => t._id === taskId);
    if (currentTask && currentTask.status !== newStatus) {
      onUpdateStatus(taskId, newStatus);
    }
  };

  // Smooth drop animation configuration
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart} // 👈 Track start
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col lg:flex-row h-full gap-6 overflow-x-auto pb-4 items-start">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            tasks={tasks.filter((t) => t.status === col.id)}
            navigate={navigate}
          />
        ))}
      </div>

      {/* The DragOverlay renders the card UNDER the cursor. 
         It sits outside the normal document flow (via Portal).
      */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <TaskCard task={activeTask} isOverlay />
        ) : null}
      </DragOverlay>

    </DndContext>
  );
};

const KanbanColumn = ({ id, title, tasks, color, navigate }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] w-full lg:w-auto rounded-2xl border ${color} p-4 flex flex-col h-full max-h-[calc(100vh-220px)]`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          {title}
          <span className="bg-white px-2 py-0.5 rounded-full text-xs border shadow-sm">
            {tasks.length}
          </span>
        </h3>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {tasks.map((task) => (
          <SortableTaskItem key={task._id} task={task} navigate={navigate} />
        ))}
        {tasks.length === 0 && (
            <div className="h-24 border-2 border-dashed border-slate-300/50 rounded-xl flex items-center justify-center text-slate-400 text-xs italic">
                Drop here
            </div>
        )}
      </div>
    </div>
  );
};

// Wrapper that adds Sortable logic to the Card
const SortableTaskItem = ({ task, navigate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // We use this to hide the original while dragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Dim the original card while dragging
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={() => navigate(`/tasks/${task._id}`)} />
    </div>
  );
};

// --- PURE UI COMPONENT (The Card Design) ---
// Separated so we can reuse it in the Overlay without the Sortable logic
const TaskCard = ({ task, onClick, isOverlay }) => {
  const getPriorityColor = (p) => {
    if (p === "High") return "text-rose-600 bg-rose-50 border-rose-100";
    if (p === "Medium") return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-emerald-600 bg-emerald-50 border-emerald-100";
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white p-4 rounded-xl border border-slate-200 shadow-sm 
        group relative transition-all
        ${!isOverlay ? "hover:shadow-md hover:-translate-y-1 cursor-grab active:cursor-grabbing" : "cursor-grabbing shadow-2xl scale-105 rotate-2 ring-2 ring-blue-500 ring-offset-2"}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
        {task.deadline && (
          <span
            className={`text-xs font-medium flex items-center gap-1 ${
              new Date(task.deadline) < new Date()
                ? "text-rose-500"
                : "text-slate-400"
            }`}
          >
            <Calendar size={12} />
            {new Date(task.deadline).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      <h4 className="font-semibold text-slate-800 mb-1 line-clamp-2 text-sm">
        {task.title}
      </h4>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
        {task.description}
      </p>

      <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            {task.assignedManager?.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <span className="text-xs text-slate-500 truncate max-w-[80px]">
            {task.assignedManager?.username}
          </span>
        </div>
        <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 truncate max-w-[80px]">
          {task.department?.name || "General"}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;