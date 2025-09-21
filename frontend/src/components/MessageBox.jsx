import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { SendHorizonal } from "lucide-react";

const MessageBox = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  
  const socket = useSocket();
  const { user: loggedInUser } = useAuth();

  const messagesEndRef = useRef(null);

  // Fetch messages when the chat changes
  useEffect(() => {
    if (!chat?._id) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/message/${chat._id}`,
          { withCredentials: true }
        );
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chat]);

  // Listen for new incoming messages
  useEffect(() => {
    if (!socket || !chat) return;
    const messageListener = (incomingMessage) => {
      if (incomingMessage.channel === chat._id) {
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      }
    };
    socket.on("newMessage", messageListener);
    return () => {
      socket.off("newMessage", messageListener);
    };
  }, [socket, chat]);

  // Auto-scroll to the bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!loggedInUser)
    return <div className="p-4 text-center">Authenticating...</div>;

  if (!chat)
    return (
      <div className="p-4 text-center">Select a chat to start messaging.</div>
    );

  const recipient = chat.participants.find((p) => p._id !== loggedInUser._id);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && socket.connected && chat) {
      const data = {
        channelId: chat._id,
        content: newMessage,
      };
      socket.emit("sendMessage", data);
      setNewMessage("");
    } else {
      console.error(
        "Message not sent. Socket disconnected or data is missing."
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border-2 shadow-md">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b rounded-t-lg bg-gray-50">
        <img
          src="https://images.unsplash.com/photo-1732492211688-b1984227af93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
          alt="Recipient"
          className="w-10 h-10 rounded-full mr-3"
        />
        <h2 className="font-bold text-lg">{recipient?.username || "Chat"}</h2>
      </div>

      {/* Message Display Area */}
      <div className="flex-grow p-4 overflow-y-auto" ref={messagesEndRef}>
        {loading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex mb-4 ${
                msg.sender._id === loggedInUser._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-3 max-w-xs rounded-xl ${
                  msg.sender._id === loggedInUser._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="font-medium">{msg.sender.username}</p>
                <p>{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!socket || !socket.connected}
            className="flex-grow border rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              !socket || !socket.connected
                ? "Connecting..."
                : "Type a message..."
            }
          />
          <button
            type="submit"
            disabled={!socket || !socket.connected}
            className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            <SendHorizonal size={24} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageBox;
