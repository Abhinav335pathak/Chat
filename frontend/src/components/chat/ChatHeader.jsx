import React from "react";
import { useChatContext } from "../../context/ChatContext.jsx";
import { useGetUser } from "../../hooks/usegetUser.js";

const ChatHeader = ({ activeConversation ,avatar}) => {
  const { setActiveConversation } = useChatContext();
     const { localUser, apiUser, error } = useGetUser();

  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).name
    : null;

  const name = activeConversation?.isGroup
    ? activeConversation.groupName || "Group"
    : activeConversation?.members?.find((m) => m.name !== currentUser)?.name ||
      "User";

  if (!activeConversation) {
    return (
      <div className="h-24 flex items-center px-4 border-b text-gray-500">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="select-none w-full h-24 flex items-center border-b-2 border-stone-100 px-4 dark:bg-[#1d1f1f] dark:text-white">
      {/* Mobile back button */}
      <button
        onClick={() => setActiveConversation(null)}
        className="md:hidden text-sm text-gray-600 mr-3"
      >
        ← Back
      </button>

     <img
        src={avatar?avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random&size=128`}
        alt={name}
        className="w-12 h-12 rounded-full mr-3"
      />
       {/* <div className="w-12 h-12 rounded-2xl overflow-hidden">
    {apiUser?.avatar ? (
      <img
        src={apiUser.avatar}
        alt="user"
        className="w-full h-full object-cover"
      />
    ) : (
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random&size=128`}
        alt={name}
        className="w-12 h-12 rounded-full mr-3"
      />
    )}
  </div> */}

      <h3 className="text-lg font-semibold">{name}</h3>
    </div>
  );
};

export default ChatHeader;
