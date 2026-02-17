import { useEffect, useRef } from "react";
import { decryptMessage } from "../utils/crypto";
import { connectSocket } from "../services/socket";

export const useChatSocket = (activeConversationId, setMessages) => {
  const socketRef = useRef(null);
  const activeConvRef = useRef(activeConversationId);
  const messageIdsRef = useRef(new Set()); // Track received message IDs to prevent duplicates
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
    
  useEffect(() => {
    activeConvRef.current = activeConversationId;
    messageIdsRef.current.clear(); // Clear message IDs when switching conversations
  }, [activeConversationId]);

  useEffect(() => {
    socketRef.current = connectSocket();

    socketRef.current.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.conversation !== activeConvRef.current) return;

      // Prevent duplicate messages
      if (messageIdsRef.current.has(msg._id)) return;
      messageIdsRef.current.add(msg._id);

      // Ignore own messages - they're already added to state in useSendMessage
      if (msg.sender?._id === userId) return;

      const decrypted = msg.ciphertext
        ? await decryptMessage(
            msg.ciphertext,
            msg.iv,
            import.meta.env.VITE_CHAT_SECRET
          )
        : "";

      setMessages((prev) => [...prev, { ...msg, text: decrypted }]);
    };

    return () => socketRef.current?.close();
  }, []);

  return socketRef;
};
useChatSocket.js
// import { useEffect, useRef } from "react";
// import { decryptMessage } from "../utils/crypto";
// import { connectSocket } from "../services/socket";

// export const useChatSocket = (activeConversationId, setMessages) => {
//   const socketRef = useRef(null);
//   const activeConvRef = useRef(activeConversationId);
//   const userId = JSON.parse(localStorage.getItem("user"))?._id;

//   useEffect(() => {
//     activeConvRef.current = activeConversationId;
//   }, [activeConversationId]);

//   useEffect(() => {
//     socketRef.current = connectSocket();

//     socketRef.current.onmessage = async (event) => {
//       const msg = JSON.parse(event.data);
//       if (msg.conversation !== activeConvRef.current) return;
//       if (msg.sender?._id === userId) return; // 🔥 ignore own socket echo

//       const text = msg.ciphertext
//         ? await decryptMessage(
//             msg.ciphertext,
//             msg.iv,
//             import.meta.env.VITE_CHAT_SECRET
//           )
//         : "";

//       setMessages((prev) => [...prev, { ...msg, text }]);
//     };

//     return () => socketRef.current?.close();
//   }, []);

//   return socketRef;
// };
