# Troubleshooting Guide

## App Running Successfully ✅

Based on the terminal output:
- Vite dev server is running on `http://localhost:8765`
- Electron has started successfully
- HMR (Hot Module Replacement) is working
- Files have been updated and reloaded

## What You Should See Now

### 1. **Electron Window Open**
You should have an Electron window open showing the application.

### 2. **Login Screen**
Since you're not authenticated yet, you should see:
- A login form with Arabic text "تسجيل الدخول" (Login)
- Email field labeled "البريد الإلكتروني"
- Password field labeled "كلمة المرور"
- A blue "دخول" (Enter) button

### 3. **Developer Tools**
The DevTools should be open automatically (right panel) showing the browser console.

## If You See a Blank White Screen

### Check DevTools Console
Look for error messages in the console. Common issues:

1. **Module import errors** - Check if all imports resolve correctly
2. **React rendering errors** - Look for red error messages
3. **Network errors** - Check if trying to connect to API

### Quick Fixes

#### Fix 1: Hard Refresh
In the Electron window, press:
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

#### Fix 2: Restart Dev Server
```bash
# Stop the current server (Ctrl+C in terminal)
npm run dev
```

#### Fix 3: Clear Browser Cache
In the Electron DevTools console, run:
```javascript
localStorage.clear();
location.reload();
```

## Testing the App

###  1. **Test Login** (Without Backend)
Since the backend might not be running, you can test the UI by temporarily bypassing auth:

**Option A**: Mock the login in DevTools console:
```javascript
// In Electron DevTools console
useAuthStore.getState().login({
    id: 1,
    name: "Test User",
    email: "admin@example.com",
    roles: ["Admin"],
    permissions: [
        "accounts.view", "accounts.create",
        "journal_entries.view", "journal_entries.create",
        "invoices.view", "invoices.create",
        "products.view", "products.create",
        "inventory.manage",
        "vouchers.view", "vouchers.create",
        "reports.trial_balance", "reports.income_statement",
        "fixed_assets.view"
    ]
}, "mock-token-123");
```

After running this, you should be redirected to the dashboard and see all 8 module cards.

### 2. **Test Different Roles**

**Accountant** (6 modules):
```javascript
useAuthStore.getState().login({
    id: 2,
    name: "Accountant User",
    email: "accountant@example.com",
    roles: ["Accountant"],
    permissions: [
        "accounts.view",
        "journal_entries.view", "journal_entries.create",
        "invoices.view", "invoices.finalize",
        "vouchers.view", "vouchers.create",
        "reports.trial_balance", "reports.income_statement",
        "fixed_assets.view"
    ]
}, "mock-token");
```

**Sales Agent** (2 modules):
```javascript
useAuthStore.getState().login({
    id: 3,
    name: "Sales Agent",
    email: "sales@example.com",
    roles: ["Sales_Agent"],
    permissions: [
        "invoices.view", "invoices.create",
        "reports.customer_statement"
    ]
}, "mock-token");
```

**Warehouse Manager** (3 modules):
```javascript
useAuthStore.getState().login({
    id: 4,
    name: "Warehouse Manager",
    email: "warehouse@example.com",
    roles: ["Warehouse_Manager"],
    permissions: [
        "products.view", "products.create", "products.edit",
        "inventory.manage",
        "invoices.view"
    ]
}, "mock-token");
```

### 3. **Test Logout**
In the sidebar, click the "تسجيل خروج" (Logout) button. You should be redirected back to the login screen.

## Expected Dashboard Features

Once logged in as Admin, you should see:

1. **Purple gradient welcome banner** with:
   - Your avatar (first letter of name)
   - Welcome message in Arabic
   - Your role and email

2. **8 colorful module cards**:
   - Each with an icon and color
   - Arabic title
   - English subtitle
   - Hover effect (card lifts up)

3. **Stats section** at the bottom (placeholder for now)

4. **Sidebar navigation** on the right (RTL):
   - Dashboard
   - Sales
   - Inventory  
   - Accounting
   - Reports
   - Treasury
   - Logout button at bottom

## Backend Connection (Next Step)

To connect to your Laravel backend:

1. **Start Laravel backend**:
   ```bash
   cd path/to/backend
   php artisan serve
   ```

2. **Check API URL** in `src/lib/axios.js`:
   - Should be `http://localhost:8000/api`

3. **Test login** with seeded users:
   - Email: `admin@example.com`
   - Password: `password`

## Still Having Issues?

### Check These Files
1. `src/App.jsx` - Main app component
2. `src/stores/useAuthStore.js` - Auth state
3. `src/modules/dashboard/DashboardView.jsx` - Dashboard
4. `src/components/layout/MainLayout.jsx` - Layout

### Common Errors and Solutions

**Error**: "Cannot read property 'permissions' of null"
- **Solution**: User is not logged in. Use mock login above.

**Error**: "useAuth is not defined"
- **Solution**: Check if `src/hooks/useAuth.js` exists and exports correctly.

**Error**: "Module not found"  
- **Solution**: Run `npm install` to ensure all dependencies are installed.

**Error**: "Blank screen, no errors"
- **Solution**: Check if `index.html` loads correctly. View source in DevTools.

## Current Status

✅ Dev server running on port 8765  
✅ Electron window launched  
✅ HMR working (files auto-reload)  
✅ All syntax errors fixed  
✅ Permission system implemented  
✅ Dashboard component created  

## What to Expect

The app should now display the login screen. Since there's no backend yet, use the DevTools console commands above to mock a login and test the dashboard with different permission sets.
