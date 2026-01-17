# 📘 Front-End Implementation Guide & API Reference

This document outlines the complete user journey, implementation details, and a comprehensive API reference for the Accounting SaaS application.

---

## 🚀 1. Authentication & Setup

### A. Authentication
**Base URL**: `/api`

#### 1. Login
- **Endpoint**: `POST /login`
- **Description**: Authenticate a user and receive an API token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password",
    "device_name": "web-browser"
  }
  ```
- **Response**:
  ```json
  {
    "token": "1|laravel_sanctum_token_string..."
  }
  ```

#### 2. Logout
- **Endpoint**: `POST /logout`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `200 OK`

#### 3. Get Current User
- **Endpoint**: `GET /user`
- **Response**: Returns the authenticated user object with roles/permissions.

---

## 📦 2. Core Resources (CRUD)

All standard CRUD endpoints follow RESTful conventions.
**Headers Required**:
- `Authorization: Bearer {token}`
- `Accept: application/json`
- `X-Branch-ID: {branch_id}` (For branch-specific operations)

### A. Users
- **List**: `GET /users`
- **Create**: `POST /users`
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "roles": ["admin", "accountant"] // Optional
  }
  ```
- **Show**: `GET /users/{id}`
- **Update**: `PUT /users/{id}`
- **Delete**: `DELETE /users/{id}`

### B. Branches
- **List**: `GET /branches`
- **Create**: `POST /branches`
  ```json
  {
    "name": "Main Branch",
    "address": "123 Main St",
    "phone": "+123456789",
    "email": "branch@example.com"
  }
  ```
- **Show**: `GET /branches/{id}`
- **Update**: `PUT /branches/{id}`
- **Delete**: `DELETE /branches/{id}`

### C. Warehouses
- **List**: `GET /warehouses`
- **Create**: `POST /warehouses`
  ```json
  {
    "name": "Central Warehouse",
    "address": "Industrial Zone",
    "branch_id": 1
  }
  ```
- **Show**: `GET /warehouses/{id}`
- **Update**: `PUT /warehouses/{id}`
- **Delete**: `DELETE /warehouses/{id}`

### D. Chart of Accounts
- **List**: `GET /accounts`
- **Create**: `POST /accounts`
  ```json
  {
    "name_en": "Cash on Hand",
    "name_ar": "نقدية بالصندوق",
    "code": "101001",
    "parent_id": 10, // ID of parent account
    "type": "asset", // asset, liability, equity, revenue, expense
    "currency_id": 1,
    "is_selectable": true
  }
  ```
- **Show**: `GET /accounts/{id}`
- **Update**: `PUT /accounts/{id}`
- **Delete**: `DELETE /accounts/{id}`

### E. Treasuries (Cash Drawers)
- **List**: `GET /treasuries`
- **Create**: `POST /treasuries`
  ```json
  {
    "name": "Main Vault",
    "account_id": 50, // Linked GL Account
    "branch_id": 1
  }
  ```
- **Show**: `GET /treasuries/{id}`
- **Update**: `PUT /treasuries/{id}`
- **Delete**: `DELETE /treasuries/{id}`

### F. Bank Accounts
- **List**: `GET /bank-accounts`
- **Create**: `POST /bank-accounts`
  ```json
  {
    "bank_name": "CIB",
    "account_number": "1234567890",
    "iban": "EG123456...",
    "account_id": 51, // Linked GL Account
    "currency_id": 1,
    "branch_id": 1
  }
  ```
- **Show**: `GET /bank-accounts/{id}`
- **Update**: `PUT /bank-accounts/{id}`
- **Delete**: `DELETE /bank-accounts/{id}`

---

## 💰 3. Operations

### A. Invoices (Sales & Purchase)
#### 1. Create Invoice
- **Endpoint**: `POST /invoices`
- **Request Body**:
  ```json
  {
    "invoice_number": "INV-001",
    "date": "2024-01-01T12:00:00",
    "due_date": "2024-01-30T12:00:00", // Optional
    "account_id": 100, // Customer or Supplier Account ID
    "warehouse_id": 1,
    "type": "sale", // or "purchase"
    "notes": "Optional notes",
    "items": [
      {
        "product_id": 5, // Optional if using direct description
        "description": "Service or Product Name",
        "quantity": 1,
        "unit_price": 100.00,
        "tax_rate": 14 // Percentage (e.g., 14%)
      }
    ]
  }
  ```

#### 2. Finalize Invoice
- **Endpoint**: `POST /invoices/{id}/finalize`
- **Description**: Locks the invoice, updates stock, and posts journal entries.
- **Response**: Returns the finalized invoice object.

### B. Vouchers (Receipts & Payments)
- **Endpoint**: `POST /vouchers`
- **Request Body**:
  ```json
  {
    "voucher_number": "RCPT-001",
    "type": "receipt", // or "payment"
    "date": "2024-01-01T12:00:00",
    "amount": 500.00,
    "description": "Payment for Invoice #123",
    "account_id": 100, // Payer/Payee Account
    "treasury_id": 1, // Optional (if cash)
    "bank_account_id": null // Optional (if bank)
  }
  ```

### C. Transfers (Money Transfer)
- **Endpoint**: `POST /transfers`
- **Request Body**:
  ```json
  {
    "source_type": "treasury", // or "bank"
    "source_id": 1,
    "dest_type": "bank", // or "treasury"
    "dest_id": 2,
    "amount": 1000.00,
    "date": "2024-01-01T12:00:00",
    "reference_no": "TRF-999"
  }
  ```

---

## 📊 4. Monitoring & Reports

### A. Dashboard Stats
- **Endpoint**: `GET /dashboard/stats`
- **Response**:
  ```json
  {
    "cash_on_hand": 50000,
    "bank_balance": 120000,
    "sales_today": 15000,
    "purchases_today": 5000
  }
  ```

### B. Daily Journal
- **Endpoint**: `GET /operations/daily-journal`
- **Query Params**: `date` (required), `branch_id`, `status`
- **Response**: List of journal entries for the day.

### C. Invoices Monitor
- **Endpoint**: `GET /operations/invoices-monitor`
- **Query Params**: `date` (required), `branch_id`

### D. Financial Reports
#### 1. Trial Balance
- **Endpoint**: `GET /reports/trial-balance`
- **Query Params**: `start_date`, `end_date`, `branch_id`, `aggregate` (bool)

#### 2. Income Statement
- **Endpoint**: `GET /reports/income-statement`
- **Query Params**: `start_date`, `end_date`, `branch_id`

#### 3. Balance Sheet
- **Endpoint**: `GET /reports/balance-sheet`
- **Query Params**: `as_of_date`, `branch_id`

#### 4. Customer Statement
- **Endpoint**: `GET /reports/customer-statement/{accountId}`
- **Query Params**: `start_date`, `end_date`, `branch_id`

#### 5. Export Trial Balance
- **Endpoint**: `GET /reports/trial-balance/export`
- **Query Params**: Same as Trial Balance.
- **Response**: PDF Download.

---

## 🛠️ Technical Implementation Notes

### Headers
Always send these headers with requests:
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json",
  "X-Branch-ID": "{current_branch_id}"
}
```

### Error Handling
- **422 Unprocessable Entity**: Validation errors.
  ```json
  {
    "message": "The given data was invalid.",
    "errors": {
      "email": ["The email has already been taken."]
    }
  }
  ```
- **401 Unauthorized**: Token expired or invalid. Redirect to login.
- **403 Forbidden**: User lacks permission. Show alert.
