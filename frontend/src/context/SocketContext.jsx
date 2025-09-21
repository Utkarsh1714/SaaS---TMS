import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null); // Create a ref to store the socket instance

  const [token, setToken] = useState(null);
  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    setToken(currentToken);
  }, []);

  useEffect(() => {
    // Only proceed if a socket hasn't been created yet
    if (token && !socketRef.current) {
      console.log("Socket Token:", token);
      if (token) {
        const newSocket = io(import.meta.env.VITE_API_URL, {
          auth: {
            token: token,
          },
          transports: ['websocket'],
        });

        // Event listeners for debugging
        newSocket.on("connect", () => {
          console.log("✅ Socket.IO connected successfully!");
          // Update the state only after a successful connection
          setSocket(newSocket);
        });

        newSocket.on("disconnect", () => {
          console.log("❌ Socket disconnected.");
          setSocket(null);
        });

        newSocket.on("connect_error", (err) => {
          console.error("❌ Socket Connection Error:", err.message);
        });

        // Store the socket instance in the ref
        socketRef.current = newSocket;
      }
    }

    // This cleanup function will now properly close the socket
    // when the component unmounts.
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
