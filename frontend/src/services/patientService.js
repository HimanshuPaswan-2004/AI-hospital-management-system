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

export const patientService = {
  // Appointments
  getAppointments: async () => {
    const response = await axios.get(`${API_URL}/appointments/my-appointments`, getAuthHeaders());
    return response.data;
  },
  bookAppointment: async (data) => {
    const response = await axios.post(`${API_URL}/appointments`, data, getAuthHeaders());
    return response.data;
  },
  getAvailableSlots: async (doctorId, date) => {
    const response = await axios.get(`${API_URL}/appointments/slots?doctorId=${doctorId}&date=${date}`, getAuthHeaders());
    return response.data;
  },

  // Doctors
  getDoctors: async (search = '', specialization = '') => {
    const response = await axios.get(`${API_URL}/doctors?search=${search}&specialization=${specialization}`, getAuthHeaders());
    return response.data;
  },

  // Medical Records
  getPrescriptions: async () => {
    const response = await axios.get(`${API_URL}/records/prescriptions`, getAuthHeaders());
    return response.data;
  },
  getLabReports: async () => {
    const response = await axios.get(`${API_URL}/records/reports`, getAuthHeaders());
    return response.data;
  },
  uploadLabReport: async (formData) => {
    const config = getAuthHeaders();
    config.headers['Content-Type'] = 'multipart/form-data';
    const response = await axios.post(`${API_URL}/records/reports`, formData, config);
    return response.data;
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    // We will aggregate stats since there is no specific backend endpoint for patient dashboard stats
    const [appointments, prescriptions, labReports] = await Promise.all([
      axios.get(`${API_URL}/appointments/my-appointments`, getAuthHeaders()).then(r => r.data).catch(() => []),
      axios.get(`${API_URL}/records/prescriptions`, getAuthHeaders()).then(r => r.data).catch(() => []),
      axios.get(`${API_URL}/records/reports`, getAuthHeaders()).then(r => r.data).catch(() => [])
    ]);

    const upcomingAppointments = appointments.filter(apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'CANCELLED');

    return {
      upcomingAppointmentsCount: upcomingAppointments.length,
      upcomingAppointments,
      totalPrescriptions: prescriptions.length,
      recentPrescriptions: prescriptions.slice(0, 5),
      totalLabReports: labReports.length,
      recentLabReports: labReports.slice(0, 5),
    };
  },

  // Messages
  getContacts: async () => {
    const response = await axios.get(`${API_URL}/messages/contacts`, getAuthHeaders());
    return response.data;
  },
  getMessages: async (userId) => {
    const response = await axios.get(`${API_URL}/messages/${userId}`, getAuthHeaders());
    return response.data;
  },
  sendMessage: async (receiverId, content) => {
    const response = await axios.post(`${API_URL}/messages`, { receiverId, content }, getAuthHeaders());
    return response.data;
  },

  // Profile
  updateProfile: async (data) => {
    const response = await axios.put(`${API_URL}/users/profile`, data, getAuthHeaders());
    return response.data;
  },

  // AI Tools
  aiChat: async (message, history) => {
    const response = await axios.post(`${API_URL}/ai/chat`, { message, history }, getAuthHeaders());
    return response.data;
  },
  aiSymptomChecker: async (symptoms) => {
    const response = await axios.post(`${API_URL}/ai/symptom-checker`, { symptoms }, getAuthHeaders());
    return response.data;
  },
  aiSummarizeReport: async (data) => {
    const response = await axios.post(`${API_URL}/ai/summarize-report`, data, getAuthHeaders());
    return response.data;
  },
  aiExplainPrescription: async (data) => {
    const response = await axios.post(`${API_URL}/ai/explain-prescription`, data, getAuthHeaders());
    return response.data;
  },
  aiRecommendDoctor: async (concern) => {
    const response = await axios.post(`${API_URL}/ai/recommend-doctor`, { concern }, getAuthHeaders());
    return response.data;
  },
  aiFindAppointmentSlots: async (requestText) => {
    const response = await axios.post(`${API_URL}/ai/find-appointment-slots`, { requestText }, getAuthHeaders());
    return response.data;
  },
};
