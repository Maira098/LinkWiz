import apiClient from './apiClient';

const reviewService = {
  getAllReviews: async () => {
    const response = await apiClient.get('/reviews');
    return response.data;
  },

  getReviewById: async (reviewId) => {
    const response = await apiClient.get(`/reviews/${reviewId}`);
    return response.data;
  },

  getUserReviews: async (userId) => {
    const response = await apiClient.get(`/reviews/user/${userId}`);
    return response.data;
  },

  createReview: async (reviewData) => {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  },

  updateReview: async (reviewId, reviewData) => {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};

export default reviewService;
