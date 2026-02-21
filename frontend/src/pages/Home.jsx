import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import { useChatContext } from "../context/ChatContext";
import Sidebar from "../components/layout/Sidebar";
import ResizablePanel from "../components/hooks/ResizablePanel.jsx";
import SwipeWrapper from"../hooks/swipeWrapper.jsx";


const Home = () => {
  const isMobile = useIsMobile();
  // const [avatar , setavatar] =useState("");
  const Wrapper = isMobile ? SwipeWrapper : React.Fragment;
  const { activeConversation,avatar,setavatar } = useChatContext();

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar (desktop only) */}
      {!isMobile && <Sidebar />}

      {/* Chat list (resizable on desktop, full screen on mobile when no chat) */}

<ResizablePanel isMobile={isMobile} activeConversation={activeConversation}>
  <Wrapper>
    <ChatList
      isMobile={isMobile}
      activeConversation={activeConversation}
      setavatar={setavatar}
    />

  </Wrapper>
</ResizablePanel>


      {/* Chat window */}
      {!isMobile && (
        <div className="flex-1">
          <ChatWindow activeConversation={activeConversation} isMobile={isMobile} avatar={avatar}/>
        </div>
      )}

      {/* Mobile chat window (full screen when active) */}
      {isMobile && activeConversation && (
        <div className="absolute inset-0 bg-white z-50">
          <ChatWindow activeConversation={activeConversation} isMobile={isMobile} />
        </div>
      )}
    </div>
  );
};

export default Home;
