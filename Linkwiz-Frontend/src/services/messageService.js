import apiClient from "./apiClient";

const messageService = {
  getMessages: async (userId) => {
    const response = await apiClient.get(`/messages/${userId}`);
    return response.data;
  },

  sendMessage: async (receiver, text) => {
    const response = await apiClient.post("/messages", {
      receiver,
      text
    });

    return response.data;
  }
};

export default messageService;