import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import ProductList from './ProductList';
import StockMovements from './StockMovements';

import { useSearchParams } from 'react-router-dom';

const InventoryView = () => {
    const { hasPermission } = usePermissions();
    const [searchParams, setSearchParams] = useSearchParams();

    const showProducts = hasPermission(PERMISSIONS.PRODUCTS_VIEW);
    const showStock = hasPermission(PERMISSIONS.INVENTORY_MANAGE);

    // Determine initial tab based on query param or permissions
    const getInitialTab = () => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'movements' && showStock) return showProducts ? 1 : 0;
        return 0;
    };

    const [currentTab, setCurrentTab] = useState(getInitialTab());

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        // Update URL
        const newTabName = newValue === (showProducts ? 1 : 0) ? 'movements' : 'products';
        setSearchParams({ tab: newTabName });
    };

    if (!showProducts && !showStock) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" color="error">
                    ليس لديك صلاحية للوصول إلى هذه الصفحة
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                إدارة المخزون
            </Typography>

            <Paper sx={{ width: '100%', mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    {showProducts && <Tab label="المنتجات" />}
                    {showStock && <Tab label="حركة المخزون" />}
                </Tabs>
            </Paper>

            <Box sx={{ mt: 2 }}>
                {showProducts && currentTab === 0 && <ProductList />}
                {showStock && currentTab === (showProducts ? 1 : 0) && <StockMovements />}
            </Box>
        </Box>
    );
};

export default InventoryView;
