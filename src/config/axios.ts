import axios from "axios";
import config from "./appConfig";

const BACKEND_URL = config.BACKEND_URL;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để debug
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
