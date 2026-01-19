# Dashboard Implementation with Permissions

## Overview
This document describes the implementation of the dashboard (لوحة التحكم) with role-based access control (RBAC) for the Accounting SaaS frontend application.

## What Was Implemented

### 1. **Enhanced Auth Store** (`src/stores/useAuthStore.js`)
- Added `permissions` array to store user permissions from login response
- Added `hasPermission(permission)` method to check single permission
- Added `hasAnyPermission(permissionList)` method to check if user has any of the specified permissions
- Updated `login()` to extract and store user permissions
- Updated `logout()` to clear permissions
- Updated `updateUser()` to update permissions when user data changes

**Usage:**
```javascript
const permissions = useAuthStore((state) => state.permissions);
const hasPermission = useAuthStore((state) => state.hasPermission);
const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);

// Check permission
if (hasPermission('invoices.create')) {
    // Show create invoice button
}

// Check any permission
if (hasAnyPermission(['invoices.view', 'invoices.create'])) {
    // Show invoices menu
}
```

### 2. **Permission Utilities** (`src/utils/permissions.js`)
Comprehensive permission management utilities including:

#### Permission Constants
All permissions are defined as constants following the `resource.action` pattern:
- `PERMISSIONS.ACCOUNTS_VIEW`, `ACCOUNTS_CREATE`, `ACCOUNTS_EDIT`, `ACCOUNTS_DELETE`
- `PERMISSIONS.JOURNAL_ENTRIES_VIEW`, `JOURNAL_ENTRIES_CREATE`, etc.
- `PERMISSIONS.INVOICES_VIEW`, `INVOICES_CREATE`, `INVOICES_EDIT`, `INVOICES_DELETE`, `INVOICES_FINALIZE`
- `PERMISSIONS.PRODUCTS_VIEW`, `PRODUCTS_CREATE`, `PRODUCTS_EDIT`, `PRODUCTS_DELETE`
- `PERMISSIONS.INVENTORY_MANAGE`
- `PERMISSIONS.VOUCHERS_VIEW`, `VOUCHERS_CREATE`, `VOUCHERS_EDIT`, `VOUCHERS_DELETE`
- `PERMISSIONS.REPORTS_*` (trial_balance, income_statement, balance_sheet, vat_return, customer_statement)
- `PERMISSIONS.FIXED_ASSETS_*`
- `PERMISSIONS.FINANCIAL_PERIODS_*`

#### Helper Functions
- `hasPermission(userPermissions, permission)` - Check single permission
- `hasAnyPermission(userPermissions, permissions)` - Check if user has ANY of the permissions
- `hasAllPermissions(userPermissions, permissions)` - Check if user has ALL permissions
- `filterMenuByPermissions(menuItems, userPermissions)` - Filter menu items

### 3. **usePermissions Hook** (`src/hooks/usePermissions.js`)
Custom React hook for easy permission checking in components:

```javascript
const { permissions, hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

// In component
{hasPermission(PERMISSIONS.INVOICES_CREATE) && (
    <Button>Create Invoice</Button>
)}
```

### 4. **Dashboard View** (`src/modules/dashboard/DashboardView.jsx`)
Beautiful, permission-aware dashboard with:

- **Welcome Section** with gradient background showing:
  - User avatar and name
  - User role and email
  - System title in Arabic

- **Module Cards** - Dynamically shown based on permissions:
  - Chart of Accounts (دليل الحسابات)
  - Journal Entries (القيود اليومية)
  - Invoices (الفواتير)
  - Products (المنتجات)
  - Inventory Movements (حركة المخزون)
  - Vouchers (سندات القبض والصرف)
  - Financial Reports (التقارير المالية)
  - Fixed Assets (الأصول الثابتة)

- **Permission-Based Filtering**: Users only see module cards they have access to
- **No Permissions Warning**: Alert shown if user has zero permissions
- **Quick Stats Placeholder**: Section for future dashboard statistics

**Features:**
- Responsive grid layout (xs=12, sm=6, md=4, lg=3)
- Hover effects with elevation and transform
- Color-coded module icons
- Arabic + English module titles
- Click to navigate to module

### 5. **Permission-Aware Navigation** (`src/components/layout/MainLayout.jsx`)
Updated sidebar navigation to filter menu items based on permissions:

- **Dashboard** - Always visible (no permission required)
- **Sales (المبيعات)** - Requires `invoices.view` OR `invoices.create`
- **Inventory (المخزون)** - Requires `products.view` OR `inventory.manage`
- **Accounting (الحسابات)** - Requires `accounts.view` OR `journal_entries.view`
- **Reports (التقارير)** - Requires any report permission
- **Treasury (الخزينة)** - Requires `vouchers.view`

Menu items are filtered using `useMemo` for performance optimization.

### 6. **Updated Routes** (`src/App.jsx`)
- Added DashboardView as the index route
- Added placeholder routes for:
  - `/sales`
  - `/inventory`
  - `/accounting`
  - `/reports`
  - `/treasury`

