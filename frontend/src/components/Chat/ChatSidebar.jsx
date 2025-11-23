// import React, { useState } from 'react';
// import { SearchIcon, PlusIcon, UserIcon } from 'lucide-react';

// // Renamed props to be clearer
// const ChatSidebar = ({ employeeList, onSelectChat, activeChatId }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   // Use the employeeList prop instead of the hardcoded 'chats' array
//   const filteredEmployees = employeeList.filter((emp) =>
//     emp.username.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="w-full md:w-80 border-r border-gray-200 bg-white flex-shrink-0 flex flex-col h-full">
//       <div className="px-4 py-4 border-b border-gray-200">
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <SearchIcon className="h-4 w-4 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             placeholder="Search employees..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="mt-4 flex justify-between items-center">
//           {/* These buttons are for filtering, you can wire them up later */}
//           <div>
//             <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               All Employees
//             </button>
//           </div>
//           <button className="inline-flex items-center p-1 border border-transparent text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//             <PlusIcon className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//       <ul className="divide-y divide-gray-200 flex-1 overflow-y-auto">
//         {filteredEmployees.map((emp) => (
//           <li key={emp._id}>
//             <button
//               className={`w-full px-4 py-3 flex items-center hover:bg-gray-50 focus:outline-none ${
//                 activeChatId === emp._id ? 'bg-blue-50' : '' // Highlight if active
//               }`}
//               onClick={() => onSelectChat(emp)} // Use the passed-in handler
//             >
//               <div className="relative flex-shrink-0">
//                 {/* TODO: Replace with emp.profilePic if available */}
//                 <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
//                   <UserIcon className="h-5 w-5" />
//                 </div>
//                 {/* You can add online status logic here later */}
//                 {/* <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400" /> */}
//               </div>
//               <div className="ml-3 flex-1 overflow-hidden">
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium text-gray-900 truncate">
//                     {emp.username}
//                   </p>
//                   {/* 'time' is removed as it wasn't in the employee list */}
//                 </div>
//                 <div className="flex items-center justify-between mt-1">
//                   <p className="text-xs text-gray-500 truncate">
//                     {emp.email} {/* Or emp.role, or any other detail */}
//                   </p>
//                   {/* 'unread' count removed as it wasn't in the employee list */}
//                 </div>
//               </div>
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ChatSidebar;




import React, { useState } from 'react';
import { Search, User, ChevronRight } from 'lucide-react';

const ChatSidebar = ({ employeeList, onSelectChat, activeChatId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employeeList.filter((emp) =>
    emp.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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
                    ${isActive 
                      ? 'bg-blue-50 border border-blue-100 shadow-sm' 
                      : 'hover:bg-slate-50 border border-transparent'
                    }
                  `}
                  onClick={() => onSelectChat(emp)}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold
                      ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'}
                    `}>
                      {emp.username.charAt(0).toUpperCase()}
                    </div>
                    {/* Online Indicator (Mock) */}
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-emerald-500" />
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-blue-900' : 'text-slate-900'}`}>
                      {emp.username}
                    </p>
                    <p className={`text-xs truncate ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                      {emp.role?.name || 'Employee'}
                    </p>
                  </div>

                  {/* Chevron (Only on hover/active) */}
                  {isActive && <ChevronRight size={16} className="text-blue-500" />}
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