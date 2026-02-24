import React, { useEffect, useState } from "react";
import { createConversation, getUsersNotinChat } from "../services/api.js";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import  Sidebar from "../components/layout/Sidebar";
import { ArrowLeft, Search, X, Users } from 'lucide-react';

const Conversation = ({ activeConversation, isMobile }) => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
   const [query, setQuery] = useState("");

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = user?._id;
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getUsersNotinChat(userId);
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [conversationId]);


  



  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  // ✅ One-click private chat
  const createPrivateChat = async (userId) => {
    try {
      await createConversation({
        members: [userId],
        isGroup: false,
        groupName: "",
      });
      navigate("/"); 
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  // ✅ Group chat
  const createGroupChat = async () => {
    if (selectedUsers.length < 2 || !groupName.trim()) return;

    try {
      await createConversation({
        members: selectedUsers.map((u) => u._id),
        isGroup: true,
        groupName,
      });
      navigate("/"); 
      // 🔥 go back to chat home
      act
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  };

  //  const filtered = conversations.filter((user) =>
  //   getAllUsers(user).toLowerCase().includes(query.toLowerCase())
  // );

  if (loading) return <p className="p-4">Loading users...</p>;

  return (
  <div className="flex h-screen bg-gray-50 dark:bg-[#111212] transition-colors duration-300">
    
    {/* LEFT SIDEBAR */}
    <div className="w-[280px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1d1f1f] hidden md:block">
      <Sidebar />
    </div>

    {/* RIGHT CONTENT */}
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

        {/* Header Section */}
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {conversationId === "new" ? "New Conversation" : "Add Members"}
              </h2>
            </div>
            
            {/* Counter for selection */}
            {selectedUsers.length > 0 && (
              <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded-full">
                {selectedUsers.length} selected
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="search"
              placeholder="Search by name or email..."
              className="w-full bg-white dark:bg-[#1d1f1f] border border-gray-200 dark:border-gray-700 rounded-xl px-11 py-3 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
        </header>

        {/* Selected Users Pill Bar */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
            {selectedUsers.map((u) => (
              <div key={u._id} className="flex items-center gap-2 bg-white dark:bg-gray-800 border dark:border-gray-700 pl-1 pr-2 py-1 rounded-lg text-sm font-medium dark:text-gray-200">
                <img src={u.avatar} className="w-5 h-5 rounded-full" />
                {u.name.split(' ')[0]}
                <button onClick={() => toggleUser(u)} className="hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section: Private Chat */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Direct Messages
            </h3>
            <div className="bg-white dark:bg-[#1d1f1f] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[400px] overflow-y-auto custom-scrollbar">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`}
                          className="w-11 h-11 rounded-full ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1d1f1f] rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{u.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-32">{u.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => createPrivateChat(u._id)}
                      className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all text-sm font-bold text-blue-600 dark:text-blue-400"
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Group Creation */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Create a Group
            </h3>
            <div className="bg-white dark:bg-[#1d1f1f] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4 shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">GROUP NAME</label>
                <input
                  className="w-full bg-gray-50 dark:bg-[#111212] border border-gray-200 dark:border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition"
                  placeholder="e.g. Marketing Team"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>

              <div className="border border-gray-100 dark:border-gray-800 rounded-xl max-h-[220px] overflow-y-auto">
                {users.map((u) => (
                  <label
                    key={u._id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} className="w-8 h-8 rounded-full" />
                      <span className="text-sm font-medium dark:text-gray-200">{u.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onChange={() => toggleUser(u)}
                      checked={selectedUsers.some((x) => x._id === u._id)}
                    />
                  </label>
                ))}
              </div>

              <button
                onClick={createGroupChat}
                disabled={selectedUsers.length < 2 || !groupName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                <Users size={18} />
                Create Group Chat
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  </div>
);
}
export default Conversation;