import apiClient from '../lib/axios';

export const apiAccounts = {
    getAll: async () => {
        const response = await apiClient.get('/accounts');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/accounts/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/accounts', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/accounts/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/accounts/${id}`);
        return response.data;
    }
};
