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
                                <Route index element={<div>Dashboard Home</div>} />
                                <Route path="sales" element={<div>Sales Module</div>} />
                                <Route path="inventory" element={<div>Inventory Module</div>} />
                                <Route path="accounting" element={<div>Accounting Module</div>} />
                            </Route>
                        </Routes>
                    </Router>
                </QueryClientProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;

