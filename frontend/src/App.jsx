import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import Verify from "./pages/verify";
import Conversation from "./pages/Conversation";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import { getConversations } from "./services/api";
import { useChatContext } from "./context/ChatContext";
import {Settings} from "../src/pages/Setting";
import {Profile} from "../src/pages/Profile";
import {Media} from "../src/pages/Media";
import {Status} from "../src/pages/Status";
import SwipeWrapper from "../src/hooks/swipeWrapper";

import "../src/index.css";

const App = () => {
 const { activeConversation } = useChatContext();
  return (
    <div className="">
      {/* <nav className="flex gap-4 items-center p-3 border-b"> */}
        {/* <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink> */}
   

        {/* Fullscreen Button */}
       
      {/* </nav> */}
<SwipeWrapper>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<Verify />} />
        <Route path="/logout" element={<Logout />} />
         <Route path="/setting" element={<Settings />} />
         <Route path="/profile" element={<Profile />} />
          <Route path="/status" element={<Status />} />
          <Route path="/media" element={<Media/>}/>

        <Route path="/not-in/:userId" element={<Conversation activeConversations={activeConversation}/>}  />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      </SwipeWrapper>
    </div>
  );
};

export default App;
