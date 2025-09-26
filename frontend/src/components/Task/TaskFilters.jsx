import React from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  ListIcon,
  FilterIcon,
  UsersIcon,
  CalendarIcon,
  RotateCcw, // Using RotateCcw from lucide-react instead of RefreshCcw
} from "lucide-react";

// Helper component for filter items - keep as provided in the new structure
const FilterItem = ({ icon, label, isActive, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
          isActive
            ? "bg-blue-50 text-blue-700 font-semibold"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center">
          <span
            className={`mr-2 ${isActive ? "text-blue-700" : "text-gray-500"}`}
          >
            {icon}
          </span>
          <span>{label}</span>
        </div>
      </button>
    </li>
  );
};

// Main TaskFilters component
const TaskFilters = ({ activeFilter, setActiveFilter, handleRefresh }) => {
  const handleFilterChange = (filter) => {
    // Map the new component filter key to the old query param filter value
    let filterValue = filter;

    switch (filter) {
      case "all":
        filterValue = "None";
        break;
      case "in-progress":
        filterValue = "In Progress";
        break;
      case "completed":
        filterValue = "Completed";
        break;
      case "overdue":
        filterValue = "Overdue";
        break;
      case "pending":
        filterValue = "Pending";
        break;
      // The new design doesn't directly support priority/date sorting in this sidebar filter style.
      // We'll keep the Status filters for now.
      default:
        filterValue = filter;
        break;
    }

    setActiveFilter(filterValue);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <FilterIcon className="h-5 w-5 mr-2 text-gray-500" />
          Filters
        </h2>
      </div>
      <div className="px-6 py-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
        <ul className="space-y-2">
          {/* Added a general "All" or "None" filter */}
          <FilterItem
            icon={<ListIcon size={18} />}
            label="All Tasks"
            isActive={activeFilter === "None"}
            onClick={() => handleFilterChange("None")}
          />
          <FilterItem
            icon={<ClockIcon size={18} />}
            label="In Progress"
            isActive={activeFilter === "In Progress"}
            onClick={() => handleFilterChange("In Progress")}
          />
          <FilterItem
            icon={<CheckCircleIcon size={18} />}
            label="Completed"
            isActive={activeFilter === "Completed"}
            onClick={() => handleFilterChange("Completed")}
          />
          <FilterItem
            icon={<AlertCircleIcon size={18} />}
            label="Overdue"
            isActive={activeFilter === "Overdue"}
            onClick={() => handleFilterChange("Overdue")}
          />
          <FilterItem
            icon={<ClockIcon size={18} />}
            label="Pending"
            isActive={activeFilter === "Pending"}
            onClick={() => handleFilterChange("Pending")}
          />
        </ul>
      </div>
      {/* Keeping the filter structure for clarity, but the original component didn't use Assignee/Tags/DueDate in this way */}
      <div className="px-6 py-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Priority</h3>
        <ul className="space-y-2">
          <FilterItem
            icon={<AlertCircleIcon size={18} />}
            label="High Priority"
            isActive={activeFilter === "High priority to Low"}
            onClick={() => handleFilterChange("High priority to Low")}
          />
          <FilterItem
            icon={<ClockIcon size={18} />}
            label="Low Priority"
            isActive={activeFilter === "Low priority to High"}
            onClick={() => handleFilterChange("Low priority to High")}
          />
        </ul>
      </div>

      <div className="px-6 py-4 border-t border-gray-200">
        <button
          onClick={handleRefresh}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh Tasks
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
