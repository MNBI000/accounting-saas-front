import apiClient from '../lib/axios';

export const apiBankAccounts = {
    getAll: async () => {
        const response = await apiClient.get('/bank-accounts');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/bank-accounts/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/bank-accounts', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/bank-accounts/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/bank-accounts/${id}`);
        return response.data;
    }
};
