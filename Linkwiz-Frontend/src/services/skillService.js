import apiClient from './apiClient';

const skillService = {
  getAllSkills: async () => {
    const response = await apiClient.get('/skills');
    return response.data;
  },

  getSkillById: async (skillId) => {
    const response = await apiClient.get(`/skills/${skillId}`);
    return response.data;
  },

  createSkill: async (skillData) => {
    const response = await apiClient.post('/skills', skillData);
    return response.data;
  },

  updateSkill: async (skillId, skillData) => {
    const response = await apiClient.put(`/skills/${skillId}`, skillData);
    return response.data;
  },

  deleteSkill: async (skillId) => {
    const response = await apiClient.delete(`/skills/${skillId}`);
    return response.data;
  },

  getUserSkills: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/skills`);
    return response.data;
  },
};

export default skillService;
