import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

import MainLayout from './components/layout/MainLayout';
import LoginView from './modules/auth/LoginView';
import DashboardView from './modules/dashboard/DashboardView';
import SalesView from './modules/sales/SalesView';
import CashierView from './modules/sales/CashierView';
import InventoryView from './modules/inventory/InventoryView';
import AccountingView from './modules/accounting/AccountingView';
import ReportsView from './modules/reports/ReportsView';
import TreasuryView from './modules/treasury/TreasuryView';
import useAuthStore from './stores/useAuthStore';
import theme from './config/theme';

// Create RTL cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

// Create a client
const queryClient = new QueryClient();

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<LoginView />} />

                            <Route path="/" element={
                                <ProtectedRoute>
                                    <MainLayout />
                                </ProtectedRoute>
                            }>
                                <Route index element={<DashboardView />} />
                                <Route path="sales" element={<SalesView />} />
                                <Route path="cashier" element={<CashierView />} />
                                <Route path="inventory" element={<InventoryView />} />
                                <Route path="accounting" element={<AccountingView />} />
                                <Route path="reports" element={<ReportsView />} />
                                <Route path="treasury" element={<TreasuryView />} />
                            </Route>
                        </Routes>
                    </Router>
                </QueryClientProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;

