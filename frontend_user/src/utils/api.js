import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = "http://192.168.29.74:5000";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchMe = () => API.get("/auth/me").then((res) => res.data);

export const updateField = (field, value) =>
  API.patch("/auth/update", { [field]: value }).then((res) => res.data);


export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};

export const getAllCoupons = () =>
  API.get("/auth/coupons").then((res) => res.data);

export default API;
