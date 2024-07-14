import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://real-estate-server-delta.vercel.app",
  withCredentials: true,
});

export default apiRequest;