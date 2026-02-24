import React, { useEffect, useState } from "react";
import { useChatContext } from "../../context/ChatContext.jsx";
import { getConversations } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { decryptMessage } from "../../utils/crypto.js";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Plus, MoreVertical, User, Settings, LogOut, Info, Image } from "lucide-react"; // Modern Icons
import "@fontsource/roboto";
import Media from "../../pages/Media.jsx";

const ChatList = ({ activeConversation, isMobile, setavatar }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { conversations, setConversations, setActiveConversation } = useChatContext();
  const { token, user, loading } = useAuth();
  const navigate = useNavigate();

  const userId = user?._id;

  useEffect(() => {
    if (!token || loading) return;
    const load = async () => {
      try {
        const res = await getConversations();
        const conversationArray = Array.isArray(res.data) ? res.data : res.data.conversations || [];

        const decrypted = await Promise.all(
          conversationArray.map(async (conv) => {
            if (!conv.latestMessage?.ciphertext) return conv;
            const text = await decryptMessage(
              conv.latestMessage.ciphertext,
              conv.latestMessage.iv,
              import.meta.env.VITE_CHAT_SECRET
            );
            return { ...conv, latestMessage: { ...conv.latestMessage, previewText: text } };
          })
        );
        setConversations(decrypted);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };
    load();
  }, [token, loading, setConversations, user]);

  const getChatName = (conv) => {
    if (conv.isGroup) return conv.groupName || "Group Chat";
    return conv.members.find((m) => m._id !== user?._id)?.name || "Chat";
  };

  const getChatAvatar = (conv) => {
    if (conv.isGroup) return conv.avatar;
    return conv.members.find((m) => m._id !== user?._id)?.avatar;
  };

  const filtered = conversations.filter((conv) =>
    getChatName(conv).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-screen bg-white dark:bg-[#161717] ${isMobile && activeConversation ? 'hidden' : 'flex'}`}>
      
      {/* HEADER SECTION */}
      <div className="p-4 space-y-4 bg-white dark:bg-[#1d1f1f] border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold dark:text-white px-2">Chats</h1>
          
          <div className="flex items-center gap-1">
            {/* New Chat Button */}
            <button
              onClick={() => navigate(activeConversation ? `/not-in/${userId}` : "/not-in/new")}
              className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 transition"
            >
              <Plus size={24} />
            </button>

            {/* More Options Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setOpen(!open)}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 transition"
              >
                <MoreVertical size={24} />
              </button>

              {open && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1d1f1f] rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-800 z-20 overflow-hidden">
                    <MenuLink to="/profile" icon={<User size={18}/>} label="Profile" />
                    <MenuLink to="/personal" icon={<Info size={18}/>} label="Info" />
                    {isMobile && (
                      <>
                        <MenuLink to="/status" icon={<Image size={18}/>} label="Status" />
                        <MenuLink to="/media" icon={<Image size={18}/>} label="Media" />
                        <MenuLink to="/setting" icon={<Settings size={18}/>} label="Settings" />
                      </>
                    )}
                    <hr className="dark:border-zinc-800" />
                    <MenuLink to="/logout" icon={<LogOut size={18}/>} label="Logout" danger />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative px-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="search"
            placeholder="Search conversations..."
            className="w-full bg-gray-100 dark:bg-[#2d2e2e] dark:text-white py-2.5 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* CONVERSATION LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No conversations found</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const avatar = getChatAvatar(conv);
            const isActive = activeConversation?._id === conv._id;

            return (
              <div
                key={conv._id}
                onClick={() => {
                  setActiveConversation(conv);
                  setavatar(avatar);
                }}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer group ${
                  isActive 
                    ? "bg-emerald-50 dark:bg-[#2d2e2e]" 
                    : "hover:bg-gray-50 dark:hover:bg-[#1d1f1f]"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(getChatName(conv))}&background=random`}
                    alt="avatar"
                    className="w-14 h-14 rounded-full object-cover shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#161717] rounded-full"></div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className={`font-semibold truncate ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100"}`}>
                      {getChatName(conv)}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {conv.latestMessage?.previewText || "Start a conversation"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Helper component for cleaner menu items
const MenuLink = ({ to, icon, label, danger }) => (
  <NavLink to={to} className="block">
    <div className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
      danger ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
    }`}>
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  </NavLink>
);

export default ChatList;