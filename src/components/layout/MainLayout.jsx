import React, { useMemo } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';

const drawerWidth = 260;

const MainLayout = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const { hasAnyPermission } = usePermissions();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
    };

    // Define all menu items with their required permissions
    const allMenuItems = [
        {
            text: 'لوحة التحكم',
            icon: <DashboardIcon />,
            path: '/',
            requiredPermissions: null // Dashboard is accessible to all authenticated users
        },
        {
            text: 'المبيعات',
            icon: <ReceiptIcon />,
            path: '/sales',
            requiredPermissions: [
                PERMISSIONS.INVOICES_VIEW,
                PERMISSIONS.INVOICES_CREATE,
            ]
        },
        {
            text: 'نقطة البيع',
            icon: <PointOfSaleIcon />,
            path: '/cashier',
            requiredPermissions: [
                PERMISSIONS.INVOICES_CREATE,
            ]
        },
        {
            text: 'المخزون',
            icon: <InventoryIcon />,
            path: '/inventory',
            requiredPermissions: [
                PERMISSIONS.PRODUCTS_VIEW,
                PERMISSIONS.INVENTORY_MANAGE,
            ]
        },
        {
            text: 'الحسابات',
            icon: <AccountBalanceIcon />,
            path: '/accounting',
            requiredPermissions: [
                PERMISSIONS.ACCOUNTS_VIEW,
                PERMISSIONS.JOURNAL_ENTRIES_VIEW,
            ]
        },
        {
            text: 'التقارير',
            icon: <AssessmentIcon />,
            path: '/reports',
            requiredPermissions: [
                PERMISSIONS.REPORTS_TRIAL_BALANCE,
                PERMISSIONS.REPORTS_INCOME_STATEMENT,
                PERMISSIONS.REPORTS_BALANCE_SHEET,
                PERMISSIONS.REPORTS_VAT_RETURN,
                PERMISSIONS.REPORTS_CUSTOMER_STATEMENT,
            ]
        },
        {
            text: 'الخزينة',
            icon: <AccountBalanceWalletIcon />,
            path: '/treasury',
            requiredPermissions: [
                PERMISSIONS.VOUCHERS_VIEW,
            ]
        },
    ];

    // Filter menu items based on user permissions
    const menuItems = useMemo(() => {
        return allMenuItems.filter(item => {
            // If no permission required, show the item
            if (!item.requiredPermissions) return true;

            // Check if user has any of the required permissions
            return hasAnyPermission(item.requiredPermissions);
        });
    }, [hasAnyPermission]);

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ px: 2, py: 3 }}>
                <Typography
                    variant="h5"
                    noWrap
                    component="div"
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        letterSpacing: 1
                    }}
                >
                    Accounting SaaS
                </Typography>
            </Toolbar>
            <Divider />

            {/* User Profile Section in Sidebar */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {user?.name?.charAt(0) || <PersonIcon />}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
                        {user?.name || 'مستخدم'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                        {user?.email || ''}
                    </Typography>
                </Box>
            </Box>
            <Divider />

            <List sx={{ flexGrow: 1, px: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    '& .MuiListItemIcon-root': {
                                        color: 'primary.contrastText',
                                    },
                                    '&:hover': {
                                        bgcolor: 'primary.main',
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />
            <List sx={{ px: 1 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            color: 'error.main',
                            '& .MuiListItemIcon-root': { color: 'error.main' }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="تسجيل خروج" primaryTypographyProps={{ fontWeight: 500 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mr: { sm: `${drawerWidth}px` }, // Use mr for RTL
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                        {menuItems.find(i => i.path === location.pathname)?.text || 'لوحة التحكم'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    anchor="left" // Anchor to left (Start = Right in RTL)
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    anchor="left" // Anchor to left (Start = Right in RTL)
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: 'grey.50'
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
