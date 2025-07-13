import axios from 'axios';

export const BASE_URL = 'http://69.62.80.18:5000';

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default API;
