// In your MessageBox.jsx file

import React, { useEffect, useState } from 'react';
import { useSocket } from "@/context/SocketContext";
import { useAuth } from '@/context/AuthContext';
import axios from "axios";

const MessageBox = ({ chat }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const socket = useSocket();
    const { user: loggedInUser } = useAuth();

    // This useEffect for fetching messages is correct. No changes here.
    useEffect(() => {
        if (!chat?._id) return;
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/messages/${chat._id}`,
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

    // This useEffect for listening to new messages is where we make the fix.
    useEffect(() => {
        // ✨ CHANGE 1: Add a guard clause to ensure 'chat' exists.
        if (!socket || !chat) return;

        const messageListener = (incomingMessage) => {
            if (incomingMessage.channel === chat._id) {
                setMessages((prevMessages) => [...prevMessages, incomingMessage]);
            }
        };

        socket.on('newMessage', messageListener);

        return () => {
            socket.off('newMessage', messageListener);
        };
        // ✨ CHANGE 2: Depend on the whole 'chat' object, not just 'chat._id'.
    }, [socket, chat]); 

    if (!loggedInUser) return <div>Authenticating...</div>;
    // We add another check here to prevent errors before chat is fully loaded.
    if (!chat) return <div>Select a chat to start messaging.</div>;

    const recipient = chat.participants.find(p => p._id !== loggedInUser._id);
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket && chat) {
            socket.emit('sendMessage', {
                channelId: chat._id,
                content: newMessage,
            });
            setNewMessage("");
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="font-bold text-xl">{recipient?.username || "Chat"}</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {loading ? (
                    <div className="text-center">Loading messages...</div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`mb-2 ${msg.sender._id === loggedInUser._id ? 'text-right' : 'text-left'}`}
                        >
                            <span className={`inline-block p-2 rounded-lg ${msg.sender._id === loggedInUser._id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                {msg.content}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow border rounded-l-lg p-2 focus:outline-none"
                        placeholder="Type a message..."
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageBox;