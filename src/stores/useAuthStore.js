import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PERMISSIONS } from '../utils/permissions';

const isAdmin = (user) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => {
        const roleName = typeof role === 'string' ? role : role.name;
        return roleName && (roleName.toLowerCase() === 'admin' || roleName.toLowerCase() === 'super_admin');
    });
};

const getPermissions = (user) => {
    let permissions = [];

    // 1. Direct permissions (if backend sends them as simple array of strings at root)
    if (user?.permissions && Array.isArray(user.permissions)) {
        user.permissions.forEach(p => {
            if (typeof p === 'string') permissions.push(p);
            else if (p.name) permissions.push(p.name);
        });
    }

    // 2. Extract from Roles
    if (user?.roles && Array.isArray(user.roles)) {
        user.roles.forEach(role => {
            if (role.permissions && Array.isArray(role.permissions)) {
                role.permissions.forEach(permission => {
                    const permissionName = typeof permission === 'string' ? permission : permission.name;
                    if (permissionName) permissions.push(permissionName);
                });
            }
        });
    }

    // Deduplicate
    permissions = [...new Set(permissions)];

    // 3. Fallback: If no permissions found but user is admin, give all permissions
    if (permissions.length === 0 && isAdmin(user)) {
        console.warn('No explicit permissions found for admin user. Granting all permissions as fallback.');
        permissions = Object.values(PERMISSIONS);
    }

    console.log('Processed Permissions:', permissions);
    return permissions;
};

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
                    permissions: getPermissions(user),
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
                permissions: getPermissions(user)
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
