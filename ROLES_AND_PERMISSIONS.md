# User Roles and Permissions Guide

**Version:** 1.0  
**Last Updated:** 2026-01-19  
**System:** Accounting SaaS - Multi-Tenant Application

---

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Roles](#roles)
4. [Permissions Matrix](#permissions-matrix)
5. [Permission Categories](#permission-categories)
6. [Frontend Implementation Guidelines](#frontend-implementation-guidelines)
7. [API Endpoints](#api-endpoints)
8. [Testing Users](#testing-users)

---

## Overview

This accounting SaaS application uses **Spatie Laravel Permission** package for role-based access control (RBAC). The system implements a flexible permission model where:

- **Users** are assigned to **Roles**
- **Roles** have multiple **Permissions**
- Permissions control access to features, modules, and actions
- All permissions follow the format: `resource.action` (e.g., `invoices.create`)

---

## Authentication

### Login Endpoint
```
POST /api/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "1|xxxxxxxxxxxxxxxxxxxx",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "roles": ["Admin"],
    "permissions": [
      "accounts.view",
      "accounts.create",
      // ... all permissions
    ]
  }
}
```

### Logout Endpoint
```
POST /api/logout
Authorization: Bearer {token}
```

---

## Roles

The system defines **4 primary roles**, each with specific business functions:

### 1. **Admin**
- **Full System Access**
- Can perform all actions across all modules
- Manages users, roles, and system configuration
- Access to all financial periods and reports

### 2. **Accountant**
- **Financial Management Focus**
- Creates and manages journal entries
- Processes invoices and finalizes transactions
- Creates payment vouchers
- Generates financial reports
- Views fixed assets and accounts
- **Cannot:** Delete accounts, unlock financial periods, or manage inventory

### 3. **Sales_Agent**
- **Sales & Customer Focus**
- Creates and views sales invoices
- Views product catalog
- Generates customer statements
- **Limited Access:** No accounting, inventory, or system configuration

### 4. **Warehouse_Manager**
- **Inventory & Products Focus**
- Manages product catalog (view, create, edit)
- Handles inventory movements
- Views related invoices
- **Limited Access:** No financial reports or accounting entries

---

## Permissions Matrix

| Permission | Admin | Accountant | Sales_Agent | Warehouse_Manager |
|-----------|-------|-----------|-------------|-------------------|
| **Accounts** |
| `accounts.view` | ✅ | ✅ | ❌ | ❌ |
| `accounts.create` | ✅ | ❌ | ❌ | ❌ |
| `accounts.edit` | ✅ | ❌ | ❌ | ❌ |
| `accounts.delete` | ✅ | ❌ | ❌ | ❌ |
| **Journal Entries** |
| `journal_entries.view` | ✅ | ✅ | ❌ | ❌ |
| `journal_entries.create` | ✅ | ✅ | ❌ | ❌ |
| `journal_entries.edit` | ✅ | ✅ | ❌ | ❌ |
| `journal_entries.delete` | ✅ | ❌ | ❌ | ❌ |
| **Invoices** |
| `invoices.view` | ✅ | ✅ | ✅ | ✅ |
| `invoices.create` | ✅ | ✅ | ✅ | ❌ |
| `invoices.edit` | ✅ | ✅ | ❌ | ❌ |
| `invoices.delete` | ✅ | ❌ | ❌ | ❌ |
| `invoices.finalize` | ✅ | ✅ | ❌ | ❌ |
| **Products & Inventory** |
| `products.view` | ✅ | ❌ | ✅ | ✅ |
| `products.create` | ✅ | ❌ | ❌ | ✅ |
| `products.edit` | ✅ | ❌ | ❌ | ✅ |
| `products.delete` | ✅ | ❌ | ❌ | ❌ |
| `inventory.manage` | ✅ | ❌ | ❌ | ✅ |
| **Vouchers** |
| `vouchers.view` | ✅ | ✅ | ❌ | ❌ |
| `vouchers.create` | ✅ | ✅ | ❌ | ❌ |
| `vouchers.edit` | ✅ | ❌ | ❌ | ❌ |
| `vouchers.delete` | ✅ | ❌ | ❌ | ❌ |
| **Reports** |
| `reports.trial_balance` | ✅ | ✅ | ❌ | ❌ |
| `reports.income_statement` | ✅ | ✅ | ❌ | ❌ |
| `reports.balance_sheet` | ✅ | ✅ | ❌ | ❌ |
| `reports.vat_return` | ✅ | ✅ | ❌ | ❌ |
| `reports.customer_statement` | ✅ | ✅ | ✅ | ❌ |
| **Fixed Assets** |
| `fixed_assets.view` | ✅ | ✅ | ❌ | ❌ |
| `fixed_assets.create` | ✅ | ❌ | ❌ | ❌ |
| `fixed_assets.edit` | ✅ | ❌ | ❌ | ❌ |
| `fixed_assets.delete` | ✅ | ❌ | ❌ | ❌ |
| **Financial Periods** |
| `financial_periods.view` | ✅ | ✅ | ❌ | ❌ |
| `financial_periods.lock` | ✅ | ❌ | ❌ | ❌ |
| `financial_periods.unlock` | ✅ | ❌ | ❌ | ❌ |

---

## Permission Categories

### 1. **Accounts Module**
Resource: `accounts`

| Permission | Description |
|-----------|-------------|
| `accounts.view` | View chart of accounts |
| `accounts.create` | Create new accounts |
| `accounts.edit` | Edit existing accounts |
| `accounts.delete` | Delete accounts (restricted) |

**Business Rules:**
- Only selectable accounts can have journal entries posted
- Parent accounts cannot be deleted if they have children
- System accounts are protected from modification

---

### 2. **Journal Entries Module**
Resource: `journal_entries`

| Permission | Description |
|-----------|-------------|
| `journal_entries.view` | View all journal entries |
| `journal_entries.create` | Create manual journal entries |
| `journal_entries.edit` | Edit unposted entries |
| `journal_entries.delete` | Delete unposted entries (Admin only) |

**Business Rules:**
- Debits must equal credits
- Can only post to selectable accounts
- Entries in locked periods cannot be modified

---

### 3. **Invoices Module**
Resource: `invoices`

| Permission | Description |
|-----------|-------------|
| `invoices.view` | View sales and purchase invoices |
| `invoices.create` | Create new invoices |
| `invoices.edit` | Edit draft invoices |
| `invoices.delete` | Delete draft invoices (Admin only) |
| `invoices.finalize` | Finalize invoices (creates accounting entries) |

**Business Rules:**
- Finalized invoices cannot be edited or deleted
- Invoices automatically create journal entries when finalized
- VAT is calculated at 14% (Egyptian Tax)
- Arabic invoice format required for printing

---

### 4. **Products & Inventory Module**
Resources: `products`, `inventory`

| Permission | Description |
|-----------|-------------|
| `products.view` | View product catalog |
| `products.create` | Add new products |
| `products.edit` | Edit product details |
| `products.delete` | Delete products (Admin only) |
| `inventory.manage` | Manage stock movements (in/out) |

**Business Rules:**
- Uses Weighted Average Cost (WAC) method
- Stock movements automatically create journal entries
- Sale events trigger COGS and inventory adjustments

---

### 5. **Vouchers Module** (Treasury)
Resource: `vouchers`

| Permission | Description |
|-----------|-------------|
| `vouchers.view` | View payment/receipt vouchers |
| `vouchers.create` | Create new vouchers |
| `vouchers.edit` | Edit draft vouchers |
| `vouchers.delete` | Delete draft vouchers (Admin only) |

**Business Rules:**
- Vouchers affect cash/bank accounts
- Automatically create journal entries
- Support multi-currency transactions

---

### 6. **Reports Module**
Resource: `reports`

| Permission | Description |
|-----------|-------------|
| `reports.trial_balance` | Generate trial balance report |
| `reports.income_statement` | Generate income statement (P&L) |
| `reports.balance_sheet` | Generate balance sheet |
| `reports.vat_return` | Generate VAT return report |
| `reports.customer_statement` | Generate customer account statements |

**Business Rules:**
- Reports can be filtered by date range
- Support both English and Arabic formats
- Can export to PDF/Excel

---

### 7. **Fixed Assets Module**
Resource: `fixed_assets`

| Permission | Description |
|-----------|-------------|
| `fixed_assets.view` | View fixed assets register |
| `fixed_assets.create` | Add new fixed assets |
| `fixed_assets.edit` | Edit asset details |
| `fixed_assets.delete` | Delete assets (Admin only) |

**Business Rules:**
- Automatic depreciation calculation
- Creates monthly depreciation entries
- Links to asset accounts in chart of accounts

---

### 8. **Financial Periods Module**
Resource: `financial_periods`

| Permission | Description |
|-----------|-------------|
| `financial_periods.view` | View financial periods |
| `financial_periods.lock` | Lock periods to prevent edits |
| `financial_periods.unlock` | Unlock periods (Admin only) |

**Business Rules:**
- Locked periods prevent any transaction modification
- Only Admin can unlock periods
- Year-end closing requires period lock

---

## Frontend Implementation Guidelines

### 1. **Permission Checking**

The frontend should check permissions in multiple layers:

#### **Navigation Menu**
```javascript
// Example: Show/Hide menu items based on permissions
const userPermissions = user.permissions; // from login response

const menuItems = [
  {
    label: "Accounts",
    path: "/accounts",
    visible: userPermissions.includes("accounts.view")
  },
  {
    label: "Invoices",
    path: "/invoices",
    visible: userPermissions.includes("invoices.view")
  },
  // ... more items
];
```

#### **Page/Route Guards**
```javascript
// Example: Protect routes
function requirePermission(permission) {
  if (!user.permissions.includes(permission)) {
    redirect("/unauthorized");
  }
}
```

#### **UI Element Visibility**
```javascript
// Example: Show/Hide buttons
{userPermissions.includes("invoices.create") && (
  <button>Create Invoice</button>
)}

{userPermissions.includes("invoices.finalize") && (
  <button>Finalize Invoice</button>
)}
```

---

### 2. **Storing User Data**

Store user information and permissions after login:

```javascript
// In Zustand store or similar state management
const authStore = {
  user: null,
  token: null,
  permissions: [],
  
  login: async (email, password) => {
    const response = await api.post('/api/login', { email, password });
    
    set({
      user: response.data.user,
      token: response.data.token,
      permissions: response.data.user.permissions
    });
    
    // Store token for API requests
    localStorage.setItem('token', response.data.token);
  },
  
  hasPermission: (permission) => {
    return get().permissions.includes(permission);
  },
  
  hasAnyPermission: (permissions) => {
    return permissions.some(p => get().permissions.includes(p));
  },
  
  logout: async () => {
    await api.post('/api/logout');
    localStorage.removeItem('token');
    set({ user: null, token: null, permissions: [] });
  }
};
```

---

### 3. **API Authorization Header**

All API requests must include the Bearer token:

```javascript
// Axios interceptor example
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 4. **Permission-Based Rendering Patterns**

#### **Conditional Sections**
```javascript
{hasPermission("reports.trial_balance") && (
  <ReportsSection>
    <TrialBalanceReport />
  </ReportsSection>
)}
```

#### **Disabled States**
```javascript
<button 
  disabled={!hasPermission("invoices.edit")}
  onClick={handleEdit}
>
  Edit Invoice
</button>
```

#### **Field-Level Protection**
```javascript
<input
  type="number"
  value={quantity}
  readOnly={!hasPermission("inventory.manage")}
  onChange={handleChange}
/>
```

---

## API Endpoints

### User & Authentication
| Endpoint | Method | Permission | Description |
|----------|--------|-----------|-------------|
| `/api/login` | POST | Public | User login |
| `/api/logout` | POST | Authenticated | User logout |
| `/api/user` | GET | Authenticated | Get current user data |

### Accounts
| Endpoint | Method | Permission | Description |
|----------|--------|-----------|-------------|
| `/api/accounts` | GET | `accounts.view` | List all accounts |
| `/api/accounts` | POST | `accounts.create` | Create account |
| `/api/accounts/{id}` | PUT | `accounts.edit` | Update account |
| `/api/accounts/{id}` | DELETE | `accounts.delete` | Delete account |

### Journal Entries
| Endpoint | Method | Permission | Description |
|----------|--------|-----------|-------------|
| `/api/journal-entries` | GET | `journal_entries.view` | List entries |
| `/api/journal-entries` | POST | `journal_entries.create` | Create entry |
| `/api/journal-entries/{id}` | PUT | `journal_entries.edit` | Update entry |
| `/api/journal-entries/{id}` | DELETE | `journal_entries.delete` | Delete entry |

### Invoices
| Endpoint | Method | Permission | Description |
|----------|--------|-----------|-------------|
| `/api/invoices` | GET | `invoices.view` | List invoices |
| `/api/invoices` | POST | `invoices.create` | Create invoice |
| `/api/invoices/{id}` | PUT | `invoices.edit` | Update invoice |
| `/api/invoices/{id}` | DELETE | `invoices.delete` | Delete invoice |
| `/api/invoices/{id}/finalize` | POST | `invoices.finalize` | Finalize invoice |
| `/api/invoices/{id}/print` | GET | `invoices.view` | Print Arabic invoice |

### Products
| Endpoint | Method | Permission | Description |
|----------|--------|-----------|-------------|
| `/api/products` | GET | `products.view` | List products |
| `/api/products` | POST | `products.create` | Create product |
| `/api/products/{id}` | PUT | `products.edit` | Update product |
| `/api/products/{id}` | DELETE | `products.delete` | Delete product |

### Inventory
| Endpoint | Method | Permission | Description |
|----------|--------|-----------|-------------|
| `/api/stock-moves` | GET | `inventory.manage` | List stock movements |
| `/api/stock-moves` | POST | `inventory.manage` | Create stock movement |

### Reports
| Endpoint | Method | Permission | Description |
|----------|--------|-----------|-------------|
| `/api/reports/trial-balance` | GET | `reports.trial_balance` | Trial balance |
| `/api/reports/income-statement` | GET | `reports.income_statement` | P&L statement |
| `/api/reports/balance-sheet` | GET | `reports.balance_sheet` | Balance sheet |
| `/api/reports/vat-return` | GET | `reports.vat_return` | VAT return |
| `/api/reports/customer-statement` | GET | `reports.customer_statement` | Customer statement |

---

## Testing Users

The following test users are created by the seeders:

| Email | Password | Role | Use Case |
|-------|----------|------|----------|
| `admin@example.com` | `password` | Admin | Full system access, testing all features |
| `accountant@example.com` | `password` | Accountant | Financial operations, reports |
| `sales_agent@example.com` | `password` | Sales_Agent | Sales invoicing, customer statements |
| `warehouse_manager@example.com` | `password` | Warehouse_Manager | Inventory and product management |

**Default Password:** `password` (for all test users)

---

## Important Business Rules

### 1. **Financial Integrity**
- All debits must equal credits in journal entries
- Finalized invoices create automatic journal entries
- Stock movements create automatic accounting entries
- Deleted transactions must reverse accounting entries

### 2. **Period Locking**
- Locked periods prevent any transaction modification
- Only Admin can unlock periods
- Recommended: Lock periods monthly after reconciliation

### 3. **VAT Compliance**
- Egyptian VAT rate: **14%**
- VAT calculated per invoice line item
- Arabic tax invoice required for legal compliance
- VAT return reports required for tax authorities

### 4. **Inventory Costing**
- Uses **Weighted Average Cost (WAC)** method
- Costs updated automatically on purchases
- COGS calculated on sales
- Automatic GL postings for inventory movements

### 5. **Multi-Currency Support**
- Vouchers support multiple currencies
- Exchange rate tracking
- Currency gains/losses posted automatically

---

## Frontend Development Checklist

When building the frontend, ensure:

- [ ] Store user permissions after login
- [ ] Implement permission checking helper functions
- [ ] Show/hide navigation items based on permissions
- [ ] Protect routes with permission guards
- [ ] Disable/hide buttons for unauthorized actions
- [ ] Display appropriate error messages for 403 responses
- [ ] Handle token expiration and auto-logout
- [ ] Include Bearer token in all API requests
- [ ] Test with each role to verify access control
- [ ] Implement Arabic (RTL) support for invoices
- [ ] Handle error states gracefully

---

## Error Handling

### HTTP Status Codes

| Code | Situation | Frontend Action |
|------|-----------|----------------|
| 401 | Unauthenticated | Redirect to login |
| 403 | Unauthorized (no permission) | Show error message |
| 404 | Resource not found | Show not found page |
| 422 | Validation error | Display field errors |
| 500 | Server error | Show error message |

### Example Error Response
```json
{
  "message": "Forbidden",
  "error": "You do not have permission to perform this action"
}
```

---

## Contact & Support

For questions about permissions or role configuration:
- Review the `RolesAndPermissionsSeeder.php` for permission definitions
- Check `UserSeeder.php` for test user setup
- Consult with backend team for custom permission requirements

---

**Document Version:** 1.0  
**Maintained By:** Backend Team  
**For:** Frontend AI Agent & Development Team
