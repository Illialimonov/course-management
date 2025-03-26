import { useState, useEffect } from "react";
import { login } from "../auth"; // Function to send API request

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [type, setType] = useState(""); // New state to track if authenticated

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true); // Set state to authenticated if token exists
    }
  }, []); // Runs only once when the component mounts

  const onFinish = async (values: {
    username: string;
    password: string;
    type: string;
  }) => {
    const { username, password, type } = values;
    setLoading(true);
    setError("");
    setType(type);

    try {
      const data = await login({ username, password, type });

      if (data.error) {
        setError("Login failed");
        return;
      }

      console.log(data.accessToken);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("type", type);

      console.log(localStorage.getItem("refreshToken"));

      setIsAuthenticated(true); // Mark user as authenticated

      if (type == "admin") {
        window.location.href = "/admin-panel";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return { onFinish, loading, error, type, isAuthenticated };
};

export default useAuth;
