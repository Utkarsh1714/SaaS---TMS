import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react'

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
                }
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