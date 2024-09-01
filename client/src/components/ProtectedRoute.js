import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {
  const tokenKey = role === "admin" ? "adminToken" : "moduleLeaderToken";
  // Retrieving the token from local storage
  const token = localStorage.getItem(tokenKey);

  // If token is not present, navigate to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("moduleLeaderToken");
      return <Navigate to="/" />;
    }
    // If token is present, render the child components
    return children;
  } catch (error) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("moduleLeaderToken");
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
