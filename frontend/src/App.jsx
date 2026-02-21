import React from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Logout from "./pages/Logout.jsx";
import Conversation from "./pages/Conversation.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import { getConversations } from "./services/api.js";
import { useChatContext } from "./context/ChatContext.jsx";
import {Settings} from "./pages/Setting.jsx";
import {Profile} from "./pages/Profile.jsx";
//fixed imports
import {Media} from "./pages/Media.jsx";
import {Status} from "./pages/Status.jsx";
import {Call} from "./pages/Call.jsx";
import useIsMobile from "./hooks/useIsMobile.js";
import SwipeWrapper from "./hooks/swipeWrapper.jsx";

import "./index.css";

const App = () => {
  const isMobile = useIsMobile();
 const { activeConversation } = useChatContext();
   const Wrapper = isMobile ? SwipeWrapper : React.Fragment;
 
  return (
    <div className="">
      {/* <nav className="flex gap-4 items-center p-3 border-b"> */}
        {/* <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink> */}
   

        {/* Fullscreen Button */}
       
      {/* </nav> */}
 <Wrapper>
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
        {/* <Route path="/verify-email" element={<Verify />} /> */}
        <Route path="/logout" element={<Logout />} />
         <Route path="/setting" element={<Settings />} />
         <Route path="/profile" element={<Profile />} />
        
          <Route path="/status" element={<Status isMobile={isMobile }  activeConversations={activeConversation}/>} />
          <Route path="/call" element={<Call isMobile={isMobile}/>}/>

          <Route path="/media" element={<Media/>}/>

        <Route path="/not-in/:userId" element={<Conversation activeConversations={activeConversation}/>}  />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
              </Wrapper>
    </div>
  );
};

export default App;
