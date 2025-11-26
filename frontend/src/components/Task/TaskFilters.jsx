// import React from "react";
// import {
//   CheckCircleIcon,
//   ClockIcon,
//   AlertCircleIcon,
//   ListIcon,
//   FilterIcon,
//   UsersIcon,
//   CalendarIcon,
//   RotateCcw, // Using RotateCcw from lucide-react instead of RefreshCcw
// } from "lucide-react";

// // Helper component for filter items - keep as provided in the new structure
// const FilterItem = ({ icon, label, isActive, onClick }) => {
//   return (
//     <li>
//       <button
//         onClick={onClick}
//         className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
//           isActive
//             ? "bg-blue-50 text-blue-700 font-semibold"
//             : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//         }`}
//       >
//         <div className="flex items-center">
//           <span
//             className={`mr-2 ${isActive ? "text-blue-700" : "text-gray-500"}`}
//           >
//             {icon}
//           </span>
//           <span>{label}</span>
//         </div>
//       </button>
//     </li>
//   );
// };

// // Main TaskFilters component
// const TaskFilters = ({ activeFilter, setActiveFilter, handleRefresh }) => {
//   const handleFilterChange = (filter) => {
//     // Map the new component filter key to the old query param filter value
//     let filterValue = filter;

//     switch (filter) {
//       case "all":
//         filterValue = "None";
//         break;
//       case "in-progress":
//         filterValue = "In Progress";
//         break;
//       case "completed":
//         filterValue = "Completed";
//         break;
//       case "overdue":
//         filterValue = "Overdue";
//         break;
//       case "pending":
//         filterValue = "Pending";
//         break;
//       // The new design doesn't directly support priority/date sorting in this sidebar filter style.
//       // We'll keep the Status filters for now.
//       default:
//         filterValue = filter;
//         break;
//     }

//     setActiveFilter(filterValue);
//   };

//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h2 className="text-lg font-medium text-gray-900 flex items-center">
//           <FilterIcon className="h-5 w-5 mr-2 text-gray-500" />
//           Filters
//         </h2>
//       </div>
//       <div className="px-6 py-4">
//         <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
//         <ul className="space-y-2">
//           {/* Added a general "All" or "None" filter */}
//           <FilterItem
//             icon={<ListIcon size={18} />}
//             label="All Tasks"
//             isActive={activeFilter === "None"}
//             onClick={() => handleFilterChange("None")}
//           />
//           <FilterItem
//             icon={<ClockIcon size={18} />}
//             label="In Progress"
//             isActive={activeFilter === "In Progress"}
//             onClick={() => handleFilterChange("In Progress")}
//           />
//           <FilterItem
//             icon={<CheckCircleIcon size={18} />}
//             label="Completed"
//             isActive={activeFilter === "Completed"}
//             onClick={() => handleFilterChange("Completed")}
//           />
//           <FilterItem
//             icon={<AlertCircleIcon size={18} />}
//             label="Overdue"
//             isActive={activeFilter === "Overdue"}
//             onClick={() => handleFilterChange("Overdue")}
//           />
//           <FilterItem
//             icon={<ClockIcon size={18} />}
//             label="Pending"
//             isActive={activeFilter === "Pending"}
//             onClick={() => handleFilterChange("Pending")}
//           />
//         </ul>
//       </div>
//       {/* Keeping the filter structure for clarity, but the original component didn't use Assignee/Tags/DueDate in this way */}
//       <div className="px-6 py-4 border-t border-gray-200">
//         <h3 className="text-sm font-medium text-gray-500 mb-3">Priority</h3>
//         <ul className="space-y-2">
//           <FilterItem
//             icon={<AlertCircleIcon size={18} />}
//             label="High Priority"
//             isActive={activeFilter === "High priority to Low"}
//             onClick={() => handleFilterChange("High priority to Low")}
//           />
//           <FilterItem
//             icon={<ClockIcon size={18} />}
//             label="Low Priority"
//             isActive={activeFilter === "Low priority to High"}
//             onClick={() => handleFilterChange("Low priority to High")}
//           />
//         </ul>
//       </div>

//       <div className="px-6 py-4 border-t border-gray-200">
//         <button
//           onClick={handleRefresh}
//           className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100"
//         >
//           <RotateCcw className="h-4 w-4 mr-2" />
//           Refresh Tasks
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskFilters;


import React, { useState, useRef, useEffect } from "react";
import { 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ListFilter, 
  ArrowDownWideNarrow, 
  ArrowUpNarrowWide,
  X,
  Check
} from "lucide-react";

const TaskFilters = ({ activeFilter, setActiveFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setActiveFilter(value);
    setIsOpen(false);
  };

  const FilterOption = ({ label, value, icon, color }) => (
    <button
      onClick={() => handleSelect(value)}
      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all ${
        activeFilter === value 
          ? "bg-blue-50 text-blue-700 font-medium" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`${activeFilter === value ? "text-blue-600" : color || "text-slate-400"}`}>
          {icon}
        </span>
        {label}
      </div>
      {activeFilter === value && <Check size={16} className="text-blue-600" />}
    </button>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all border ${
          activeFilter !== "All"
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
        }`}
      >
        <Filter size={16} />
        <span>Filter</span>
        {activeFilter !== "All" && (
          <span className="flex items-center justify-center bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full ml-1">
            1
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          
          <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter Tasks</span>
            {activeFilter !== "All" && (
                <button 
                    onClick={(e) => { e.stopPropagation(); handleSelect("All"); }}
                    className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                    <X size={12} /> Clear
                </button>
            )}
          </div>

          <div className="space-y-1 py-1">
            <FilterOption label="All Tasks" value="All" icon={<ListFilter size={16}/>} />
          </div>

          <div className="my-2 border-t border-slate-100"></div>
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Status</span>
          
          <div className="space-y-1">
            <FilterOption label="Pending" value="Pending" icon={<Clock size={16}/>} color="text-slate-500" />
            <FilterOption label="In Progress" value="In Progress" icon={<Clock size={16}/>} color="text-amber-500" />
            <FilterOption label="Completed" value="Completed" icon={<CheckCircle2 size={16}/>} color="text-emerald-500" />
            <FilterOption label="Overdue" value="Overdue" icon={<AlertCircle size={16}/>} color="text-rose-500" />
          </div>

          <div className="my-2 border-t border-slate-100"></div>
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Priority</span>

          <div className="space-y-1">
            <FilterOption label="High Priority" value="High" icon={<ArrowUpNarrowWide size={16}/>} color="text-rose-500" />
            <FilterOption label="Medium Priority" value="Medium" icon={<ArrowDownWideNarrow size={16}/>} color="text-amber-500" />
            <FilterOption label="Low Priority" value="Low" icon={<ArrowDownWideNarrow size={16}/>} color="text-emerald-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;