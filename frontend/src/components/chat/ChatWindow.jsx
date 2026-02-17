import React, { useEffect, useRef, useState } from "react";
import { useChatSocket } from "../../hooks/useChatSocket";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useSendMessage } from "../../hooks/useSendMessage";
import InputField from "./InputField";
import ChatHeader from "./ChatHeader";
import { deleteMessage } from "../../services/api";
import cutButton from "../../assets/cutButton.png";
import star from "../../assets/star.png";
import deletes from "../../assets/delete.png";
// import useGetUser from "../../hooks/useGetUser";
import useGetUser from "../../hooks/usegetUser";

const ChatWindow = ({ activeConversation, avatar }) => {
  const [messages, setMessages] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);
  const pressTimer = useRef(null);

  const socketRef = useChatSocket(activeConversation?._id, setMessages);
  useChatMessages(activeConversation?._id, setMessages, setText);

  const sendMessage = useSendMessage(
    socketRef,
    activeConversation?._id,
    setText,
    setMessages
  );

  
  const currUser = JSON.parse(localStorage.getItem("user"))?.name;

  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  const toggleSelect = (id) => {
    setSelectedMessages((prev) =>
      prev.includes(id)
        ? prev.filter((msgId) => msgId !== id)
        : [...prev, id]
    );
  };

 useEffect(() => {
  if (activeConversation) {
    setSelectedMessages([]);
     setSelectionMode(false);
  }
}, [activeConversation]);


  
  const handlePressStart = (id) => {
    pressTimer.current = setTimeout(() => {
      setSelectionMode(true);
      toggleSelect(id);
    }, 500);
  };

  // Long press cancel
  const handlePressEnd = () => {
    clearTimeout(pressTimer.current);
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedMessages([]);
  };

  

const handleDelete = async () => {
  

  try {
    await deleteMessage(selectedMessages);

    setMessages((prev) =>
      prev.filter((msg) => !selectedMessages.includes(msg._id))
    );

    exitSelectionMode();
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete message(s)");
  }
};


  const handleStar = async () => {
    console.log("Star:", selectedMessages);
    // Call api to react on messages 

    exitSelectionMode();
  };

    const { localUser, apiUser, error } = useGetUser();


  return (
    <div className="relative flex flex-col h-full bg-gray-100">

      {/* Background image (behind chat) */}
      <div className="absolute inset-0 -z-10">
        {apiUser?.wallpaper ? (
          <img
            src={apiUser.wallpaper}
            alt="user"
            className="w-full h-full object-cover opacity-10 bg-slate-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 animate-pulse opacity-10" />
        )}
      </div>

      <ChatHeader activeConversation={activeConversation} avatar={avatar} />



      {/* selected messagespreview */}
      {selectionMode &&  (
        <div className="bg-white shadow px-4 py-3 flex justify-between items-center border-b dark:bg-[#202222] ">
          <span className="font-bold text-xl dark:text-white">
            {selectedMessages.length} selected
          </span>
          <div className="flex gap-4 text-lg">
            <button onClick={handleStar}>
              <img src={star} alt="⭐" className="w-8 h-8 dark:invert"></img>
            </button>
            <button onClick={handleDelete}>
              <img src={deletes} alt="🗑" className="w-8 h-8 dark:invert" ></img></button>
            <button onClick={exitSelectionMode}>
              <img src={cutButton} alt="✖" className="w-8 h-8 dark:invert"></img></button>
          </div>
        </div>
      )}
     
     
    

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender?.name === currUser;
          const isSelected = selectedMessages.includes(msg._id);

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              onMouseDown={() => handlePressStart(msg._id)}
              onMouseUp={handlePressEnd}
              onTouchStart={() => handlePressStart(msg._id)}
              onTouchEnd={handlePressEnd}
              onClick={() => {
                if (selectionMode) toggleSelect(msg._id);
              }}
            >
              <div
                className={`relative max-w-[75%] sm:max-w-[60%] px-4 py-2 rounded-2xl transition 
                ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white text-gray-800 shadow rounded-bl-md"
                }
                ${
                  isSelected
                    ? "ring-2 ring-zinc-400 scale-[1.1]"
                    : ""
                }`}
              >
                {/* Sender name */}
                {!isMe && (
                  <p className="text-xs font-semibold text-blue-500 mb-1">
                    {msg.sender?.name}
                  </p>
                )}

                {/* Media */}
                {msg.media?.map((item) => (
                  <div key={item._id} className="mb-2">
                    {item.type === "image" && (
                      <img
                        src={item.url}
                        alt=""
                        className="rounded-lg max-h-60 object-cover"
                      />
                    )}
                    {item.type === "video" && (
                      <video
                        src={item.url}
                        controls
                        className="rounded-lg max-h-60"
                      />
                    )}
                    {item.type === "raw" && (
                      <a
                        href={item.url}
                        className="text-xs underline block"
                      >
                        📎 Download File
                      </a>
                    )}
                  </div>
                ))}

                {/* Text */}
                {msg.text && msg.text !== "null" && (
                  <p className="text-sm leading-relaxed break-words">
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input disabled when selecting */}
      {!selectionMode && (
        <InputField
          text={text}
          setText={setText}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
};

export default ChatWindow;
