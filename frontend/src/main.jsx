import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <AuthProvider>
        <NotificationProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </HelmetProvider>
  </BrowserRouter>
);
