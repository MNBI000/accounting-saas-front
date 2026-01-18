import apiClient from '../lib/axios';

export const apiAuth = {
    login: async (email, password, device_name = 'web-browser') => {
        const response = await apiClient.post('/login', {
            email,
            password,
            device_name,
        });
        return response.data; // Should return { token: "..." }
    },

    logout: async () => {
        return await apiClient.post('/logout');
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/user');
        return response.data;
    },
};
