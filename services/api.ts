import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ⚠️ Durante desarrollo local: usa la IP de tu PC en la red WiFi
// Cámbiala si tu backend corre en otro puerto o servidor
const BASE_URL = 'http://192.168.0.104:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: adjunta el JWT a cada petición automáticamente
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('jwt-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: maneja errores 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('jwt-token');
    }
    return Promise.reject(error);
  }
);

export default api;
