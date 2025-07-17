import axios from "axios";

const isProd = import.meta.env.MODE === "production";
const API_URL =
  import.meta.env.VITE_API_URL ||
  (isProd ? "http://13.50.137.242:5000/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
