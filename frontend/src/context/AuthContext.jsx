// import axios from "axios";
// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
//         withCredentials: true,
//       });
//       setUser(res.data.user);
//     } catch (error) {
//       if (error.response?.status === 401) {
//         setUser(null);
//       } else {
//         console.error("Error fetching user:", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Still true initially, but for API call

  useEffect(() => {
    // 1. Try to load user from localStorage immediately
    let storedUser = null;
    try {
      const data = localStorage.getItem("user");
      if (data) {
        storedUser = JSON.parse(data);
        setUser(storedUser); // Set user state immediately from local storage
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user"); // Clear corrupted data
    }

    // 2. Then, verify the session with the backend
    const fetchUserAndVerify = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        // If API call succeeds, update user with fresh data and update localStorage
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (error) {
        if (error.response?.status === 401) {
          // If 401, clear user and localStorage as session is invalid
          setUser(null);
          localStorage.removeItem("user");
        } else {
          console.error("Error fetching user:", error);
          // If other error (e.g., network issue) and no stored user, clear user
          if (!storedUser) { // Only clear if no user was loaded from localStorage
             setUser(null);
             localStorage.removeItem("user");
          }
        }
      } finally {
        setLoading(false); // Authentication check is complete
      }
    };

    fetchUserAndVerify();
  }, []); // Empty dependency array means this runs once on mount

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Optionally, make an API call to log out on the server side as well
    // axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);