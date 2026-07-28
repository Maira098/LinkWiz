import apiClient from './apiClient';

const exchangeService = {
  createExchange: async (exchangeData) => {
    const response = await apiClient.post('/exchange', exchangeData);
    return response.data;
  },

  getIncoming: async () => {
    const response = await apiClient.get('/exchange/received');
    return response.data;
  },

  getOutgoing: async () => {
    const response = await apiClient.get('/exchange/sent');
    return response.data;
  },

  acceptExchange: async (exchangeId) => {
    const response = await apiClient.put(
      `/exchange/${exchangeId}/accept`
    );
    return response.data;
  },

  rejectExchange: async (exchangeId) => {
    const response = await apiClient.put(
      `/exchange/${exchangeId}/reject`
    );
    return response.data;
  },

  completeExchange: async (exchangeId) => {
    const response = await apiClient.put(
      `/exchange/${exchangeId}/complete`
    );
    return response.data;
  },

  getExchangeById: async (exchangeId) => {
    const response = await apiClient.get(
      `/exchange/${exchangeId}`
    );
    return response.data;
  },
};

export default exchangeService;