This `README.md` is designed to be the absolute authority for an AI Agent or a Senior Frontend Team. It enforces **Clean Architecture**, **SOLID Principles**, and strict adherence to **Material Design (MUI)** to avoid "CSS Spaghetti."

It is tailored for **Electron + React**, ensuring a desktop-native feel for your SaaS.

---

# ⚛️ Electron Financial Client (The Frontend Core)

## 1. Project Vision & Architecture

This project is the desktop interface for the **Multi-Tenant Accounting SaaS**. It is built using **Electron.js** and **React**, strictly adhering to **Material Design (MUI v5)** guidelines.

* **Philosophy:** "Configuration over Code." We do not write custom CSS. We use the Material Design System properties.
* **Pattern:** Modular Architecture (Domain-Driven Design).
* **Principles:** SOLID (Components are isolated, reusable, and logic-separated).
* **Target:** A high-performance, RTL-native (Arabic), offline-tolerant desktop application.

---

## 2. Technical Stack (The Tools)

| Category | Technology | Reasoning |
| --- | --- | --- |
| **Runtime** | **Electron.js (with Vite)** | Native desktop experience, printing access, auto-updates. |
| **Framework** | **React 18** | Industry standard, component-based. |
| **UI Library** | **MUI (Material UI v5)** | Strict Material Design implementation. **No custom CSS files allowed.** |
| **Data Grid** | **MUI X DataGrid** | High-performance tables for Financial Reports & Journals. |
| **State (Server)** | **TanStack Query (React Query)** | Caching, synchronization, and removing "useEffect" boilerplate. |
| **State (Client)** | **Zustand** | Lightweight global state (Theme, Sidebar, Current Branch). |
| **Forms** | **React Hook Form + Yup** | Performance-focused form validation. |
| **Routing** | **React Router DOM (HashRouter)** | Client-side routing compatible with Electron file system. |
| **HTTP Client** | **Axios** | With interceptors for Auth Tokens and Branch ID injection. |
| **I18n** | **i18next** | **Critical:** Full Arabic/RTL support. |

---

## 3. Folder Structure (SOLID Compliance)

We organize by **Feature/Domain**, not by file type.

```text
src/
├── assets/                # Static images/fonts
├── components/            # Shared "Dumb" Components (Atoms/Molecules)
│   ├── common/            # Buttons, Inputs (Wrapped MUI components)
│   ├── layout/            # Sidebar, Header, MainLayout
│   └── feedback/          # Loaders, ErrorBoundaries, Snackbars
├── config/                # App-wide constants (Routes, API_URL, Theme)
├── hooks/                 # Custom Hooks (useAuth, useDebounce)
├── lib/                   # Third-party logic wrappers (Axios instance, queryClient)
├── modules/               # ✨ THE CORE (Feature-based organization)
│   ├── auth/              # Login, Forgot Password
│   ├── accounting/        # COA, Journal Entries, GL
│   ├── sales/             # Invoices, Quotations, POS
│   ├── inventory/         # Products, Warehouses, StockMoves
│   └── reports/           # Financial Reports UI
├── services/              # API Service Layer (Repository Pattern)
│   ├── apiAuth.js
│   ├── apiAccounting.js
│   └── apiInvoices.js
├── stores/                # Zustand Stores (useAppStore, useUserStore)
├── utils/                 # Helper functions (CurrencyFormatter, DateParser)
├── App.jsx
└── main.tsx

```

---

## 4. Development Rules & Standards

### 🚫 Rule 1: No Custom CSS / SASS

* **Do not** create `.css` or `.scss` files.
* **Do not** use `styled-components`.
* **DO** use the `sx={{ }}` prop from MUI for one-off styles.
* **DO** use the `createTheme()` configuration for global consistency.

### 🏗 Rule 2: SOLID Components

* **Single Responsibility:** A component should not fetch data *and* render UI. Use a **Custom Hook** for logic/data, and pass props to the **View Component**.
* *Bad:* `<InvoiceList />` calls `axios.get` inside a useEffect.
* *Good:* `<InvoiceList />` calls `useInvoices()` hook.


