import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import VoucherList from './VoucherList';
import TreasuryList from './TreasuryList';
import BankAccountList from './BankAccountList';
import CurrencyList from './CurrencyList';

const TreasuryView = () => {
    const { hasPermission } = usePermissions();
    const [searchParams, setSearchParams] = useSearchParams();

    const showVouchers = hasPermission(PERMISSIONS.VOUCHERS_VIEW);
    const showTreasuries = hasPermission(PERMISSIONS.TREASURIES_VIEW);

    const tabsConfig = [];
    if (showVouchers) {
        tabsConfig.push({ key: 'vouchers', label: 'سندات القبض والصرف', component: <VoucherList /> });
    }
    if (showTreasuries) {
        tabsConfig.push({ key: 'treasuries', label: 'إدارة الخزائن', component: <TreasuryList /> });
        tabsConfig.push({ key: 'bank_accounts', label: 'الحسابات البنكية', component: <BankAccountList /> });
        tabsConfig.push({ key: 'currencies', label: 'العملات', component: <CurrencyList /> });
    }

    const getInitialIndex = () => {
        const currentTabKey = searchParams.get('tab');
        const index = tabsConfig.findIndex(tab => tab.key === currentTabKey);
        return index !== -1 ? index : 0;
    };

    const [tabIndex, setTabIndex] = useState(getInitialIndex);

    useEffect(() => {
        setTabIndex(getInitialIndex());
    }, [searchParams]);

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
        const tabKey = tabsConfig[newValue]?.key;
        if (tabKey) {
            setSearchParams({ tab: tabKey });
        }
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
                {tabsConfig.map((tab, index) => (
                    <Tab key={tab.key} label={tab.label} />
                ))}
            </Tabs>

            {tabsConfig[tabIndex] && tabsConfig[tabIndex].component}
        </Box>
    );
};

export default TreasuryView;


