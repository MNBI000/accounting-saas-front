import React from 'react';
import { Box, Typography } from '@mui/material';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import VoucherList from './VoucherList';

const TreasuryView = () => {
    const { hasPermission } = usePermissions();

    const showVouchers = hasPermission(PERMISSIONS.VOUCHERS_VIEW);

    if (!showVouchers) {
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
                الخزينة
            </Typography>

            <VoucherList />
        </Box>
    );
};

export default TreasuryView;
