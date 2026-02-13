import apiClient from '../lib/axios';

export const apiTreasury = {
    getAll: async () => {
        const response = await apiClient.get('/treasuries');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/treasuries/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/treasuries', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/treasuries/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/treasuries/${id}`);
        return response.data;
    }
};
