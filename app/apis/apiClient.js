import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "https://nutriq.gr/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
