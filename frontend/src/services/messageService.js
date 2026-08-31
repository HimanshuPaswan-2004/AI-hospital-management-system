import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = user?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const messageService = {
  getContacts: async () => {
    const res = await axios.get(`${API_URL}/messages/contacts`, getAuthHeaders());
    return res.data;
  },

  getMessages: async (userId) => {
    const res = await axios.get(`${API_URL}/messages/${userId}`, getAuthHeaders());
    return res.data;
  },

  sendMessage: async (receiverId, content) => {
    const res = await axios.post(`${API_URL}/messages`, { receiverId, content }, getAuthHeaders());
    return res.data;
  }
};
