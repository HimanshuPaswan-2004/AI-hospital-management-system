import { create } from 'zustand';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth';

const useAuthStore = create((set) => ({
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',

  register: async (userData) => {
    set({ isLoading: true, isError: false, message: '' });
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      if (response.data) {
        set({ isLoading: false, isSuccess: true });
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
      return false;
    }
  },

  login: async (userData) => {
    set({ isLoading: true, isError: false, message: '' });
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      if (response.data) {
        sessionStorage.setItem('user', JSON.stringify(response.data));
        set({ user: response.data, isLoading: false, isSuccess: true });
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
      return false;
    }
  },

  logout: () => {
    sessionStorage.removeItem('user');
    set({ user: null, isSuccess: false, isError: false, message: '' });
  },

  updateUser: (updatedUser) => {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    const newUser = { ...currentUser, ...updatedUser };
    sessionStorage.setItem('user', JSON.stringify(newUser));
    set({ user: newUser });
  },

  fetchMe: async () => {
    set({ isLoading: true, isError: false, message: '' });
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user || !user.token) throw new Error('No token found');
      
      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      if (response.data) {
        const updatedUser = { ...user, ...response.data };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser, isLoading: false, isSuccess: true });
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },

  reset: () => set({ isError: false, isSuccess: false, isLoading: false, message: '' }),

}));

export default useAuthStore;
