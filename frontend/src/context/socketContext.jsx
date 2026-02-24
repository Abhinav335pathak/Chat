// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { connectSocket } from "../services/socket.js";

// const SocketContext = createContext(null);

// // Provider component
// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     // Create WebSocket connection
//     const ws = connectSocket();

//     ws.onopen = () => {
//       console.log("✅ WebSocket connected");
//     };

//     ws.onclose = () => {
//       console.log("❌ WebSocket disconnected");
//     };

//     ws.onerror = (err) => {
//       console.error("WebSocket error:", err);
//     };

//     setSocket(ws);

//     // Cleanup on unmount
//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// // Hook to use socket in any component
// export const useSocket = () => {
//   const socket = useContext(SocketContext);
//   if (!socket) {
//     console.warn("WebSocket is not connected yet!");
//   }
//   return socket;
// };