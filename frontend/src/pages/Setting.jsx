import React from "react";
import Sidebar from "../components/layout/Sidebar";
import { useTheme } from "../context/themeContext.jsx";
import { Sun, Moon } from "lucide-react";
import {updatewallpaper} from "../services/api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import uploadToCloudinary from "../services/upload.js";

export const SettingsPage = ({ isMobile }) => {
  const { theme, toggleTheme } = useTheme();

 const navigate = useNavigate();

  const [wallpaper, setwallpaper] = useState(null);
    const [loading, setLoading] = useState(false);
  
    // Load name from localStorage when component mounts
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
     
    }, []);
  
   const handleSubmit = async (e) => {
  e.preventDefault();

  if (!wallpaper) return alert("Please select a file");

  setLoading(true);

  try {
    // 1️⃣ Upload to Cloudinary
    const uploaded = await uploadToCloudinary(wallpaper);

    // uploaded should return:
    // { public_id, secure_url }

    // 2️⃣ Send to backend
    const res = await updatewallpaper({
      wallpaper: uploaded.secure_url,
      wallpaperId: uploaded.public_id
    });

    // 3️⃣ Update frontend user state (IMPORTANT)
    if (res.data) {
      localStorage.setItem("user", JSON.stringify(res.data));
    }

    alert("Wallpaper updated successfully");

  } catch (err) {
    console.error(err);
    alert("Update failed");
  }

  setLoading(false);
};


return (
  <div className="flex h-screen bg-gray-100 dark:bg-[#0b141a] transition-colors">
    
    {/* Sidebar */}
    {!isMobile && (
      <div className="w-[260px] border-r bg-white dark:bg-[#111b21]">
        <Sidebar />
      </div>
    )}

    {/* Main Area */}
    <div className="flex-1 flex justify-center items-start p-6 overflow-y-auto">
      
      <div className="w-full max-w-3xl bg-white dark:bg-[#111b21] 
                      rounded-2xl shadow-lg p-8 transition-colors mt-10 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Appearance Settings
          </h1>

          {isMobile && (
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 font-medium"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between 
                        bg-gray-50 dark:bg-[#202c33] 
                        p-6 rounded-xl transition-colors">
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Theme Mode
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Switch between light and dark mode
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className={`relative w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300
              ${theme === "dark" ? "bg-green-500" : "bg-gray-300"}`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center
                ${theme === "dark" ? "translate-x-8" : "translate-x-0"}`}
            >
              {theme === "dark" ? (
                <Moon size={14} className="text-gray-700" />
              ) : (
                <Sun size={14} className="text-yellow-500" />
              )}
            </div>
          </button>
        </div>

        {/* Wallpaper Upload Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Change Wallpaper
          </h2>

          {/* Preview */}
          {wallpaper && (
            <img
              src={URL.createObjectURL(wallpaper)}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setwallpaper(e.target.files[0])}
            className="w-full text-sm"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg 
                       hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Uploading..." : "Save Wallpaper"}
          </button>
        </div>

      </div>
    </div>
  </div>
);
};

export default SettingsPage;