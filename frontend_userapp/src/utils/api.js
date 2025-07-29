import axios from "axios";

export const BASE_URL = "http://69.62.80.18:5000";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchMe = () => API.get("/auth/me").then((res) => res.data);

export const updateField = (field, value) =>
  API.patch("/auth/update", { [field]: value }).then((res) => res.data);

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getAllCoupons = () =>
  API.get("/auth/coupons").then((res) => res.data);

export default API;
