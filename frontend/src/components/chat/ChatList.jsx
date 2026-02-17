import React, { useEffect, useState } from "react";
import { useChatContext } from "../../context/ChatContext";
import { getConversations } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { decryptMessage } from "../../utils/crypto";
import { Link ,NavLink, useNavigate } from "react-router-dom";
import newchat from "../../assets/new-chat.png";
import more from "../../assets/more.png"
import "@fontsource/roboto";
import "../../index.css";

const ChatList = ({ activeConversation ,isMobile ,setavatar}) => {
  const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
  const { conversations, setConversations, setActiveConversation } =
    useChatContext();
  const { token, user, loading } = useAuth();
  const navigate = useNavigate();

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : null;

      const name = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).name
    : null;

  useEffect(() => {
    if (!token || loading) return;

    const load = async () => {
      try {
        const res = await getConversations();

        const decrypted = await Promise.all(
          res.data.map(async (conv) => {
            if (!conv.latestMessage?.ciphertext) return conv;

            const text = await decryptMessage(
              conv.latestMessage.ciphertext,
              conv.latestMessage.iv,
              import.meta.env.VITE_CHAT_SECRET
            );

            return {
              ...conv,
              latestMessage: {
                ...conv.latestMessage,
                previewText: text,
              },
            };
          })
        );

        setConversations(decrypted);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };

    load();
  }, [token, loading, setConversations]);

  const getChatName = (conv) => {
    if (conv.isGroup) return conv.groupName || "Group Chat";
    return conv.members.find((m) => m._id !== user?._id)?.name || "Chat";
  };

  const getavatar=(conv)=>{
    if(!conv.isGroup) return conv.avatar;
    return conv.members.find((m)=>m._id!==user?._id)?.avatar ;
  }


  const filtered = conversations.filter((conv) =>
    getChatName(conv).toLowerCase().includes(query.toLowerCase())
  );


  return (
    <div className={`${isMobile && activeConversation ? 'hidden md:block w-full' : `${activeConversation ? 'cursor-col-resize ' : 'w-full '} overflow-y-auto select-none w-full h-full border-4 border-emerald-950 dark:bg-[#161717]`} `}>
      {/* ✅ New Chat Button */}
      <div className="w-full flex justify-end items-center gap-3 pl-4 dark:bg-[#1d1f1f]">


  <button
    className=" w-20 h-20 flex items-center justify-center bg-white text-white rounded dark:bg-[#1d1f1f]"
    onClick={() =>
      activeConversation
        ? navigate(`/not-in/${userId}`)
        : navigate("/not-in/new")
    }
  >
    <img src={newchat} alt="New Chat" className="w-12 h-12 m-auto dark:invert" />
  </button>



       {/* for opening more button in both mobile or window devices
      !! */}




 <div className="flex justify-center bg-white z-20 dark:bg-[#1d1f1f]">
      <div onMouseLeave={() => setOpen(false)} onClick={()=>setOpen(true)} className="relative">
        <button onMouseOver={() => setOpen(true)} className="flex items-center p-2 rounded-md border-zinc-700">
     
          <img src={more} alt ="more" className="w-12 h-12 dark:invert "></img>
        </button>
          <nav>
        <ul 
          className={`absolute right-0 w-40 py-2  rounded-lg shadow-xl bg-neutral-300 dark:bg-[#161717] ${
            open ? "block" : "hidden"
          } ${isMobile ? "hidden ": "block"}`}
        >
               <NavLink to="/profile">
                   <li className="flex w-full items-center px-8 py-4 rounded-xl text-xl text-bold hover:bg-neutral-300 text-black dark:hover:bg-[#2d2e2e] dark:text-white">
            profile
          </li>
                    
        </NavLink>
             <NavLink to="/personal">
                   <li className="flex w-full items-center px-8 py-4 rounded-xl text-xl text-bold hover:bg-neutral-300 text-black dark:hover:bg-[#2d2e2e] dark:text-white">
            personalInfo
          </li>
                    
      </NavLink>


         <NavLink to="/logout">
                   <li className="flex w-full items-center px-8 py-4 rounded-xl text-xl text-bold hover:bg-neutral-300 text-black dark:hover:bg-[#2d2e2e] dark:text-white">
           Logout
          </li>
                    
        </NavLink>

        


          
        </ul>




<ul 
          className={`absolute right-0 w-40 py-2  rounded-lg shadow-xl  bg-neutral-300 dark:bg-[#161717] ${
            open ? "block" : "hidden"
          } ${isMobile ? "block ": "hidden"}`}
        >
               <NavLink to="/">
                   <li className="rounded-xl border-zinc-900 border-0 flex w-full items-center px-8 py-2 text-2xl text-bold hover:bg-stone-200 text-black dark:text-white dark:hover:bg-[#202222]">
            new group
          </li>
          

                    
        </NavLink>

        <NavLink to="/stared">
                   <li className="rounded-xl border-zinc-900 border-0 flex w-full items-center px-8 py-2 text-2xl hover:bg-stone-200 text-black dark:text-white dark:hover:bg-[#202222]">
            Stared Message
          </li>
          
                    
        </NavLink>

        <NavLink to="/selectChat">
                   <li className="rounded-xl border-zinc-900 border-0 flex w-full items-center px-8 py-2 text-2xl hover:bg-stone-200 text-black dark:text-white dark:hover:bg-[#202222]">
            Select Chat
          </li>  
        </NavLink>



             <NavLink to="/setting">
                   <li className="rounded-xl border-zinc-900 border-0 flex w-full items-center px-8 py-2 text-2xl hover:bg-stone-200 text-black dark:text-white dark:hover:bg-[#202222]">
            setting
          </li>
                    
      </NavLink>


         <NavLink to="/logout">
                   <li className="rounded-xl border-zinc-900 border-0 flex w-full items-center px-8 py-2 text-2xl hover:bg-stone-200 text-black dark:text-white dark:hover:bg-[#202222]">
           Logout
          </li>
                    
        </NavLink>

        


          
        </ul>


        </nav> 
        
      </div>
    </div>
</div>


    






{/* /////// input field for searching  */}
      
 <div className={`min-h-16 grid grid-rows-[minmax(30px,1vh)_1fr] font-sans  z-10  dark:bg-[#161717] dark:text-white transition-colors duration-300 `}>
      {/* Search Section */}
      <div className={`grid place-items-center bg-gray-50 dark:bg-[#161717] dark:text-white transition-colors duration-300  ${open} ? 'bg-opacity-100':''`}>
        <div className="relative w-[420px] h-[60px] ">
          <svg
            viewBox="0 0 420 60"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full "
          >
            <rect
              rx="30"
              ry="30"
              className=" w-full  h-full fill-none stroke-emerald-950 stroke-[10]"
            />

            <g className="">
              <circle
                cx="27"
                cy="27"
                r="8"
                className=" dark:bg-gray-900 dark:text-white transition-colors duration-300  fill-none stroke-emerald-950 stroke-[3]"
              />
              <line
                x1="32"
                y1="32"
                x2="44"
                y2="44"
                className=" dark:bg-gray-900 dark:text-white transition-colors duration-300 stroke-emerald-950 stroke-[3]"
              />
            </g>

            {/* Sparks */}
            <g>
              <circle cx="210" cy="30" r="4" className="fill-blue-500" />
              <circle cx="225" cy="25" r="4" className="fill-orange-400" />
              <circle cx="240" cy="35" r="4" className="fill-green-400" />
            </g>
          </svg>

          <input
            type="search"
            placeholder="Search..."
            className=" dark:bg-[#2d2e2e] dark:text-white transition-colors duration-300 dark:hover:bg-[#202222] absolute inset-0 w-full h-full bg-transparent pl-14 pr-8 rounded-full text-lg outline-none focus:ring-2 focus:ring-stone-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>








      
    </div>


      {filtered.length === 0 && <p className="text-center text-teal-950 mt-4 text-2xldark:bg-gray-900 dark:text-white transition-colors duration-300 ">Connect with people</p>}

      {filtered.map((conv) => (


        <div
          key={conv._id}
      className={`flex flex-row p-auto  rounded-3xl cursor-pointer w-full h-28 border-2 dark:bg-[#161717] dark:hover:bg-[#2d2e2e]  dark:text-white transition-colors duration-300" ${
  activeConversation?._id === conv._id
    ? "bg-gray-400 dark:bg-[#2d2e2e]"
    : "bg-slate-100 hover:bg-gray-300"
}`}

            onClick={() => {
            setActiveConversation(conv);
             setavatar(getavatar(conv));
              }}


        >

          <div className="w-16 h-16 rounded-full mt-auto ml-6 mr-6 ">
               {/* <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random&size=128`}
        alt={name}
        className="w-12 h-12 rounded-full mr-3"
      /> */}

                <img
        src={getavatar(conv)? getavatar(conv):`https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random&size=128`}
        alt={name}
        className="w-12 h-12 rounded-full mr-3"
      />
          </div>
          <div className="font-smooch font-semibold text-2xl from-neutral-800 px-auto mt-6 ">{getChatName(conv)}</div>

          {conv.latestMessage && (
            <div className="text-sm text-gray-600">
              {conv.latestMessage.previewText || "new message"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
