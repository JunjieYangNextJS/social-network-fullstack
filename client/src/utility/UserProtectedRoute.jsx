import React from "react";
import { Navigate } from "react-router-dom";

export default function UserProtectedRoute({ user, isLoading, children }) {
  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
