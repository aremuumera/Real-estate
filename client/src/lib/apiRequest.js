import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://realestatemern-f43d.onrender.com",
  // baseURL: "http://localhost:5174",

  withCredentials: true,
});

export default apiRequest;