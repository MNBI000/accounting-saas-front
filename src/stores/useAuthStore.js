import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            permissions: [],
            isAuthenticated: false,

            // Login Action
            login: (user, token) => {
                localStorage.setItem('auth_token', token); // Sync with axios interceptor
                set({
                    user,
                    token,
                    permissions: user?.permissions || [],
                    isAuthenticated: true
                });
            },

            // Logout Action
            logout: () => {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('current_branch_id');
                set({
                    user: null,
                    token: null,
                    permissions: [],
                    isAuthenticated: false
                });
            },

            // Update User Action
            updateUser: (user) => set({
                user,
                permissions: user.permissions || []
            }),

            // Check if user has a specific permission
            hasPermission: (permission) => {
                const { permissions } = get();
                return (permissions || []).includes(permission);
            },

            // Check if user has any of the permissions
            hasAnyPermission: (permissionList) => {
                const { permissions } = get();
                return permissionList.some(p => (permissions || []).includes(p));
            },
        }),
        {
            name: 'auth-storage', // unique name for localStorage key
        }
    )
);

export default useAuthStore;
