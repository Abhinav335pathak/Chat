import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useChatContext } from "../context/ChatContext.jsx";
import { getConversations } from "../services/api.js";
import { decryptMessage } from "../utils/crypto.js";

export const useProfileUpdate = () => {
  const { user, updateUser } = useAuth();
  const { setConversations } = useChatContext();

  useEffect(() => {
    // Listen for profile updates from storage changes
    const handleStorageChange = async (e) => {
      if (e.key === "user" && e.newValue) {
        const newUser = JSON.parse(e.newValue);
        updateUser(newUser);
        
        // Refresh conversations to reflect updated user info
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
          console.error("Failed to refresh conversations after profile update", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user, updateUser, setConversations]);
};
