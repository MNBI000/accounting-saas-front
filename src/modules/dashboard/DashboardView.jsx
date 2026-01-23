import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Typography,
    Paper,
    Avatar,
    Alert,
    LinearProgress
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    AccountBalance as AccountBalanceIcon,
    Receipt as ReceiptIcon,
    Inventory as InventoryIcon,
    AccountBalanceWallet as VoucherIcon,
    Assessment as ReportsIcon,
    Category as ProductsIcon,
    PostAdd as JournalIcon,
    Business as FixedAssetsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';

const DashboardView = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { hasAnyPermission } = usePermissions();

    // Dashboard widgets configuration with permissions
    const dashboardModules = [
        {
            id: 'accounts',
            title: 'دليل الحسابات',
            titleEn: 'Chart of Accounts',
            description: 'إدارة الحسابات والأرصدة',
            icon: AccountBalanceIcon,
            color: '#1976d2',
            path: '/accounting/accounts',
            requiredPermissions: [PERMISSIONS.ACCOUNTS_VIEW],
        },
        {
            id: 'journal-entries',
            title: 'القيود اليومية',
            titleEn: 'Journal Entries',
            description: 'إنشاء وعرض القيود المحاسبية',
            icon: JournalIcon,
            color: '#388e3c',
            path: '/accounting/journal-entries',
            requiredPermissions: [PERMISSIONS.JOURNAL_ENTRIES_VIEW],
        },
        {
            id: 'invoices',
            title: 'الفواتير',
            titleEn: 'Invoices',
            description: 'فواتير المبيعات والمشتريات',
            icon: ReceiptIcon,
            color: '#f57c00',
            path: '/sales',
            requiredPermissions: [PERMISSIONS.INVOICES_VIEW],
        },
        {
            id: 'products',
            title: 'المنتجات',
            titleEn: 'Products',
            description: 'إدارة كتالوج المنتجات',
            icon: ProductsIcon,
            color: '#7b1fa2',
            path: '/inventory?tab=products',
            requiredPermissions: [PERMISSIONS.PRODUCTS_VIEW],
        },
        {
            id: 'inventory',
            title: 'حركة المخزون',
            titleEn: 'Inventory Movements',
            description: 'إدخال وإخراج المخزون',
            icon: InventoryIcon,
            color: '#c2185b',
            path: '/inventory?tab=movements',
            requiredPermissions: [PERMISSIONS.INVENTORY_MANAGE],
        },
        {
            id: 'vouchers',
            title: 'سندات القبض والصرف',
            titleEn: 'Vouchers',
            description: 'إدارة الخزينة والبنوك',
            icon: VoucherIcon,
            color: '#0097a7',
            path: '/treasury/vouchers',
            requiredPermissions: [PERMISSIONS.VOUCHERS_VIEW],
        },
        {
            id: 'reports',
            title: 'التقارير المالية',
            titleEn: 'Financial Reports',
            description: 'ميزان المراجعة والقوائم المالية',
            icon: ReportsIcon,
            color: '#455a64',
            path: '/reports',
            requiredPermissions: [
                PERMISSIONS.REPORTS_TRIAL_BALANCE,
                PERMISSIONS.REPORTS_INCOME_STATEMENT,
                PERMISSIONS.REPORTS_BALANCE_SHEET,
            ],
        },
        {
            id: 'fixed-assets',
            title: 'الأصول الثابتة',
            titleEn: 'Fixed Assets',
            description: 'إدارة الأصول والإهلاك',
            icon: FixedAssetsIcon,
            color: '#5d4037',
            path: '/accounting/fixed-assets',
            requiredPermissions: [PERMISSIONS.FIXED_ASSETS_VIEW],
        },
    ];

    // Filter modules based on user permissions
    const visibleModules = dashboardModules.filter(module =>
        hasAnyPermission(module.requiredPermissions)
    );

    return (
        <Box>
            {/* Welcome Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                        sx={{
                            width: 60,
                            height: 60,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            fontSize: '1.5rem'
                        }}
                    >
                        {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            مرحباً, {user?.name || 'مستخدم'}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            {typeof user?.roles?.[0] === 'string'
                                ? user.roles[0]
                                : user?.roles?.[0]?.name || 'دور غير محدد'} • {user?.email}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
                    لوحة التحكم - نظام المحاسبة السحابي
                </Typography>
            </Paper>

            {/* No Permissions Warning */}
            {visibleModules.length === 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        لا توجد صلاحيات
                    </Typography>
                    <Typography variant="body2">
                        ليس لديك صلاحيات للوصول إلى أي من الوحدات. يرجى التواصل مع المسؤول لمنحك الصلاحيات المناسبة.
                    </Typography>
                </Alert>
            )}

            {/* Main Dashboard Grid */}
            <Grid container spacing={3}>
                {visibleModules.map((module) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={module.id}>
                        <Card
                            elevation={2}
                            sx={{
                                height: '100%',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <CardActionArea
                                onClick={() => navigate(module.path)}
                                sx={{ height: '100%' }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            gap: 2
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: module.color,
                                                width: 56,
                                                height: 56,
                                            }}
                                        >
                                            <module.icon fontSize="large" />
                                        </Avatar>
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 1,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {module.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        {module.description}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: module.color,
                                            fontWeight: 'medium',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5
                                        }}
                                    >
                                        {module.titleEn}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Stats Section (Optional - Requires API) */}
            {visibleModules.length > 0 && (
                <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        إحصائيات سريعة
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        سيتم عرض الإحصائيات اليومية هنا (إجمالي المبيعات، المشتريات، الرصيد النقدي...)
                    </Typography>
                    <LinearProgress sx={{ mt: 2, opacity: 0.3 }} />
                </Paper>
            )}
        </Box>
    );
};

export default DashboardView;
