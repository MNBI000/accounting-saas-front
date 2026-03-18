import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import BranchesList from './components/BranchesList';
import UsersList from './components/UsersList';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
            style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
        >
            {value === index && (
                <Box sx={{ pt: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const AdminView = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                الإعدادات والإدارة
            </Typography>

            <Paper sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2, height: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
                        <Tab icon={<BusinessIcon />} iconPosition="start" label="الفروع" />
                        <Tab icon={<PeopleIcon />} iconPosition="start" label="المستخدمين" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <BranchesList />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <UsersList />
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default AdminView;
