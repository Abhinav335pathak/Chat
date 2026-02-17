import axios from "axios";
import { encryptMessage } from "../utils/crypto.js";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------------- AUTH ----------------
export const register = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

export const verifyOtpRegister = (otp, otpToken) =>
  api.post("/auth/verify-email", { otp, otpToken });

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const getCurrentUser = () => api.get("/auth/me");

export const logout = () => {
  localStorage.removeItem("token");
};
export const getUserById = (userId) => api.get(`/users/${userId}`);

export const getAllUsers = (conversationId) => api.get(`/users/not-in/${conversationId}`);

export const updateProfile =async (formData)=> {
   return api.put(`/users/update`,formData,{
     headers: { "Content-Type": "multipart/form-data"
   },});
}
// ---------------- CHAT ----------------
export const createConversation = (data) =>
  api.post("/conversations", data);


export const getConversations = () => api.get("/conversations");

export const getMessages = (conversationId) =>
  api.get(`/messages/${conversationId}`);



// api.js
export const sendMessage = async (conversationId,formData) => {


  return await api.post(`/messages/${conversationId}`, formData);
};


export const deleteMessage = async (messageIds) => {
  return await api.delete("/messages/delete", {
    data: { messageIds },
  });
};


export const lastActive = (userId) =>{
  api.post("/users/lastactive", { userId });  
}



export const getMedia = () => {
  return api.get("/media/allmedia");
};

export const deleteMedia = (mediaId) => {
  return api.delete(`/media/${mediaId}`);
};

// ---------------- STATUS ----------------
export const uploadStatus = async (formData) => {
  return api.post("/statuses/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const getStatusFeed = () => {
  return api.get("/statuses/feed");
};

export const getAllStatuses = () => {
  return api.get("/statuses/all");
};

export const getUserStatuses = () => {
  return api.get("/statuses/my");
};

export const markStatusViewed = (statusId) => {
  return api.put(`/statuses/${statusId}/view`);
};

export const deleteStatus = (statusId) => {
  return api.delete(`/statuses/${statusId}`);
};

export default api;
