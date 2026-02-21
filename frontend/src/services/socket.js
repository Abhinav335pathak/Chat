export const connectSocket = () => {
  const token = localStorage.getItem("token");

  let baseUrl = import.meta.env.VITE_BACKEND_API_URL;

  // Fallback for local development
  if (!baseUrl) {
    baseUrl = "http://localhost:4000";
  }

  const wsUrl = baseUrl
    .replace("https://", "wss://")
    .replace("http://", "ws://");

  return new WebSocket(`${wsUrl}/ws?token=${token}`);
};
