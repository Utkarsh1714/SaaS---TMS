import React, { useState } from "react";
import { Search, User, ChevronRight } from "lucide-react";

const ChatSidebar = ({ employeeList, onSelectChat, activeChatId }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employeeList.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(employeeList);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="Search colleagues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Direct Messages ({filteredEmployees.length})
        </h3>

        <ul className="space-y-1 px-2">
          {filteredEmployees.map((emp) => {
            const isActive = activeChatId === emp._id;

            return (
              <li key={emp._id}>
                <button
                  className={`
                    w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-blue-50 border border-blue-100 shadow-sm"
                        : "hover:bg-slate-50 border border-transparent"
                    }
                  `}
                  onClick={() => onSelectChat(emp)}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {emp.profileImage ? (
                      <div
                        className={`
                      h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                      }
                    `}
                      >
                        <img
                          src={emp.profileImage}
                          alt={emp.firstName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`
                      h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                      }
                    `}
                      >
                        {emp.firstName?.split("")[0].toUpperCase()}
                      </div>
                    )}

                    {/* Online Indicator (Mock) */}
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-emerald-500" />
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isActive ? "text-blue-900" : "text-slate-900"
                      }`}
                    >
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p
                      className={`text-xs truncate ${
                        isActive ? "text-blue-600" : "text-slate-500"
                      }`}
                    >
                      {emp.role?.name || "Employee"}
                    </p>
                  </div>

                  {/* Chevron (Only on hover/active) */}
                  {isActive && (
                    <ChevronRight size={16} className="text-blue-500" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
