// import { openDB } from "idb";

// export const dbPromise = openDB("chat-db", 1, {
//   upgrade(db) {
//     const store = db.createObjectStore("messages", { keyPath: "_id" });
//     store.createIndex("chatId", "chat");
//     store.createIndex("createdAt", "createdAt");
//   },
// });

// export const saveMessages = async (messages) => {
//   const db = await dbPromise;
//   const tx = db.transaction("messages", "readwrite");
//   const store = tx.objectStore("messages");
//   messages.forEach((m) => store.put(m));
//   await tx.done;
// };

// export const getMessagesByChat = async (chatId) => {
//   const db = await dbPromise;
//   const index = db.transaction("messages").store.index("chatId");
//   return index.getAll(chatId);
// };

// // Get last message timestamp
// export const getLastMessageTime = async (chatId) => {
//   const db = await dbPromise;
//   const msgs = await getMessagesByChat(chatId);
//   return msgs.at(-1)?.createdAt;
// };

// // Clear chat cache (optional)
// export const clearChat = async (chatId) => {
//   const db = await dbPromise;
//   const tx = db.transaction("messages", "readwrite");
//   const store = tx.objectStore("messages");
//   const index = store.index("chatId");
//   const keys = await index.getAllKeys(chatId);
//   keys.forEach((key) => store.delete(key));
//   await tx.done;
// };
// export default {dbPromise ,saveMessages ,getLastMessageTime ,getMessagesByChat , getLastMessageTime , clearChat};