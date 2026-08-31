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

export const adminService = {
  getDashboardAnalytics: async () => {
    const res = await axios.get(`${API_URL}/admin/dashboard`, getAuthHeaders());
    return res.data;
  },
  
  getUsers: async (role) => {
    const query = role ? `?role=${role}` : '';
    const res = await axios.get(`${API_URL}/admin/users${query}`, getAuthHeaders());
    return res.data;
  },

  createUser: async (data) => {
    const res = await axios.post(`${API_URL}/admin/users`, data, getAuthHeaders());
    return res.data;
  },

  getAppointments: async () => {
    const res = await axios.get(`${API_URL}/admin/appointments`, getAuthHeaders());
    return res.data;
  },

  getDepartments: async () => {
    const res = await axios.get(`${API_URL}/admin/departments`, getAuthHeaders());
    return res.data;
  },

  createDepartment: async (data) => {
    const res = await axios.post(`${API_URL}/admin/departments`, data, getAuthHeaders());
    return res.data;
  },

  getInventory: async () => {
    const res = await axios.get(`${API_URL}/admin/inventory`, getAuthHeaders());
    return res.data;
  },

  getPrescriptions: async () => {
    const res = await axios.get(`${API_URL}/admin/prescriptions`, getAuthHeaders());
    return res.data;
  },

  getBilling: async () => {
    const res = await axios.get(`${API_URL}/admin/billing`, getAuthHeaders());
    return res.data;
  },

  getAuditLogs: async () => {
    const res = await axios.get(`${API_URL}/admin/audit-logs`, getAuthHeaders());
    return res.data;
  },

  getSettings: async () => {
    const res = await axios.get(`${API_URL}/admin/settings`, getAuthHeaders());
    return res.data;
  },

  updateSettings: async (settings) => {
    const res = await axios.put(`${API_URL}/admin/settings`, settings, getAuthHeaders());
    return res.data;
  },

  updateUserRoleStatus: async (id, data) => {
    const res = await axios.put(`${API_URL}/admin/users/${id}`, data, getAuthHeaders());
    return res.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const res = await axios.put(`${API_URL}/admin/appointments/${id}`, { status }, getAuthHeaders());
    return res.data;
  },

  addMedicine: async (data) => {
    const res = await axios.post(`${API_URL}/admin/inventory`, data, getAuthHeaders());
    return res.data;
  },

  updateMedicine: async (id, data) => {
    const res = await axios.put(`${API_URL}/admin/inventory/${id}`, data, getAuthHeaders());
    return res.data;
  },

  deleteMedicine: async (id) => {
    const res = await axios.delete(`${API_URL}/admin/inventory/${id}`, getAuthHeaders());
    return res.data;
  },

  createInvoice: async (data) => {
    const res = await axios.post(`${API_URL}/admin/billing`, data, getAuthHeaders());
    return res.data;
  },

  updateInvoiceStatus: async (id, status) => {
    const res = await axios.put(`${API_URL}/admin/billing/${id}`, { status }, getAuthHeaders());
    return res.data;
  },
};
