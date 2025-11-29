import React from "react";
import { ChevronRight, Loader2, Users } from "lucide-react";

const DepartmentList = ({ loading, departments, selectedId, onSelect }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
       <div className="p-8 text-center text-slate-500 text-sm">No departments found.</div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {departments.map((dept) => (
        <li key={dept._id}>
          <button
            onClick={() => onSelect(dept._id)}
            className={`w-full text-left px-5 py-4 flex items-center justify-between transition-all duration-200 group
              ${selectedId === dept._id ? "bg-blue-50 border-l-4 border-blue-600 pl-4" : "hover:bg-slate-50 border-l-4 border-transparent"}
            `}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold shrink-0 transition-colors
                 ${selectedId === dept._id ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-600 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200"}
              `}>
                 {dept.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                 <p className={`text-sm font-semibold truncate ${selectedId === dept._id ? "text-blue-900" : "text-slate-900"}`}>
                    {dept.name}
                 </p>
                 <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Users size={12} /> {dept.totalEmployees || 0} Members
                 </p>
              </div>
            </div>
            <ChevronRight size={16} className={`transition-transform ${selectedId === dept._id ? "text-blue-600 translate-x-1" : "text-slate-300 group-hover:text-slate-400"}`} />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default DepartmentList;