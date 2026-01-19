import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiAuth } from '../services/apiAuth';
import useAuthStore from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { login: setLogin, logout: setLogout, user, token, isAuthenticated } = useAuthStore();

    // Login Mutation
    const loginMutation = useMutation({
        mutationFn: ({ email, password }) => apiAuth.login(email, password),
        onSuccess: async (data) => {
            console.log('Login Mutation Success:', data);
            const { token, user } = data;

            // If user data is returned with login, use it directly
            if (user) {
                setLogin(user, token);
                navigate('/');
                return;
            }

            // Otherwise, save token and fetch user
            setLogin(null, token);

            // 2. Fetch the actual user data
            try {
                const userData = await apiAuth.getCurrentUser();
                setLogin(userData, token);
                navigate('/');
            } catch (error) {
                console.error('Failed to fetch user after login', error);
                // If fetching user fails, we might want to logout or handle it
            }
        },
        onError: (error) => {
            console.error('Login Mutation Error:', error);
        }
    });

    // Logout Mutation
    const logoutMutation = useMutation({
        mutationFn: () => apiAuth.logout(),
        onSuccess: () => {
            setLogout();
            queryClient.clear();
            navigate('/login');
        },
        onError: () => {
            // Even if API logout fails, we should clear local state
            setLogout();
            queryClient.clear();
            navigate('/login');
        }
    });

    return {
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        isLoggingOut: logoutMutation.isPending,
        user,
        token,
        isAuthenticated,
    };
};
