import apiClient from './apiClient';

export const submitQuizAnswers =  async (quizId, answers) => {
  const res = await apiClient.post(`/answers/${quizId}`, { answers });
  return res.data;
};