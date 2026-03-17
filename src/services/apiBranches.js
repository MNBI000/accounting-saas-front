import apiClient from '../lib/axios';

export const apiBranches = {
    getAll: async () => {
        const response = await apiClient.get('/branches');
        return response.data;
    }
};
