import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type UserContextProviderProps = {
  children: ReactNode;
};

const RefirectToMain = ({ children }: UserContextProviderProps) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    return <Navigate to="/dashboard" />; // Redirect if logged in
  }

  return children;
};

export default RefirectToMain;
