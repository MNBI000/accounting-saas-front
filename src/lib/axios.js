import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Default local Laravel API
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Important for Sanctum cookies if used, or just good practice
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        // 1. Get Token from LocalStorage (or Zustand store if we could access it here easily)
        // For simplicity in this layer, we'll read from localStorage directly or rely on the store injecting it.
        // Let's assume we store it in localStorage for persistence.
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 2. Get Current Branch ID
        const branchId = localStorage.getItem('current_branch_id');
        if (branchId) {
            config.headers['X-Branch-ID'] = branchId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (response) {
            // Handle 401 Unauthorized (Token Expired/Invalid)
            if (response.status === 401) {
                // Clear local storage and redirect to login
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                // We might want to trigger a global event or use the store to logout
                window.location.href = '/#/login';
            }

            // Handle 403 Forbidden
            if (response.status === 403) {
                console.error('Permission Denied:', response.data.message);
                // Optionally show a toast notification here
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
