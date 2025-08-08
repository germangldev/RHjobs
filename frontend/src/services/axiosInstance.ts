// src/services/axiosInstance.ts
import axios from "axios";
import { getAuthKey, renewAuthKey, logout } from "./authService";

// Creamos una instancia única de Axios
const api = axios.create({
  baseURL: "http://localhost:8080", // URL base de tu backend
});

// ====================
// INTERCEPTOR REQUESTS
// ====================
// Se ejecuta ANTES de cada petición → añade el authKey (access token)
api.interceptors.request.use(
  (config) => {
    const token = getAuthKey();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ====================
// INTERCEPTOR RESPUESTAS
// ====================
// Si el backend responde 401 → intenta renovar el authKey automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // --- LOG 1: Log del error ---
    console.log("Interceptor detectó error:", error.response?.status);

    // Si el backend devuelve 401 y aún no hemos reintentado:
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log(" Entrando en bloque de renovación...");
      originalRequest._retry = true;

      try {
        // --- LOG 2: Llamando a renewAuthKey ---
        console.log("Llamando a /auth/refresh con sessionKey");
        const newAuthKey = await renewAuthKey();

        // --- LOG 3: Nuevo token obtenido ---
        console.log("Nuevo authKey obtenido:", newAuthKey);

        // Guardar en localStorage
        localStorage.setItem("authKey", newAuthKey);

        // Actualizar cabecera y reintentar
        originalRequest.headers.Authorization = `Bearer ${newAuthKey}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Error al renovar token:", refreshError);
        await logout();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;


