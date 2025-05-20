import apiClient from './apiClient';

export const addQuestion = async (data) => {
    const response = await apiClient.post('/questions', data);
    return response.data;
  };
  export const getQuestions = async (quizId) => {
    const response = await apiClient.get(`/questions?quizId=${quizId}`);
    return response.data; // ✅ make sure backend sends array here
  };
  