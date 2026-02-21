import { useEffect, useRef } from "react";
import { decryptMessage } from "../utils/crypto.js";
import { connectSocket } from "../services/socket.js";

export const useChatSocket = (activeConversationId, setMessages) => {
  const socketRef = useRef(null);
  const activeConvRef = useRef(activeConversationId);
  const messageIdsRef = useRef(new Set()); 
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
    
  useEffect(() => {
    activeConvRef.current = activeConversationId;
    messageIdsRef.current.clear(); 
  }, [activeConversationId]);

  useEffect(() => {
    socketRef.current = connectSocket();

    socketRef.current.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.conversation !== activeConvRef.current) return;


      if (messageIdsRef.current.has(msg._id)) return;
      messageIdsRef.current.add(msg._id);

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
