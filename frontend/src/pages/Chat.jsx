import MessageBox from "@/components/MessageBox";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Chat = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const socket = useSocket();
    const { user } = useAuth();

    const handleSelectedChat = async(employee) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/chat`,
                { userId: employee._id },
                { withCredentials: true }
            );
            setSelectedChat(res.data);
        } catch (error) {
            console.error("Error accessing or creating chat:", error);
        }
    };

    useEffect(() => {
        if (selectedChat && socket) {
            socket.emit('joinChat', selectedChat._id)
        }
    }, [selectedChat, socket])

    const fetchAllEmployee = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/employee`,
                { withCredentials: true }
            );
            const filteredEmployees = res.data.filter(emp => emp._id !== user._id);
            setEmployeeList(filteredEmployees);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        fetchAllEmployee();
    }, []);

    return (
        <div className="w-full h-full hide-scroll px-4 flex flex-col">
            <div className="w-full px-3 py-5">
                <div className="flex items-center justify-start gap-3 overflow-x-scroll">
                    {employeeList.map((emp) => (
                        <div
                            key={emp._id}
                            onClick={() => handleSelectedChat(emp)}
                            className="flex flex-col items-center justify-center cursor-pointer"
                        >
                            <div className="w-20 h-20 border-2 rounded-full p-0.5 bg-gradient-to-r from-[#d62976] to-[#fa7e1e]">
                                <img
                                    src="https://images.unsplash.com/photo-1732492211688-b1984227af93?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8"
                                    alt="profile_img"
                                    className="w-full h-full rounded-full object-cover flex items-center justify-center"
                                />
                            </div>
                            <div>
                                <h1 className="font-medium text-sm">{emp?.username.split(" ")[0]}</h1>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full h-[650px] sm:h-[500px] border-t-2 pt-5">
                {/* Conditionally render the MessageBox component */}
                {selectedChat ? (
                    <MessageBox chat={selectedChat} />
                ) : (
                    <div className="flex items-center justify-center pt-40">
                        <h2 className="text-gray-500 text-lg">
                            Select a conversation to start messaging 💬
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;