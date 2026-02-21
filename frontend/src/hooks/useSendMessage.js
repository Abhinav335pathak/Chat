import { encryptMessage, decryptMessage } from "../utils/crypto.js";
import { sendMessage as sendMessageApi } from "../services/api.js";


export const useSendMessage = (socketRef, activeConversationId, setText, setMessages) => {
  return async (text = "", file = null) => {
    if (!activeConversationId) return;
    if (!text.trim() && !file) return;
    if (!socketRef.current || socketRef.current.readyState !== 1) return;

    let ciphertext = null;
    let iv = null;

    // 1. Encrypt Text if exists
    if (text.trim()) {
      const encrypted = await encryptMessage(text, import.meta.env.VITE_CHAT_SECRET);
      ciphertext = encrypted.ciphertext;
      iv = encrypted.iv;
    }

    // 2. Prepare FormData
    const formData = new FormData();
    if (ciphertext) formData.append("ciphertext", ciphertext);
    if (iv) formData.append("iv", iv);
    
    // Fix: Handle single file or array of files correctly
    if (file) {
      if (Array.isArray(file)) {
        file.forEach((f) => formData.append("files", f));
      } else {
        formData.append("files", file); // Single file case
      }
    }

    try {
      // 3. Send to API and get the response (which includes media URLs)
      const response = await sendMessageApi(activeConversationId, formData);
      const savedMsg = response.data;

      // 4. Decrypt text for local display
      const decryptedText = ciphertext
        ? await decryptMessage(ciphertext, iv, import.meta.env.VITE_CHAT_SECRET)
        : "";

      // Ensure media is properly structured
      const media = Array.isArray(savedMsg.media)
        ? savedMsg.media.map((m) => ({
            _id: m._id || m.id,
            url: m.url,
            type: m.type,
            publicId: m.publicId,
            size: m.size,
          }))
        : [];

      // 5. Add message to local state immediately for instant display
      setMessages((prev) => [
        ...prev,
        {
          ...savedMsg,
          text: decryptedText,
          media,
        },
      ]);

      // 6. Send via WebSocket to notify other users
      socketRef.current.send(
        JSON.stringify({
          type: "message",
          conversation: activeConversationId,
          ciphertext,
          iv,
          media: savedMsg.media || [],
          sender: savedMsg.sender,
          _id: savedMsg._id,
        })
      );

      setText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
};