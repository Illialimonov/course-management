import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear what you need from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("type");

    // Optionally clear all:
    // localStorage.clear();

    // Redirect to login or home
    navigate("/student/login", { replace: true });
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;
