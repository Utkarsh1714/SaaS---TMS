// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import { BellDot, BellIcon, UserIcon } from 'lucide-react';
// import Sidebar from '@/components/Layout/Sidebar';
// import { useSocket } from '@/context/SocketContext';
// import { useAuth } from '@/context/AuthContext';
// import ChatSidebar from '@/components/Chat/ChatSidebar';
// import ChatWindow from '@/components/Chat/ChatWindow';
// import { useNotifications } from '@/context/NotificationContext';
// import NotificationPanel from '@/components/Dashboard/NotificationPanel';

// const Chat = () => {
//   const { toggleNotificationPanel, notifications } = useNotifications();

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const socket = useSocket();
//   const { user } = useAuth();

//   const fetchAllEmployee = async () => {
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/employee/all-employee`,
//         { withCredentials: true }
//       );
//       // Filter out the currently logged-in user from the list
//       const filteredEmployees = res.data.filter(
//         (emp) => emp._id !== user._id
//       );
//       setEmployeeList(filteredEmployees);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const handleSelectedChat = async (employee) => {
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/chat`,
//         { userId: employee._id }, // Send the ID of the user we want to chat with
//         { withCredentials: true }
//       );
//       setSelectedChat(res.data); // Set the full chat object
//     } catch (error) {
//       console.error('Error accessing or creating chat:', error);
//     }
//   };

//   const handleBack = () => {
//     setSelectedChat(null);
//   };

//   useEffect(() => {
//     if (selectedChat && socket) {
//       socket.emit('joinChat', selectedChat._id);
//     }
//   }, [selectedChat, socket]);

//   useEffect(() => {
//     if (user?._id) {
//       fetchAllEmployee();
//     }
//   }, [user]);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar (Existing) */}
//       {/* On mobile, we hide the main sidebar if a chat is selected */}
//       <div
//         className={`${
//           selectedChat ? 'hidden' : 'flex'
//         } md:flex h-full`}
//       >
//         <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Navigation */}
//         {/* On mobile, we hide the top navigation if a chat is selected */}
//         <header
//           className={`${
//             selectedChat ? 'hidden' : 'block'
//           } bg-white shadow-sm z-10 md:block`}
//         >
//           <div className="px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between h-16">
//               <div className="flex">
//                 <button
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                   className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
//                 >
//                   <svg
//                     className="h-6 w-6"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 6h16M4 12h16M4 18h7"
//                     />
//                   </svg>
//                 </button>
//                 <div className="ml-4 flex items-center lg:ml-0">
//                   <h1 className="text-lg font-medium text-gray-900">
//                     Messages
//                   </h1>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <button
//                   onClick={toggleNotificationPanel}
//                   className="flex-shrink-0 p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <span className="sr-only">View notifications</span>
//                   {notifications && notifications.length > 0 ? (
//                     <BellDot className="text-green-500" />
//                   ) : (
//                     <BellIcon className="text-gray-400" />
//                   )}
//                 </button>
//                 <div className="ml-3 relative">
//                   <div>
//                     <button className="flex items-center max-w-xs bg-gray-100 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                       <span className="sr-only">Open user menu</span>
//                       <UserIcon className="h-8 w-8 rounded-full p-1" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* NEW RESPONSIVE LAYOUT
//           - On mobile (default):
//             - If 'selectedChat' is null, 'ChatSidebar' is visible (w-full).
//             - If 'selectedChat' is NOT null, 'ChatWindow' is visible (w-full).
//           - On desktop (md: and up):
//             - Both are visible side-by-side.
//         */}
//         <main className="flex-1 flex overflow-hidden">
//           {/* Chat Sidebar */}
//           <div
//             className={`${
//               selectedChat ? 'hidden' : 'flex'
//             } w-full flex-col md:flex md:w-80 md:flex-shrink-0`}
//           >
//             <ChatSidebar
//               employeeList={employeeList}
//               onSelectChat={handleSelectedChat}
//               activeChatId={selectedChat?._id}
//             />
//           </div>

//           {/* Chat Window (or placeholder) */}
//           <div
//             className={`${
//               selectedChat ? 'flex' : 'hidden'
//             } w-full flex-col flex-1 md:flex`}
//           >
//             {selectedChat ? (
//               <ChatWindow
//                 key={selectedChat._id}
//                 chat={selectedChat}
//                 onBack={handleBack} // Pass the back function
//               />
//             ) : (
//               <div className="flex-1 flex items-center justify-center bg-gray-50">
//                 <p className="text-gray-500 text-lg">
//                   Select a conversation to start messaging 💬
//                 </p>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//       <NotificationPanel />
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, Menu, MessageSquare } from "lucide-react";

// Components
import Sidebar from "@/components/Layout/Sidebar";
import ChatSidebar from "@/components/Chat/ChatSidebar";
import ChatWindow from "@/components/Chat/ChatWindow";
import NotificationPanel from "@/components/Dashboard/NotificationPanel";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import SEO from "@/components/SEO";

const Chat = () => {
  const { toggleNotificationPanel, notifications } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Main App Sidebar
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const socket = useSocket();
  const { user } = useAuth();

  // Fetch Employees
  useEffect(() => {
    const fetchAllEmployee = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/employee/all-employee`,
          { withCredentials: true }
        );
        const filteredEmployees = res.data.filter(
          (emp) => emp._id !== user._id
        );
        setEmployeeList(filteredEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchAllEmployee();
  }, [user]);

  // Join Socket Room
  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit("joinChat", selectedChat._id);
    }
  }, [selectedChat, socket]);

  const handleSelectedChat = async (employee) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        { userId: employee._id },
        { withCredentials: true }
      );
      setSelectedChat(res.data);
    } catch (error) {
      console.error("Error accessing chat:", error);
    }
  };

  return (
    <>
      <SEO
        title="Team Chat & Collaboration"
        description="Real-time secure messaging for your organization. Collaborate on tasks, share files, and discuss projects instantly with Taskify."
        keywords="team chat, enterprise messaging, work collaboration, slack alternative, taskify chat"
      />
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
        {/* Main App Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col h-full relative">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="text-blue-600" size={24} /> Messages
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleNotificationPanel}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Bell size={22} />
                {notifications?.length > 0 && (
                  <span className="absolute top-1.5 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
              </button>
            </div>
          </header>

          {/* Chat Content Area */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Contact List Sidebar */}
            <div
              className={`
              absolute inset-0 z-10 bg-white md:static md:w-80 md:border-r border-slate-200 transition-transform duration-300
              ${
                selectedChat
                  ? "-translate-x-full md:translate-x-0"
                  : "translate-x-0"
              }
            `}
            >
              <ChatSidebar
                employeeList={employeeList}
                onSelectChat={handleSelectedChat}
                activeChatId={selectedChat?._id}
              />
            </div>

            {/* Conversation Window */}
            <div className="flex-1 flex flex-col w-full bg-slate-50 h-full relative">
              {selectedChat ? (
                <ChatWindow
                  key={selectedChat._id}
                  chat={selectedChat}
                  onBack={() => setSelectedChat(null)}
                />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>

        <NotificationPanel />
      </div>
    </>
  );
};

// Sub-component for empty state
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-0 md:opacity-100 transition-opacity duration-500">
    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
      <MessageSquare className="h-10 w-10 text-blue-500" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Messages</h3>
    <p className="text-slate-500 max-w-sm">
      Select a colleague from the sidebar to start collaborating, sharing files,
      and discussing projects.
    </p>
  </div>
);

export default Chat;
