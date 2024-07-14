import axios from "axios";

const apiRequest = axios.create({
  // baseURL: "https://real-estate-server-delta.vercel.app",
  baseURL: "http://localhost:5174",

  withCredentials: true,
});

export default apiRequest;