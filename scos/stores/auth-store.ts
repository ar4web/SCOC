import { create } from 'zustand';
import { User, Language } from '@/types';
import { api } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const res = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
    if (res.success && res.data) {
      localStorage.setItem('scos_token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true });
      return { success: true };
    }
    return { success: false, error: res.error };
  },

  logout: () => {
    localStorage.removeItem('scos_token');
    document.cookie = 'scos_token=; path=/; max-age=0; SameSite=Lax';
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('scos_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    const res = await api.get<{ user: User }>('/auth/me');
    if (res.success && res.data) {
      set({ user: res.data.user, token, isAuthenticated: true, isLoading: false });
    } else {
      localStorage.removeItem('scos_token');
      set({ isLoading: false });
    }
  },
}));
