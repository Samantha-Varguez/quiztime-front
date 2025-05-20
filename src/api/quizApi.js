import apiClient from './apiClient';

export const createQuiz = async (data) => {
    const response = await apiClient.post('/quizzes', data);
    return response.data; 
  };  
export const getQuizzes = () => apiClient.get('/quizzes');
export const getQuiz = (id) => apiClient.get(`/quizzes/${id}`);
export const updateQuiz = (id, data) => apiClient.put(`/quizzes/${id}`, data);
export const deleteQuiz = async (id) => {
    const response = await apiClient.delete(`/quizzes/${id}`);
    return response.data;
  };

