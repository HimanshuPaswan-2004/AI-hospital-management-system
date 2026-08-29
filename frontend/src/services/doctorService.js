import axios from 'axios';

// Get base URL from environment or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
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
};
