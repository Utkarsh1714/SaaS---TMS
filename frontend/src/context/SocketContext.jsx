import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            const newSocket = io(import.meta.env.VITE_API_URL, {
                auth: {
                    token: token,
                },
                transports: ['websocket'], // Ensure WebSocket transport is used
            });

            // Add a console log to confirm connection status
            newSocket.on('connect', () => {
                console.log('✅ Socket.IO connected successfully!');
            });
            
            // Add error handling to catch connection issues
            newSocket.on('connect_error', (err) => {
                console.error("❌ Socket Connection Error:", err.message);
            });

            // Log general socket errors
            newSocket.on('error', (err) => {
                console.error("❌ Socket Error:", err);
            });

            setSocket(newSocket);

            // Clean up the component when the socket unbound
            return () => newSocket.close();
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}