import api from './api';

export const requestService = {
  createRequest: async (requestData) => {
    const response = await api.post('/request', requestData);
    return response.data;
  },

  getRequests: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/request?${params}`);
    return response.data;
  },

  updateRequestStatus: async (id, status, notes = '') => {
    const response = await api.put(`/request/${id}`, { status, notes });
    return response.data;
  },

  triggerAiMatch: async (matchParams) => {
    const response = await api.post('/ai/match', matchParams);
    return response.data;
  },
};

export default requestService;
