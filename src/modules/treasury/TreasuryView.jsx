import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import VoucherList from './VoucherList';
import TreasuryList from './TreasuryList';

const TreasuryView = () => {
    const { hasPermission } = usePermissions();
    const [tabIndex, setTabIndex] = useState(0);

    const showVouchers = hasPermission(PERMISSIONS.VOUCHERS_VIEW);
    const showTreasuries = hasPermission(PERMISSIONS.TREASURIES_VIEW);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    if (!showVouchers && !showTreasuries) {
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

            <Tabs value={tabIndex} onChange={handleChange} sx={{ mb: 3 }}>
                {showVouchers && <Tab label="سندات القبض والصرف" />}
                {showTreasuries && <Tab label="إدارة الخزائن" />}
            </Tabs>

            {showVouchers && tabIndex === 0 && <VoucherList />}
            {showTreasuries && tabIndex === (showVouchers ? 1 : 0) && <TreasuryList />}
        </Box>
    );
};

export default TreasuryView;


