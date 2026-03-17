import apiClient from '../lib/axios';

export const apiCurrencies = {
    getAll: async () => {
        const response = await apiClient.get('/currencies');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/currencies/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/currencies', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/currencies/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/currencies/${id}`);
        return response.data;
    }
};
