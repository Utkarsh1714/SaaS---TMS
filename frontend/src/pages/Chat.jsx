import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BellDot, BellIcon, UserIcon } from 'lucide-react';
import Sidebar from '@/components/Layout/Sidebar';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import ChatSidebar from '@/components/Chat/ChatSidebar';
import ChatWindow from '@/components/Chat/ChatWindow';
import { useNotifications } from '@/context/NotificationContext';
import NotificationPanel from '@/components/Dashboard/NotificationPanel';

const Chat = () => {
  const { toggleNotificationPanel, notifications } = useNotifications();

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
                <button
                  onClick={toggleNotificationPanel}
                  className="flex-shrink-0 p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">View notifications</span>
                  {notifications && notifications.length > 0 ? (
                    <BellDot className="text-green-500" />
                  ) : (
                    <BellIcon className="text-gray-400" />
                  )}
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
      <NotificationPanel />
    </div>
  );
};

export default Chat;