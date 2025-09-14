import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Function to add a new notification
  const addNotification = (newNotification) => {
    setNotifications((prevNotifications) => [
      { ...newNotification, id: Date.now() },
      ...prevNotifications,
    ]);
  };

  // Function to remove a specific notification by its index
  const removeNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id)
    );
  };

  // Function to clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Function to show/hide the notification panel
  const toggleNotificationPanel = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
        showNotifications,
        removeNotification,
        toggleNotificationPanel,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};