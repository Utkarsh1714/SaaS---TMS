import React from "react";
import { Button } from "../ui/button";
import { useNotifications } from "@/context/NotificationContext";
import { MdDelete } from "react-icons/md";
import { Zap, MinusCircle, ChevronDownCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NotificationPanel = () => {
  const {
    notifications,
    showNotifications,
    toggleNotificationPanel,
    removeNotification,
    clearNotifications,
  } = useNotifications();

  // Function to get icon based on notification type
  const getIcon = (priority) => {
    switch (priority) {
      case "High":
        return <Zap className="text-red-500" size={20} />;
      case "Medium":
        return <MinusCircle className="text-yellow-500" size={20} />;
      case "Low":
        return <ChevronDownCircle className="text-green-500" size={20} />;
      default:
        return <MinusCircle className="text-gray-500" size={20} />; // Fallback icon
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-slate-50 border-l border-gray-300 shadow-lg p-4 z-50 transition-transform duration-500 ease-in-out transform
          ${showNotifications ? "translate-x-0" : "translate-x-full"}
          w-full md:w-[35%] overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-50 py-2">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <Button
              variant={"secondary"}
              className={"text-sm h-8 border hover:bg-gray-200"}
              onClick={() => clearNotifications()}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={toggleNotificationPanel}
            className={"rounded-full hover:bg-gray-200"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      </div>
      <ul className="space-y-4">
        <AnimatePresence>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <motion.li
                key={notification.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -200, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {notification.details &&
                      getIcon(notification.details.priority)}
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-800">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      className="p-1 h-8 w-8"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <MdDelete
                        className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                        size={18}
                      />
                    </Button>
                  </div>
                </div>
                {notification.details && (
                  <div className="border-t border-dashed border-gray-200 pt-3 mt-3 text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Task:</span>{" "}
                      {notification.details.title}
                    </p>
                    <p>
                      <span className="font-medium">Department:</span>{" "}
                      {notification.details.department}
                    </p>
                    <p>
                      <span className="font-medium">Priority:</span>{" "}
                      {notification.details.priority}
                    </p>
                  </div>
                )}
              </motion.li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">
              <p className="text-sm">No new notifications.</p>
            </li>
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default NotificationPanel;
