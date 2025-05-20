import apiClient from './apiClient';

export const submitQuizAnswers = (quizId, answers) =>
  apiClient.post(`/answers/${quizId}`, { answers });
