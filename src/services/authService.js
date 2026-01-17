import apiClient from '../lib/axios';

export const authService = {
    login: async (email, password, device_name = 'desktop-app') => {
        const response = await apiClient.post('/login', {
            email,
            password,
            device_name,
        });
        return response.data;
    },

    logout: async () => {
        return await apiClient.post('/logout');
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/user');
        return response.data;
    },
};
