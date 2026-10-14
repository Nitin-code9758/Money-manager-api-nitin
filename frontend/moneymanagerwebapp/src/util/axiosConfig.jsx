import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "http://localhost:8080/api/v1.0",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// In endpoints par token nahi bhejna
const excludeEndpoints = [
  "/login",
  "/register",
  "/status",
  "/activate",
  "/health",
];

// Request interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    const shouldSkipToken = excludeEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (!shouldSkipToken) {
      const accessToken = localStorage.getItem("token");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (error.response.status === 403) {
        console.error(
          "Access denied (403). Token, endpoint permissions, or backend security configuration check karein."
        );
      } else if (error.response.status >= 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    } else {
      console.error("Backend se connection nahi ho paaya.");
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;