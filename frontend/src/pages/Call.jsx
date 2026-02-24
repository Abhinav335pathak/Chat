import React from "react";
import Sidebar from "../components/layout/Sidebar";
import { Phone, Clock } from "lucide-react";

export const Call = ({ isMobile }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0b141a] transition-colors">
      
      {/* Sidebar (desktop only) */}
      {!isMobile && <Sidebar />}

      {/* Main Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        
        <div className="bg-white dark:bg-[#111b21] 
                        rounded-2xl shadow-xl 
                        px-10 py-12 text-center 
                        max-w-md w-full transition-colors">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 dark:bg-[#202c33] p-5 rounded-full">
              <Phone size={40} className="text-green-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
            Calls Coming Soon
          </h1>

          {/* Subtitle */}
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This feature is currently under development.  
            We're working hard to bring you seamless voice and video calls.
          </p>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 
                          bg-yellow-100 dark:bg-yellow-900/30 
                          text-yellow-700 dark:text-yellow-400 
                          px-4 py-2 rounded-full text-sm font-medium">
            <Clock size={16} />
            Work in Progress
          </div>

        </div>
      </div>
    </div>
  );
};

export default Call;