## How Permissions Work

### Login Flow
1. User logs in via `/api/login`
2. Backend returns user object with `permissions` array
3. Frontend stores user data including permissions in Zustand store
4. Permissions persist in localStorage via Zustand persist middleware

### Permission Check Flow
1. Component imports `usePermissions` hook or uses store directly
2. Calls `hasPermission()` or `hasAnyPermission()` with required permissions
3. Returns boolean based on user's permission array
4. Component conditionally renders UI elements

### Navigation Filtering
1. All menu items defined with `requiredPermissions` array (or null)
2. `useMemo` filters items on permission changes
3. Only accessible items shown in sidebar
4. Active route highlighting works correctly

## Role Examples

Based on `ROLES_AND_PERMISSIONS.md`:

### Admin
- Sees all 8 dashboard modules
- Has access to all navigation items
- Can perform all actions

### Accountant
- Sees: Accounts, Journal Entries, Invoices, Vouchers, Reports, Fixed Assets (6 modules)
- Hidden: Products, Inventory (no permissions)
- Can create journal entries and finalize invoices

### Sales_Agent
- Sees: Invoices, Reports (Customer Statement only)  (2 modules)
- Hidden: Everything else
- Can create invoices but cannot finalize

### Warehouse_Manager
- Sees: Invoices (view only), Products, Inventory (3 modules)
- Hidden: Accounting, Reports, Vouchers
- Can manage inventory and products

## UI/UX Features

### RTL Support
- All components use MUI's RTL-aware props
- Sidebar anchored to right
- Margins use `mr`, `ms`, `me` instead of left/right

### Material Design Compliance
- No custom CSS files
- All styling via MUI `sx` prop
- Uses theme colors and spacing
- Responsive breakpoints

### Visual Polish
- Gradient welcome banner
- Card hover effects (elevation + transform)
- Color-coded module icons
- Professional typography hierarchy
- Consistent spacing and padding

## Next Steps

To complete the implementation:

1. **Create Module Pages**:
   - Accounts page with tree view
   - Journal Entries form
   - Invoice creation/listing
   - Product catalog
   - Inventory movements
   - Voucher forms
   - Report viewers

2. **Add Permission Guards to Pages**:
   ```javascript
   // Example guard component
   const PageGuard = ({ permission, children }) => {
       const { hasPermission } = usePermissions();
       
       if (!hasPermission(permission)) {
           return <Navigate to="/unauthorized" />;
       }
       
       return children;
   };
   ```

3. **Button-Level Permissions**:
   ```javascript
   <Button
       disabled={!hasPermission(PERMISSIONS.INVOICES_CREATE)}
       onClick={handleCreate}
   >
       Create Invoice
   </Button>
   ```

4. **API Integration**:
   - Connect login to backend `/api/login`
   - Fetch dashboard stats from `/api/dashboard/stats`
   - Handle 403 errors in Axios interceptor

5. **Testing**:
   - Test with each role (Admin, Accountant, Sales_Agent, Warehouse_Manager)
   - Verify correct modules shown
   - Verify navigation filtering
   - Test permission persistence after refresh

## Test Users

Based on backend seeders:

| Email | Password | Role | Expected Modules |
|-------|----------|------|------------------|
| admin@example.com | password | Admin | All 8 modules |
| accountant@example.com | password | Accountant | 6 modules (no Products/Inventory) |
| sales_agent@example.com | password | Sales_Agent | 2 modules (Invoices, Reports) |
| warehouse_manager@example.com | password | Warehouse_Manager | 3 modules (Invoices view, Products, Inventory) |

## File Structure

```
src/
├── stores/
│   └── useAuthStore.js          # Enhanced with permissions
├── utils/
│   └── permissions.js           # Permission constants & utilities
├── hooks/
│   ├── useAuth.js              # Existing auth hook
│   └── usePermissions.js       # New permission hook
├── modules/
│   ├── auth/
│   │   └── LoginView.jsx       # Existing login
│   └── dashboard/
│       └── DashboardView.jsx   # New dashboard
├── components/
│   └── layout/
│       └── MainLayout.jsx      # Updated with permission filtering
└── App.jsx                     # Updated routes
```

## API Expected Response Format

The login endpoint should return:

```json
{
    "token": "1|xxxxxxxxxx",
    "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "roles": ["Admin"],
        "permissions": [
            "accounts.view",
            "accounts.create",
            "accounts.edit",
            "accounts.delete",
            "journal_entries.view",
            "journal_entries.create",
            // ... all user permissions
        ]
    }
}
```

## Notes

- All permission checks are client-side for UX only
- Backend MUST enforce permissions on API endpoints
- Never trust client-side permission checks for security
- Always validate permissions on the backend
- 403 responses should be handled gracefully

## Accessibility

- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support (via MUI)
- Screen reader compatible
- High contrast ratios

---

**Implementation Date**: 2026-01-19  
**Version**: 1.0  
**Status**: ✅ Complete - Ready for Testing
