// import React from "react";
// import { Button } from "../ui/button";
// import { useNotifications } from "@/context/NotificationContext";
// import { MdDelete } from "react-icons/md";
// import { Zap, MinusCircle, ChevronDownCircle } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";

// const NotificationPanel = () => {
//   const {
//     notifications,
//     showNotifications,
//     toggleNotificationPanel,
//     removeNotification,
//     clearNotifications,
//   } = useNotifications();

//   // Function to get icon based on notification type
//   const getIcon = (priority) => {
//     switch (priority) {
//       case "High":
//         return <Zap className="text-red-500" size={20} />;
//       case "Medium":
//         return <MinusCircle className="text-yellow-500" size={20} />;
//       case "Low":
//         return <ChevronDownCircle className="text-green-500" size={20} />;
//       default:
//         return <MinusCircle className="text-gray-500" size={20} />; // Fallback icon
//     }
//   };

//   return (
//     <div
//       className={`fixed top-0 right-0 h-full bg-slate-50 border-l border-gray-300 shadow-lg p-4 z-50 transition-transform duration-500 ease-in-out transform
//           ${showNotifications ? "translate-x-0" : "translate-x-full"}
//           w-full md:w-[35%] overflow-y-auto`}
//     >
//       <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-50 py-2">
//         <h2 className="text-2xl font-bold">Notifications</h2>
//         <div className="flex items-center gap-2">
//           {notifications.length > 0 && (
//             <Button
//               variant={"secondary"}
//               className={"text-sm h-8 border hover:bg-gray-200"}
//               onClick={() => clearNotifications()}
//             >
//               Clear All
//             </Button>
//           )}
//           <Button
//             variant="ghost"
//             onClick={toggleNotificationPanel}
//             className={"rounded-full hover:bg-gray-200"}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 text-gray-500"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </Button>
//         </div>
//       </div>
//       <ul className="space-y-4">
//         <AnimatePresence>
//           {notifications.length > 0 ? (
//             notifications.map((notification) => (
//               <motion.li
//                 key={notification.id}
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, x: -200, transition: { duration: 0.2 } }}
//                 transition={{ duration: 0.3 }}
//                 className="group relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//               >
//                 <div className="flex items-start justify-between mb-2">
//                   <div className="flex items-center gap-3">
//                     {notification.details &&
//                       getIcon(notification.details.priority)}
//                     <div className="flex flex-col">
//                       <p className="font-semibold text-gray-800">
//                         {notification.message}
//                       </p>
//                       <span className="text-xs text-gray-500 mt-0.5">
//                         {notification.time}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                     <Button
//                       variant="ghost"
//                       className="p-1 h-8 w-8"
//                       onClick={() => removeNotification(notification.id)}
//                     >
//                       <MdDelete
//                         className="text-gray-500 hover:text-red-500 transition-colors duration-200"
//                         size={18}
//                       />
//                     </Button>
//                   </div>
//                 </div>
//                 {notification.details && (
//                   <div className="border-t border-dashed border-gray-200 pt-3 mt-3 text-sm text-gray-600 space-y-1">
//                     <p>
//                       <span className="font-medium">Task:</span>{" "}
//                       {notification.details.title}
//                     </p>
//                     <p>
//                       <span className="font-medium">Department:</span>{" "}
//                       {notification.details.department}
//                     </p>
//                     <p>
//                       <span className="font-medium">Priority:</span>{" "}
//                       {notification.details.priority}
//                     </p>
//                   </div>
//                 )}
//               </motion.li>
//             ))
//           ) : (
//             <li className="p-4 text-center text-gray-500">
//               <p className="text-sm">No new notifications.</p>
//             </li>
//           )}
//         </AnimatePresence>
//       </ul>
//     </div>
//   );
// };

// export default NotificationPanel;



import React from "react";
import { Button } from "../ui/button";
import { useNotifications } from "@/context/NotificationContext";
import { Trash2, Zap, Info, AlertCircle, X, Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NotificationPanel = () => {
  const {
    notifications,
    showNotifications,
    toggleNotificationPanel,
    removeNotification,
    clearNotifications,
  } = useNotifications();

  const getIcon = (priority) => {
    switch (priority) {
      case "High": return <Zap className="text-white" size={16} />;
      case "Medium": return <AlertCircle className="text-white" size={16} />;
      default: return <Info className="text-white" size={16} />;
    }
  };

  const getColor = (priority) => {
     switch (priority) {
      case "High": return "bg-rose-500";
      case "Medium": return "bg-amber-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <>
      {/* Backdrop */}
      {showNotifications && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" 
          onClick={toggleNotificationPanel}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out transform ${
          showNotifications ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
             <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
             <p className="text-sm text-slate-500">You have {notifications.length} unread messages</p>
          </div>
          <button 
            onClick={toggleNotificationPanel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group overflow-hidden"
                >
                  <div className="flex gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${getColor(notification.details?.priority)}`}>
                       {getIcon(notification.details?.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start">
                          <h4 className="text-sm font-semibold text-slate-900 mb-1">{notification.message}</h4>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notification.time}</span>
                       </div>
                       
                       {notification.details && (
                          <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100">
                             <p><span className="font-medium text-slate-700">Task:</span> {notification.details.title}</p>
                             <p className="mt-0.5"><span className="font-medium text-slate-700">Dept:</span> {notification.details.department}</p>
                          </div>
                       )}
                    </div>
                  </div>

                  {/* Hover Delete Action */}
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-slate-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 mt-20">
                 <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Bell size={24} className="text-slate-300" />
                 </div>
                 <p>No notifications yet.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white">
            <Button
              variant="outline"
              className="w-full border-slate-200 hover:bg-slate-50 text-slate-600"
              onClick={() => clearNotifications()}
            >
              Clear All Notifications
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;