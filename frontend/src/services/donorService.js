import api from './api';

export const donorService = {
  registerDonor: async (donorData) => {
    const response = await api.post('/donor/register', donorData);
    return response.data;
  },

  getDonors: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/donor?${params}`);
    return response.data;
  },

  getDonorById: async (id) => {
    const response = await api.get(`/donor/${id}`);
    return response.data;
  },

  updateDonor: async (id, updates) => {
    const response = await api.put(`/donor/${id}`, updates);
    return response.data;
  },

  deleteDonor: async (id) => {
    const response = await api.delete(`/donor/${id}`);
    return response.data;
  },
};

export default donorService;
