// // socket/call.js

// const WebSocket = require("ws");

// const activeCalls = new Map(); 
// // userId -> otherUserId

// const handleCallEvents = async ({
//   ws,
//   payload,
//   userId,
//   clients
// }) => {

//   const sendToUser = (targetUserId, data) => {
//     const client = clients.get(targetUserId);
//     if (client && client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(data));
//     }
//   };

//   switch (payload.type) {

//     /**
//      * =============================
//      * 1️⃣ CALL USER
//      * =============================
//      */
//     case "call-user": {
//       const { to } = payload;

//       if (!to) return;

//       // ❌ user busy
//       if (activeCalls.has(to)) {
//         sendToUser(userId, {
//           type: "user-busy"
//         });
//         return;
//       }

//       sendToUser(to, {
//         type: "incoming-call",
//         from: userId
//       });

//       break;
//     }

//     /**
//      * =============================
//      * 2️⃣ ACCEPT CALL
//      * =============================
//      */
//     case "accept-call": {
//       const { to } = payload;

//       activeCalls.set(userId, to);
//       activeCalls.set(to, userId);

//       sendToUser(to, {
//         type: "call-accepted",
//         from: userId
//       });

//       break;
//     }

//     /**
//      * =============================
//      * 3️⃣ REJECT CALL
//      * =============================
//      */
//     case "reject-call": {
//       const { to } = payload;

//       sendToUser(to, {
//         type: "call-rejected",
//         from: userId
//       });

//       break;
//     }

//     /**
//      * =============================
//      * 4️⃣ WEBRTC OFFER
//      * =============================
//      */
//     case "webrtc-offer": {
//       const { to, offer } = payload;

//       sendToUser(to, {
//         type: "webrtc-offer",
//         from: userId,
//         offer
//       });

//       break;
//     }

//     /**
//      * =============================
//      * 5️⃣ WEBRTC ANSWER
//      * =============================
//      */
//     case "webrtc-answer": {
//       const { to, answer } = payload;

//       sendToUser(to, {
//         type: "webrtc-answer",
//         from: userId,
//         answer
//       });

//       break;
//     }

//     /**
//      * =============================
//      * 6️⃣ ICE CANDIDATE
//      * =============================
//      */
//     case "ice-candidate": {
//       const { to, candidate } = payload;

//       sendToUser(to, {
//         type: "ice-candidate",
//         from: userId,
//         candidate
//       });

//       break;
//     }

//     /**
//      * =============================
//      * 7️⃣ END CALL
//      * =============================
//      */
//     case "end-call": {
//       const { to } = payload;

//       activeCalls.delete(userId);
//       activeCalls.delete(to);

//       sendToUser(to, {
//         type: "call-ended",
//         from: userId
//       });

//       break;
//     }

//     default:
//       break;
//   }
// };

// module.exports = {
//   handleCallEvents,
//   activeCalls
// };