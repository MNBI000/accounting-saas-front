/**
 * Permission utility functions for role-based access control
 */

// Permission constants based on ROLES_AND_PERMISSIONS.md
export const PERMISSIONS = {
    // Accounts
    ACCOUNTS_VIEW: 'accounts.view',
    ACCOUNTS_CREATE: 'accounts.create',
    ACCOUNTS_EDIT: 'accounts.edit',
    ACCOUNTS_DELETE: 'accounts.delete',

    // Journal Entries
    JOURNAL_ENTRIES_VIEW: 'journal_entries.view',
    JOURNAL_ENTRIES_CREATE: 'journal_entries.create',
    JOURNAL_ENTRIES_EDIT: 'journal_entries.edit',
    JOURNAL_ENTRIES_DELETE: 'journal_entries.delete',

    // Invoices
    INVOICES_VIEW: 'invoices.view',
    INVOICES_CREATE: 'invoices.create',
    INVOICES_EDIT: 'invoices.edit',
    INVOICES_DELETE: 'invoices.delete',
    INVOICES_FINALIZE: 'invoices.finalize',

    // Products
    PRODUCTS_VIEW: 'products.view',
    PRODUCTS_CREATE: 'products.create',
    PRODUCTS_EDIT: 'products.edit',
    PRODUCTS_DELETE: 'products.delete',

    // Inventory
    INVENTORY_MANAGE: 'inventory.manage',

    // Vouchers
    VOUCHERS_VIEW: 'vouchers.view',
    VOUCHERS_CREATE: 'vouchers.create',
    VOUCHERS_EDIT: 'vouchers.edit',
    VOUCHERS_DELETE: 'vouchers.delete',

    // Reports
    REPORTS_TRIAL_BALANCE: 'reports.trial_balance',
    REPORTS_INCOME_STATEMENT: 'reports.income_statement',
    REPORTS_BALANCE_SHEET: 'reports.balance_sheet',
    REPORTS_VAT_RETURN: 'reports.vat_return',
    REPORTS_CUSTOMER_STATEMENT: 'reports.customer_statement',

    // Fixed Assets
    FIXED_ASSETS_VIEW: 'fixed_assets.view',
    FIXED_ASSETS_CREATE: 'fixed_assets.create',
    FIXED_ASSETS_EDIT: 'fixed_assets.edit',
    FIXED_ASSETS_DELETE: 'fixed_assets.delete',

    // Financial Periods
    FINANCIAL_PERIODS_VIEW: 'financial_periods.view',
    FINANCIAL_PERIODS_LOCK: 'financial_periods.lock',
    FINANCIAL_PERIODS_UNLOCK: 'financial_periods.unlock',
};

/**
 * Check if user has a specific permission
 * @param {string[]} userPermissions - Array of user permissions
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (userPermissions, permission) => {
    return userPermissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {string[]} userPermissions - Array of user permissions
 * @param {string[]} permissions - Permissions to check
 * @returns {boolean}
 */
export const hasAnyPermission = (userPermissions, permissions) => {
    return permissions.some(permission => userPermissions.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {string[]} userPermissions - Array of user permissions
 * @param {string[]} permissions - Permissions to check
 * @returns {boolean}
 */
export const hasAllPermissions = (userPermissions, permissions) => {
    return permissions.every(permission => userPermissions.includes(permission));
};

/**
 * Filter menu items based on user permissions
 * @param {Array} menuItems - Menu items with permission requirements
 * @param {string[]} userPermissions - Array of user permissions
 * @returns {Array} - Filtered menu items
 */
export const filterMenuByPermissions = (menuItems, userPermissions) => {
    return menuItems.filter(item => {
        if (!item.requiredPermission) return true;

        if (Array.isArray(item.requiredPermission)) {
            return hasAnyPermission(userPermissions, item.requiredPermission);
        }

        return hasPermission(userPermissions, item.requiredPermission);
    });
};
