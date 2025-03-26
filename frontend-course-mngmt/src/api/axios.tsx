import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Add "http://" to specify the protocol
});

// Attach the access token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (401), try refreshing the token
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Get the refresh token from localStorage
      const refreshToken = localStorage.getItem("refreshToken");

      // If no refresh token, redirect to login page
      if (!refreshToken) {
        // Handle redirect or show a message
        console.error("No refresh token available.");
        return Promise.reject(error);
      }

      // Make a request to the /refreshtoken endpoint
      try {
        let url;
        const type = localStorage.getItem("type");
        if (type === "students") {
          url = "/users/refresh";
        } else if (type === "teachers") {
          url = "/teachers/refresh";
        } else {
          url = "/admins/refresh";
        }

        const { data } = await api.post(url, { refreshToken });
        console.log(data);

        // If the refresh token is valid and a new access token is returned
        if (data.accessToken) {
          // Store the new access token
          localStorage.setItem("accessToken", data.accessToken);

          // Set the new access token in the Authorization header
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;

          // Retry the original request with the new access token
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token error (e.g., log out user if refresh fails)
        console.error("Refresh token expired or invalid", refreshError);

        // Clear tokens from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Redirect to login page or show a message
        // window.location.href = "/login";  // Uncomment to redirect to login
        return Promise.reject(refreshError);
      }
    }

    // If the request fails for another reason, return the error
    return Promise.reject(error);
  }
);

export default api;
