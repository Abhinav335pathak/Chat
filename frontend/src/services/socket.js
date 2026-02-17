export const connectSocket = () => {
  const token = localStorage.getItem("token");
  return new WebSocket(`ws://localhost:4000/ws?token=${token}`);
};



