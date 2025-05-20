import apiClient from './apiClient';

export const addOption = (data) => apiClient.post('/options', data);
