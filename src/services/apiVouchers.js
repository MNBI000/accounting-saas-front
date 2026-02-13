import apiClient from '../lib/axios';

export const apiVouchers = {
    getAll: async () => {
        const response = await apiClient.get('/vouchers');
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/vouchers', data);
        return response.data;
    },

    update: async (id, data) => {
        // API guide doesn't explicitly mention PUT /vouchers/{id} but it's standard.
        // If not available, we might need to check. Assuming standard CRUD.
        const response = await apiClient.put(`/vouchers/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/vouchers/${id}`);
        return response.data;
    }
};
