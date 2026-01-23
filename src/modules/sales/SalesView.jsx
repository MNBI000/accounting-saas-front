import React from 'react';
import { Box, Typography } from '@mui/material';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import InvoiceList from './InvoiceList';

const SalesView = () => {
    const { hasPermission } = usePermissions();

    if (!hasPermission(PERMISSIONS.INVOICES_VIEW)) {
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
                المبيعات
            </Typography>

            <InvoiceList />
        </Box>
    );
};

export default SalesView;
