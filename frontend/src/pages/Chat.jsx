// import MessageBox from "@/components/MessageBox";
// import { useAuth } from "@/context/AuthContext";
// import { useSocket } from "@/context/SocketContext";
// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const Chat = () => {
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
//       const filteredEmployees = res.data.filter(
//         (emp) => emp._id !== user._id
//       );
//       setEmployeeList(filteredEmployees);
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//     }
//   };

//   const handleSelectedChat = async (employee) => {
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/chat`,
//         { userId: employee._id },
//         { withCredentials: true }
//       );
//       setSelectedChat(res.data);
//     } catch (error) {
//       console.error("Error accessing or creating chat:", error);
//     }
//   };

//   useEffect(() => {
//     if (selectedChat && socket) {
//       socket.emit("joinChat", selectedChat._id);
//     }
//   }, [selectedChat, socket]);


//   useEffect(() => {
//     fetchAllEmployee();
//   }, []);

//   return (
//     <div className="w-full h-full hide-scroll px-4 flex flex-col">
//       <div className="w-full px-3 py-5">
//         <div className="flex items-center justify-start gap-3 overflow-x-scroll">
//           {employeeList.map((emp) => (
//             <div
//               key={emp._id}
//               onClick={() => handleSelectedChat(emp)}
//               className="flex flex-col items-center justify-center cursor-pointer"
//             >
//               <div className="w-20 h-20 border-2 rounded-full p-0.5 bg-gradient-to-r from-[#d62976] to-[#fa7e1e]">
//                 <img
//                   src="https://images.unsplash.com/photo-1732492211688-b1984227af93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
//                   alt="profile_img"
//                   className="w-full h-full rounded-full object-cover flex items-center justify-center"
//                 />
//               </div>
//               <div>
//                 <h1 className="font-medium text-sm">
//                   {emp?.username.split(" ")[0]}
//                 </h1>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="w-full h-[650px] sm:h-[500px] border-t-2 pt-5">
//         {/* Conditionally render the MessageBox component */}
//         {selectedChat ? (
//           <MessageBox chat={selectedChat} />
//         ) : (
//           <div className="flex items-center justify-center pt-40">
//             <h2 className="text-gray-500 text-lg">
//               Select a conversation to start messaging 💬
//             </h2>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Icons (keep existing)
import { BellIcon, UserIcon } from 'lucide-react';
import Sidebar from '@/components/Layout/Sidebar';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import ChatSidebar from '@/components/Chat/ChatSidebar';
import ChatWindow from '@/components/Chat/ChatWindow';

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [employeeList, setEmployeeList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const socket = useSocket();
  const { user } = useAuth();

  const fetchAllEmployee = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/employee/all-employee`,
        { withCredentials: true }
      );
      // Filter out the currently logged-in user from the list
      const filteredEmployees = res.data.filter(
        (emp) => emp._id !== user._id
      );
      setEmployeeList(filteredEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSelectedChat = async (employee) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        { userId: employee._id }, // Send the ID of the user we want to chat with
        { withCredentials: true }
      );
      setSelectedChat(res.data); // Set the full chat object
    } catch (error) {
      console.error('Error accessing or creating chat:', error);
    }
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  useEffect(() => {
    if (selectedChat && socket) {
      socket.emit('joinChat', selectedChat._id);
    }
  }, [selectedChat, socket]);

  useEffect(() => {
    if (user?._id) {
      fetchAllEmployee();
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (Existing) */}
      {/* On mobile, we hide the main sidebar if a chat is selected */}
      <div
        className={`${
          selectedChat ? 'hidden' : 'flex'
        } md:flex h-full`}
      >
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        {/* On mobile, we hide the top navigation if a chat is selected */}
        <header
          className={`${
            selectedChat ? 'hidden' : 'block'
          } bg-white shadow-sm z-10 md:block`}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </button>
                <div className="ml-4 flex items-center lg:ml-0">
                  <h1 className="text-lg font-medium text-gray-900">
                    Messages
                  </h1>
                </div>
              </div>
              <div className="flex items-center">
                <button className="flex-shrink-0 p-1 mr-4 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                </button>
                <div className="ml-3 relative">
                  <div>
                    <button className="flex items-center max-w-xs bg-gray-100 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <span className="sr-only">Open user menu</span>
                      <UserIcon className="h-8 w-8 rounded-full p-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* NEW RESPONSIVE LAYOUT
          - On mobile (default):
            - If 'selectedChat' is null, 'ChatSidebar' is visible (w-full).
            - If 'selectedChat' is NOT null, 'ChatWindow' is visible (w-full).
          - On desktop (md: and up):
            - Both are visible side-by-side.
        */}
        <main className="flex-1 flex overflow-hidden">
          {/* Chat Sidebar */}
          <div
            className={`${
              selectedChat ? 'hidden' : 'flex'
            } w-full flex-col md:flex md:w-80 md:flex-shrink-0`}
          >
            <ChatSidebar
              employeeList={employeeList}
              onSelectChat={handleSelectedChat}
              activeChatId={selectedChat?._id}
            />
          </div>

          {/* Chat Window (or placeholder) */}
          <div
            className={`${
              selectedChat ? 'flex' : 'hidden'
            } w-full flex-col flex-1 md:flex`}
          >
            {selectedChat ? (
              <ChatWindow
                key={selectedChat._id}
                chat={selectedChat}
                onBack={handleBack} // Pass the back function
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg">
                  Select a conversation to start messaging 💬
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;