import api from './api';

export const hospitalService = {
  registerHospital: async (hospitalData) => {
    const response = await api.post('/hospital/register', hospitalData);
    return response.data;
  },

  getHospitals: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/hospital?${params}`);
    return response.data;
  },
};

export default hospitalService;
