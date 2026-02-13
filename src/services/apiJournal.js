import apiClient from '../lib/axios';

export const apiJournal = {
    getAll: async () => {
        const response = await apiClient.get('/operations/daily-journal?date=' + new Date().toISOString());
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/operations/daily-journal/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/operations/daily-journal', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/operations/daily-journal/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/operations/daily-journal/${id}`);
        return response.data;
    }
};
