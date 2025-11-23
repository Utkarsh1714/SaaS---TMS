// src/components/ui/PageLoader.jsx
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="w-64 space-y-3">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-400">
          <span>Initializing workspace...</span>
          <span>Please wait</span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;