import apiClient from './apiClient';

const serviceService = {
  getAllServices: async () => {
    const response = await apiClient.get('/services');
    return response.data;
  },

  getServiceById: async (serviceId) => {
    const response = await apiClient.get(`/services/${serviceId}`);
    return response.data;
  },

  createService: async (serviceData) => {
    const response = await apiClient.post('/services', serviceData);
    return response.data;
  },

  updateService: async (serviceId, serviceData) => {
    const response = await apiClient.put(`/services/${serviceId}`, serviceData);
    return response.data;
  },

  deleteService: async (serviceId) => {
    const response = await apiClient.delete(`/services/${serviceId}`);
    return response.data;
  },

  getUserServices: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/services`);
    return response.data;
  },
};

export default serviceService;
