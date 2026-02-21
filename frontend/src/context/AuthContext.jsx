import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlUser = params.get("user");

    if (urlToken && urlUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(urlUser));
        localStorage.setItem("token", urlToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(urlToken);
        setUser(userData);
        
        
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
  const checkGoogleSession = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/user`, {
        credentials: "include"
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data && data.email) {
        setUser(data);
        setToken("google-oauth-session"); // dummy token just to mark authenticated
      }
    } catch (err) {
    }
  };

  checkGoogleSession();
}, []);

  const login = async (email, password) => {
    try {
      const res = await loginApi(email, password);

      const { token, ...user } = res.data;

      if (!token) {
        throw new Error("Token missing from response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);

      return res;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);