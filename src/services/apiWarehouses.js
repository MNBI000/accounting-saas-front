import apiClient from '../lib/axios';

export const apiWarehouses = {
    getAll: async (params = {}) => {
        const response = await apiClient.get('/warehouses', { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/warehouses/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/warehouses', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(`/warehouses/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/warehouses/${id}`);
        return response.data;
    }
};
