import { useMemo } from 'react';
import useAuthStore from '../stores/useAuthStore';

/**
 * Custom hook for checking permissions
 * @returns {Object} Permission checking utilities
 */
export const usePermissions = () => {
    const permissions = useAuthStore((state) => state.permissions) || [];
    const hasPermission = useAuthStore((state) => state.hasPermission);
    const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

    return useMemo(() => ({
        permissions,
        hasPermission,
        hasAnyPermission,

        /**
         * Check if user has all of the specified permissions
         */
        hasAllPermissions: (permissionList) => {
            return permissionList.every(p => permissions.includes(p));
        },
    }), [permissions, hasPermission, hasAnyPermission]);
};
