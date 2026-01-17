import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            // Login Action
            login: (user, token) => {
                localStorage.setItem('auth_token', token); // Sync with axios interceptor
                set({ user, token, isAuthenticated: true });
            },

            // Logout Action
            logout: () => {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('current_branch_id');
                set({ user: null, token: null, isAuthenticated: false });
            },

            // Update User Action
            updateUser: (user) => set({ user }),
        }),
        {
            name: 'auth-storage', // unique name for localStorage key
        }
    )
);

export default useAuthStore;
