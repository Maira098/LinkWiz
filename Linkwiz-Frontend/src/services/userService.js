import apiClient from './apiClient';

const userService = {
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put('/users/me', userData);
    return response.data;
  },
};

export default userService;