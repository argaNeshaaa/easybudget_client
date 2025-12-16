import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

export const aiApi = axios.create({
  baseURL: baseURL,
  timeout: 60000, // 60 detik
});
export default api;
