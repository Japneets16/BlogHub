// Handles all API requests with token support
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/user",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;