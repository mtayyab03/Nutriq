import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://nutriq.gr/api",
  headers: {
    "Content-Type": "application/json",
  },
});
// Attach token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
