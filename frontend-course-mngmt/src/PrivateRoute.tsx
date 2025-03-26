import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("accessToken"); // Fetch the token from localStorage
  const isAuthenticated = Boolean(token); // Check if the token exists

  return isAuthenticated ? children : <Navigate to="/student/login" />;
};

export default PrivateRoute;
