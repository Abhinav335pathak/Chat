import react from "react";
import "../../index.css";
import setting from "../../assets/setting.png";
import image from "../../assets/image.png";
import message from "../../assets/message.png";
import fullscreen from "../../assets/fullscreen.png";
import call from "../../assets/call.png";
import status from "../../assets/status.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { useGetUser } from "../../hooks/usegetUser.js";

import { Routes, Route, Link, NavLink } from "react-router-dom";




const Sidebar = ({ isMobile }, activeConversation) => {
  const users = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name : null;
  const name = activeConversation?.members[0]?.name == users ? activeConversation?.members[1]?.name : activeConversation?.members[0]?.name || "User";

  const { localUser, apiUser, error } = useGetUser();



  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };


return (
  <div className="h-screen w-32 bg-stone-100 text-black font-smooch font-medium text-xl flex flex-col items-center py-6 justify-between dark:bg-[#1d1f1f]">

    {/* Top Section */}
    <div className="flex flex-col items-center gap-6">
      <Link to="/" className="w-12 h-12 rounded-full flex items-center justify-center">
        <img src={message} className=" dark:invert" alt="message" />
      </Link>

      <Link to="/call" className="w-12 h-12 rounded-full  flex items-center justify-center">
        <img src={call} className="dark:invert" alt="call" />
      </Link>

      <Link to="/status" className="w-12 h-12 rounded-full flex items-center justify-center">
        <img src={status} className=" dark:invert" alt="status" />
      </Link>

      <button
        onClick={toggleFullscreen}
        className="w-12 h-12 rounded-full  flex items-center justify-center"
      >
        <img src={fullscreen} className=" dark:invert"  alt="fullscreen" />
      </button>
    </div>

    {/* Bottom Section */}
    <div className="flex flex-col items-center gap-6">

      <Link to="/media" className="w-12 h-12 flex items-center justify-center">
        <img src={image} className=" dark:invert " alt="files" />
      </Link>

      <div className="w-10 h-px bg-gray-300"></div>

      <Link to="/setting" className="w-12 h-12 flex items-center justify-center">
        <img src={setting} className=" dark:invert" alt="setting" />
      </Link>

      <div className="w-16 h-16 rounded-full overflow-hidden">
        {apiUser?.avatar ? (
          <img
            src={apiUser.avatar}
            alt="user"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 animate-pulse" />
        )}
      </div>

    </div>
  </div>
);


}

export default Sidebar;
