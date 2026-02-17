import React, { useEffect, useState } from "react";
import { createConversation, getAllUsers } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const Conversation = ({ activeConversation }) => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
   const [query, setQuery] = useState("");

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getAllUsers(userId);
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
    <div className="max-w-xl mx-auto p-4 space-y-4">

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 font-medium"
        >
          ← Back
        </button>
        <h2 className="text-lg font-semibold">
          {conversationId === "new" ? "Start New Chat" : "Add Users"}
        </h2>
      </div>

           
 <div className="min-h-16 grid grid-rows-[minmax(30px,1vh)_1fr] font-sans">

      <div className="grid place-items-center bg-gray-50">
        <div className="relative w-[420px] h-[60px]">
          <svg
            viewBox="0 0 420 60"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
          >
            <rect
              rx="30"
              ry="30"
              className="w-full h-full fill-none stroke-emerald-950 stroke-[10]"
            />

            <g className="magnifier">
              <circle
                cx="27"
                cy="27"
                r="8"
                className="fill-none stroke-emerald-950 stroke-[3]"
              />
              <line
                x1="32"
                y1="32"
                x2="44"
                y2="44"
                className="stroke-emerald-950 stroke-[3]"
              />
            </g>

            
            <g>
              <circle cx="210" cy="30" r="4" className="fill-blue-500" />
              <circle cx="225" cy="25" r="4" className="fill-orange-400" />
              <circle cx="240" cy="35" r="4" className="fill-green-400" />
            </g>
          </svg>

          <input
            type="search"
            placeholder="Search..."
            className="absolute inset-0 w-full h-full bg-transparent pl-14 pr-8 rounded-full text-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
</div>

      <div className="space-y-2">
        <h3 className="font-medium text-gray-700">Start a private chat</h3>
        <div className="max-h-60 overflow-y-auto space-y-2 border rounded p-2">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50"
            >
              <span className="font-medium">{u.name}</span>
              <button
                onClick={() => createPrivateChat(u._id)}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Group Creation */}
      <div className="space-y-3 pt-3 border-t">
        <h3 className="font-medium text-gray-700">Create group</h3>

        <input
          className="border p-2 w-full rounded"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <div className="max-h-48 overflow-y-auto space-y-2 border rounded p-2">
          {users.map((u) => (
            <label
              key={u._id}
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                onChange={() => toggleUser(u)}
                checked={selectedUsers.some((x) => x._id === u._id)}
              />
              <span>{u.name}</span>
            </label>
          ))}
        </div>

        <button
          onClick={createGroupChat}
          disabled={selectedUsers.length < 2 || !groupName.trim()}
          className="w-full bg-blue-600 disabled:bg-gray-400 text-white py-2 rounded font-medium"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default Conversation;