* **Open/Closed:** Build components (like `DataTable`) that accept `columns` and `actions` as props, so they can be extended without modifying the source code.

### 🌍 Rule 3: RTL First (Arabic)

* The application defaults to `dir="rtl"`.
* Never use `margin-left` or `margin-right`. Use `marginStart` (ms) and `marginEnd` (me) in `sx` props to ensure layout flips correctly between Arabic and English.

---

## 5. Core Implementation Plan (Step-by-Step)

### Phase 1: The Foundation (System Skeleton)

1. **Theme Setup:** Configure MUI `createTheme` with primary colors, Arabic font (Cairo/Almarai), and RTL direction.
2. **Axios Interceptor:**
* Request: Attach `Authorization: Bearer <token>` and `X-Branch-ID: <id>`.
* Response: Handle 401 (Logout) and 403 (Permission Denied).


3. **Layout Shell:**
* Collapsible Sidebar (Navigation).
* Top Bar (Branch Switcher, User Profile, Notifications).



### Phase 2: Configuration & Master Data

1. **Branch Manager:** CRUD for Branches using `GenericTable` component.
2. **Chart of Accounts (Tree View):**
* Use MUI `TreeView` to visualize the nested set.
* Right-click context menu to "Add Sub-Account".



### Phase 3: Operations (The Heavy Lifting)

1. **Journal Entry Form:**
* **Complex Form:** Dynamic rows (Debit/Credit).
* **Validation:** Prevent submission if Total Debit != Total Credit.
* **Component:** `JournalRowRepeater`.


2. **Invoicing System:**
* **Product Lookup:** Async `Autocomplete` to search thousands of items.
* **Calculations:** Real-time Client-side calculation for VAT (14%) and Totals.
* **Printing:** Generate PDF blob from API or use Electron's `window.print()` with a dedicated print CSS media query.



### Phase 4: Reporting (Data Visualization)

1. **Data Grids:** Heavily use **MUI DataGrid Pro** (or standard) for Trial Balance.
* Features: Filtering, Sorting, Export to CSV (Client-side).


2. **Dashboards:**
* Widgets: `StatCard` (Total Sales), `LineChart` (Revenue History using Recharts).



---

## 6. Reusable Component Dictionary

*Implementing these generic components is the first task.*

| Component Name | Description | Material Equivalent |
| --- | --- | --- |
| `AppTable` | Generic data table with pagination, sort, and server-side filtering. | `MUI DataGrid` |
| `AppFormDialog` | A modal containing a form (Add Customer, Add Branch). | `Dialog` + `DialogContent` |
| `AppSelect` | Controlled dropdown with error handling. | `TextField (select)` |
| `AppSearch` | Async search for Customers/Products. | `Autocomplete` |
| `AppCurrency` | Formats numbers to EGP (e.g., 1,200.00 ج.م). | `Typography` |
| `AppPageHeader` | Standard title + "Add New" button + Breadcrumbs. | `Box` + `Typography` |

---

## 7. Electron Integration Features

1. **Thermal Printing:**
* Use IPC (Inter-Process Communication) to send raw ESC/POS commands for receipt printers (optional, advanced).
* Standard: Open a hidden window, render the Invoice HTML, call `webContents.print()`.


2. **Auto-Update:** Use `electron-updater` to pull new versions from the server.
3. **Offline Mode:** Use React Query `persistQueryClient` to save critical data (Products, Customers) to LocalStorage so invoices can be drafted offline (synced later).

---

## 8. Development Commands

```bash
# Install dependencies
npm install

# Run in Development Mode (Electron + Vite HMR)
npm run dev

# Build for Production (Windows .exe)
npm run build:win

```

---

## 9. Context for the AI Agent

*If you are an AI Agent reading this:*

1. Start by scaffolding the `src/config/theme.js` to ensure RTL works.
2. Create the `useAuth` hook and the Login Screen first.
3. Always prefer **MUI Grid (v2)** for layout.
4. For data fetching, create a custom hook `useFetch{Resource}` wrapping React Query.
5. **Strictly** follow the folder structure in Section 3.