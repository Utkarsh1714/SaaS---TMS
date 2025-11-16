import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import {
  PhoneIcon,
  VideoIcon,
  InfoIcon,
  PaperclipIcon,
  SmileIcon,
  SendIcon,
  ImageIcon,
  MicIcon,
  UserIcon,
  ArrowLeftIcon,
  Loader,
} from "lucide-react";

// Receives the full 'chat' object as a prop
const ChatWindow = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const socket = useSocket();
  const scrollRef = useRef(null);

  // Find the other user in the chat to display their info
  // This assumes 'chat.participants' is an array of user objects
  const otherUser = chat.participants.find((p) => p._id !== user._id);

  // 1. Fetch messages for this chat when the component loads (or 'chat' prop changes)
  const fetchMessages = async () => {
    if (!chat) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/chat/${chat._id}`,
        { withCredentials: true }
      );
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [chat]); // Re-fetch when the chat prop changes

  // 2. Listen for incoming messages from the socket
  useEffect(() => {
    if (!socket) return;

    const messageListener = (newMessage) => {
      // Check if the received message belongs to the currently open chat
      if (newMessage.channel === chat._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on("newMessage", messageListener);

    // Cleanup function to remove the listener
    return () => {
      socket.off("newMessage", messageListener);
    };
  }, [socket, chat]);

  // 3. Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    // try {
    //   const { data } = await axios.post(
    //     `${import.meta.env.VITE_API_URL}/api/message`,
    //     {
    //       content: newMessage,
    //       chatId: chat._id,
    //     },
    //     { withCredentials: true }
    //   );

    //   // Emit the new message through the socket
    //   socket.emit('newMessage', data);

    //   // Update our own UI
    //   setMessages([...messages, data]);
    //   setNewMessage('');
    // } catch (error) {
    //   console.error('Error sending message:', error);
    // }

    socket.emit("sendMessage", {
      content: newMessage,
      channelId: chat._id,
    });

    setNewMessage("");
  };

  // 4. Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          {/* NEW: Back Button (Mobile Only) */}
          <button
            onClick={onBack}
            className="mr-2 text-gray-600 hover:text-gray-800 md:hidden"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>

          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <UserIcon className="h-5 w-5" />
          </div>

          {/* User Info */}
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {otherUser?.username || "Chat"}
            </p>
            <p className="text-xs text-gray-500">{otherUser?.status}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <VideoIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <InfoIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* ... (message mapping) ... */}
          {loading && (
            <div className="flex h-full items-center justify-center text-center text-gray-500">
              <Loader className="h-6 w-6 animate-spin mr-2" /> Loading messages...
            </div>
          )}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex max-w-xs lg:max-w-md">
                <div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      msg.sender._id === user._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-center">
          {/* ... (form content) ... */}
          <div className="flex space-x-1">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <PaperclipIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className={`p-2 rounded-full flex items-center justify-center ${
              newMessage.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!newMessage.trim()}
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
