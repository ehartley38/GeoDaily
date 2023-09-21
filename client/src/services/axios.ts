import axios from "axios";
// const BASE_URL = "http://localhost:3001/api";
const BASE_URL = "https://geodaily-node.fly.dev:8080/api";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
