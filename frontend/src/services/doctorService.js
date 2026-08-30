import axios from 'axios';

// Get base URL from environment or fallback to localhost
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

export const doctorService = {
  // Get dashboard aggregate stats
  getDashboardStats: async () => {
    const response = await axios.get(`${API_URL}/doctors/dashboard`, getAuthHeaders());
    return response.data;
  },

  // Get doctor's unique patients
  getPatients: async () => {
    const response = await axios.get(`${API_URL}/doctors/patients`, getAuthHeaders());
    return response.data;
  },

  // Get appointments for the doctor (can be filtered by date in the backend if needed)
  getAppointments: async (date) => {
    const query = date ? `?date=${date}` : '';
    const response = await axios.get(`${API_URL}/appointments/schedule${query}`, getAuthHeaders());
    return response.data;
  },

  // Get prescriptions written by the doctor
  getPrescriptions: async () => {
    const response = await axios.get(`${API_URL}/records/prescriptions`, getAuthHeaders());
    return response.data;
  },
  
  // Get reports for the doctor's patients
  getReports: async () => {
    const response = await axios.get(`${API_URL}/records/reports`, getAuthHeaders());
    return response.data;
  },

  // Update doctor profile
  updateProfile: async (profileData) => {
    const response = await axios.put(`${API_URL}/users/profile`, profileData, getAuthHeaders());
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    const response = await axios.put(`${API_URL}/appointments/${appointmentId}/status`, { status }, getAuthHeaders());
    return response.data;
  },

  // Create a new prescription
  createPrescription: async (prescriptionData) => {
    const response = await axios.post(`${API_URL}/records/prescriptions`, prescriptionData, getAuthHeaders());
    return response.data;
  },

  // Chat with AI Assistant
  aiChat: async (message, history) => {
    const response = await axios.post(`${API_URL}/ai/chat`, { message, history }, getAuthHeaders());
    return response.data;
  },

  // Get message contacts
  getContacts: async () => {
    const response = await axios.get(`${API_URL}/messages/contacts`, getAuthHeaders());
    return response.data;
  },

  // Get chat history with a user
  getMessages: async (userId) => {
    const response = await axios.get(`${API_URL}/messages/${userId}`, getAuthHeaders());
    return response.data;
  },

  // Send a message
  sendMessage: async (receiverId, content) => {
    const response = await axios.post(`${API_URL}/messages`, { receiverId, content }, getAuthHeaders());
    return response.data;
  },
};
