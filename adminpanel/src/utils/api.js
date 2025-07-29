import axios from "axios";

export const BASE_URL = "/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default API;
