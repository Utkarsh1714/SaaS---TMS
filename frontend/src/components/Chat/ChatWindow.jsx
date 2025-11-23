// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import { useSocket } from "@/context/SocketContext";
// import {
//   PhoneIcon,
//   VideoIcon,
//   InfoIcon,
//   PaperclipIcon,
//   SmileIcon,
//   SendIcon,
//   ImageIcon,
//   MicIcon,
//   UserIcon,
//   ArrowLeftIcon,
//   Loader,
// } from "lucide-react";

// // Receives the full 'chat' object as a prop
// const ChatWindow = ({ chat, onBack }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth();
//   const socket = useSocket();
//   const scrollRef = useRef(null);

//   // Find the other user in the chat to display their info
//   // This assumes 'chat.participants' is an array of user objects
//   const otherUser = chat.participants.find((p) => p._id !== user._id);

//   // 1. Fetch messages for this chat when the component loads (or 'chat' prop changes)
//   const fetchMessages = async () => {
//     if (!chat) return;
//     setLoading(true);
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/chat/${chat._id}`,
//         { withCredentials: true }
//       );
//       setMessages(data);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, [chat]); // Re-fetch when the chat prop changes

//   // 2. Listen for incoming messages from the socket
//   useEffect(() => {
//     if (!socket) return;

//     const messageListener = (newMessage) => {
//       // Check if the received message belongs to the currently open chat
//       if (newMessage.channel === chat._id) {
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       }
//     };

//     socket.on("newMessage", messageListener);

//     // Cleanup function to remove the listener
//     return () => {
//       socket.off("newMessage", messageListener);
//     };
//   }, [socket, chat]);

//   // 3. Handle sending a new message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !socket) return;

//     // try {
//     //   const { data } = await axios.post(
//     //     `${import.meta.env.VITE_API_URL}/api/message`,
//     //     {
//     //       content: newMessage,
//     //       chatId: chat._id,
//     //     },
//     //     { withCredentials: true }
//     //   );

//     //   // Emit the new message through the socket
//     //   socket.emit('newMessage', data);

//     //   // Update our own UI
//     //   setMessages([...messages, data]);
//     //   setNewMessage('');
//     // } catch (error) {
//     //   console.error('Error sending message:', error);
//     // }

//     socket.emit("sendMessage", {
//       content: newMessage,
//       channelId: chat._id,
//     });

//     setNewMessage("");
//   };

//   // 4. Auto-scroll to the bottom when new messages arrive
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="flex-1 flex flex-col bg-white h-full">
//       {/* Chat Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
//         <div className="flex items-center">
//           <button
//             onClick={onBack}
//             className="mr-2 text-gray-600 hover:text-gray-800 md:hidden"
//           >
//             <ArrowLeftIcon className="h-6 w-6" />
//           </button>

//           <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
//             <UserIcon className="h-5 w-5" />
//           </div>

//           <div className="ml-3">
//             <p className="text-sm font-medium text-gray-900">
//               {otherUser?.username || "Chat"}
//             </p>
//             <p className="text-xs text-gray-500">{otherUser?.status}</p>
//           </div>
//         </div>
//         <div className="flex space-x-2">
//           <button className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
//             <PhoneIcon className="h-5 w-5" />
//           </button>
//           <button className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
//             <VideoIcon className="h-5 w-5" />
//           </button>
//           <button className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
//             <InfoIcon className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//         {/* ... (message mapping) ... */}
//           {loading && (
//             <div className="flex h-full items-center justify-center text-center text-gray-500">
//               <Loader className="h-6 w-6 animate-spin mr-2" /> Loading messages...
//             </div>
//           )}
//         <div className="space-y-4">
//           {messages.map((msg) => (
//             <div
//               key={msg._id}
//               className={`flex ${
//                 msg.sender._id === user._id ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div className="flex max-w-xs lg:max-w-md">
//                 <div>
//                   <div
//                     className={`rounded-lg px-4 py-2 ${
//                       msg.sender._id === user._id
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-200 text-gray-800"
//                     }`}
//                   >
//                     <p className="text-sm">{msg.content}</p>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {new Date(msg.createdAt).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div ref={scrollRef} />
//         </div>
//       </div>

//       {/* Message Input */}
//       <div className="border-t border-gray-200 px-4 py-3">
//         <form onSubmit={handleSendMessage} className="flex items-center">
//           {/* ... (form content) ... */}
//           <div className="flex space-x-1">
//             <button
//               type="button"
//               className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
//             >
//               <PaperclipIcon className="h-5 w-5" />
//             </button>
//             <button
//               type="button"
//               className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
//             >
//               <ImageIcon className="h-5 w-5" />
//             </button>
//           </div>
//           <input
//             type="text"
//             placeholder="Type a message..."
//             className="flex-1 border-0 focus:ring-0 focus:outline-none px-3 py-2 text-sm"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />
//           <button
//             type="submit"
//             className={`p-2 rounded-full flex items-center justify-center ${
//               newMessage.trim()
//                 ? "bg-blue-600 text-white hover:bg-blue-700"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             }`}
//             disabled={!newMessage.trim()}
//           >
//             <SendIcon className="h-5 w-5" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;



import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import {
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Send,
  Image as ImageIcon,
  ArrowLeft,
  Loader2,
  Check,
  CheckCheck
} from "lucide-react";

const ChatWindow = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const socket = useSocket();
  const scrollRef = useRef(null);

  const otherUser = chat.participants.find((p) => p._id !== user._id);

  // Fetch Messages
  useEffect(() => {
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
    fetchMessages();
  }, [chat]);

  // Socket Listener
  useEffect(() => {
    if (!socket) return;
    const messageListener = (newMsg) => {
      if (newMsg.channel === chat._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };
    socket.on("newMessage", messageListener);
    return () => socket.off("newMessage", messageListener);
  }, [socket, chat]);

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit("sendMessage", {
      content: newMessage,
      channelId: chat._id,
    });
    setNewMessage("");
  };

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white md:rounded-tl-2xl overflow-hidden">
      {/* --- Header --- */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {otherUser?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">{otherUser?.username || "Chat"}</h3>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active now
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconButton icon={<Phone size={18} />} />
          <IconButton icon={<Video size={18} />} />
          <IconButton icon={<MoreVertical size={18} />} />
        </div>
      </div>

      {/* --- Messages Area --- */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="text-center text-xs text-slate-400 my-4 font-medium uppercase tracking-wider">
              Start of conversation
            </div>
            
            {messages.map((msg, index) => {
              const isMe = msg.sender._id === user._id;
              const isSequence = index > 0 && messages[index - 1].sender._id === msg.sender._id;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} ${isSequence ? "mt-1" : "mt-4"}`}
                >
                  <div className={`max-w-[80%] sm:max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    
                    {/* Bubble */}
                    <div
                      className={`
                        px-4 py-2.5 text-sm shadow-sm relative group
                        ${isMe 
                          ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                          : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm"
                        }
                      `}
                    >
                      {msg.content}
                      
                      {/* Timestamp on Hover */}
                      <div className={`
                        absolute bottom-0 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1
                        ${isMe ? "right-full mr-2 text-slate-400" : "left-full ml-2 text-slate-400"}
                      `}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Status Icon (Read receipts logic goes here later) */}
                    {isMe && !isSequence && (
                       <span className="text-[10px] text-slate-400 mt-1 mr-1 flex items-center gap-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <CheckCheck size={12} />
                       </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      {/* --- Input Area --- */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={handleSendMessage}
          className="flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all"
        >
          <div className="flex gap-1 pb-1 pl-1">
            <InputButton icon={<Paperclip size={20} />} />
            <InputButton icon={<ImageIcon size={20} />} />
          </div>

          <textarea
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-800 placeholder-slate-400 resize-none py-2 px-1 max-h-32 min-h-[44px]"
            placeholder="Type a message..."
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`
              p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center
              ${newMessage.trim() 
                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:scale-105" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            <Send size={18} className={newMessage.trim() ? "ml-0.5" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Helper Components for Clean Code ---

const IconButton = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
  >
    {icon}
  </button>
);

const InputButton = ({ icon }) => (
  <button
    type="button"
    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
  >
    {icon}
  </button>
);

export default ChatWindow;