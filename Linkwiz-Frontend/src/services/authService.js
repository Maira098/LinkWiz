import apiClient from './apiClient';

const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};

export default authService;