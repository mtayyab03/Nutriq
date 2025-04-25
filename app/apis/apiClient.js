import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://nutriq.gr/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to requests, excluding /login
apiClient.interceptors.request.use(
  async (config) => {
    // Check if the request URL ends with '/login'
    if (config.url && config.url.endsWith("/login")) {
      return config; // Skip adding the Authorization header
    }

    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
