import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, ...userData } = response.data;
          // Guardar token de forma segura
          await SecureStore.setItemAsync('jwt-token', token);
          set({ user: userData, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Error al iniciar sesión';
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          const { token, ...newUser } = response.data;
          await SecureStore.setItemAsync('jwt-token', token);
          set({ user: newUser, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error: any) {
          const msg = error.response?.data?.message || 'Error al registrarse';
          set({ error: msg, isLoading: false });
          return { success: false, error: msg };
        }
      },

      logout: async () => {
        await SecureStore.deleteItemAsync('jwt-token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // No persistir el token aquí — ya está en SecureStore
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
