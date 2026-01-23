import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import AccountsList from './AccountsList';
import JournalEntriesList from './JournalEntriesList';
import { useSearchParams } from 'react-router-dom';

const AccountingView = () => {
    const { hasPermission } = usePermissions();
    const [searchParams, setSearchParams] = useSearchParams();

    const showAccounts = hasPermission(PERMISSIONS.ACCOUNTS_VIEW);
    const showJournalEntries = hasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW);

    const getInitialTab = () => {
        const tabParam = searchParams.get('tab');
        if (tabParam === 'journal_entries' && showJournalEntries) return showAccounts ? 1 : 0;
        return 0;
    };

    const [currentTab, setCurrentTab] = useState(getInitialTab());

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        const newTabName = newValue === (showAccounts ? 1 : 0) ? 'journal_entries' : 'accounts';
        setSearchParams({ tab: newTabName });
    };

    if (!showAccounts && !showJournalEntries) {
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
                الحسابات العامة
            </Typography>

            <Paper sx={{ width: '100%', mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    {showAccounts && <Tab label="دليل الحسابات" />}
                    {showJournalEntries && <Tab label="القيود اليومية" />}
                </Tabs>
            </Paper>

            <Box sx={{ mt: 2 }}>
                {showAccounts && currentTab === 0 && <AccountsList />}
                {showJournalEntries && currentTab === (showAccounts ? 1 : 0) && <JournalEntriesList />}
            </Box>
        </Box>
    );
};

export default AccountingView;
