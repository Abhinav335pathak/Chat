import { useEffect } from "react";
import { getMessages } from "../services/api";
import { decryptMessage } from "../utils/crypto";

export const useChatMessages = (activeConversationId, setMessages, setText) => {

  useEffect(() => {
    if (!activeConversationId) return;

    const load = async () => {
      try {
        const res = await getMessages(activeConversationId);
        
        const messages = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.messages)
          ? res.data.messages
          : [];

        const decrypted = await Promise.all(
          messages.map(async (msg) => {
            const text = msg.ciphertext
              ? await decryptMessage(msg.ciphertext, msg.iv, import.meta.env.VITE_CHAT_SECRET)
              : "";

            // Ensure media is always an array with proper structure
            const media = Array.isArray(msg.media)
              ? msg.media.map((m) => ({
                  _id: m._id || m.id,
                  url: m.url,
                  type: m.type,
                  publicId: m.publicId,
                  size: m.size,
                }))
              : [];

            return {
              ...msg,
              text,
              media,
            };
          })
        );

        setMessages(decrypted);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    load();

    return () => {
      setText("");
    };

  }, [activeConversationId, setMessages, setText]);
};

