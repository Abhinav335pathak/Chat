import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (!auth) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  const { isAuthenticated, loading } = auth;

  if (loading) return <p>Loading...</p>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
