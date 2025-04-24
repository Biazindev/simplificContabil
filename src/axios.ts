import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // 👈 aqui tem que ser a porta do seu backend
});

export default api;
