import axios from "axios";
import { encryptMessage } from "../utils/crypto.js";

const API_BASE = import.meta.env.VITE_BACKEND_API_URL;

const api = axios.create({
  baseURL: API_BASE, // /api removed from here
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- AUTH ----------------
export const register = (name, email, password) =>
  api.post("/api/auth/register", { name, email, password });

// export const verifyOtpRegister = (otp, otpToken) =>
//   api.post("/api/auth/verify-email", { otp, otpToken });

export const login = (email, password) =>
  api.post("/api/auth/login", { email, password });

export const getCurrentUser = () => 
  api.get("/api/auth/me");

export const logout = () => {
  localStorage.removeItem("token");
};

export const getUserById = (userId) => 
  api.get(`/api/users/${userId}`);

export const getAllUsers = (conversationId) => 
  api.get(`/api/users/not-in/${conversationId}`);

export const updateProfile = async (formData) => {
  return api.put(`/api/users/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ---------------- CHAT ----------------
export const createConversation = (data) => 
  api.post("/api/conversations", data);

export const getConversations = () => 
  api.get("/api/conversations");

export const getMessages = (conversationId) =>
  api.get(`/api/messages/${conversationId}`);

export const sendMessage = async (conversationId, formData) => {
  return await api.post(`/api/messages/${conversationId}`, formData);
};

export const deleteMessage = async (messageIds) => {
  return await api.delete("/api/messages/delete", {
    data: { messageIds },
  });
};

export const lastActive = (userId) => {
  return api.post("/api/users/lastactive", { userId });
};

export const getMedia = () => {
  return api.get("/api/media/allmedia");
};

export const deleteMedia = (mediaId) => {
  return api.delete(`/api/media/${mediaId}`);
};

// ---------------- STATUS ----------------
export const uploadStatus = async (formData) => {
  return api.post("/api/statuses/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getStatusFeed = () => {
  return api.get("/api/statuses/feed");
};

export const getAllStatuses = () => {
  return api.get("/api/statuses/all");
};

export const getUserStatuses = () => {
  return api.get("/api/statuses/my");
};

export const markStatusViewed = (statusId) => {
  return api.put(`/api/statuses/${statusId}/view`);
};

export const deleteStatus = (statusId) => {
  return api.delete(`/api/statuses/${statusId}`);
};

export default api;