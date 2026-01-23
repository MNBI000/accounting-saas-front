import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Button,
    useTheme,
    alpha
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import TrialBalance from './components/TrialBalance';
import IncomeStatement from './components/IncomeStatement';
import BalanceSheet from './components/BalanceSheet';
import VatReturn from './components/VatReturn';
import CustomerStatement from './components/CustomerStatement';

const ReportsView = () => {
    const theme = useTheme();
    const { hasPermission } = usePermissions();
    const [selectedReport, setSelectedReport] = React.useState(null);

    const reports = [
        {
            id: 'trial_balance',
            title: 'ميزان المراجعة',
            subtitle: 'Trial Balance',
            description: 'عرض أرصدة جميع الحسابات في فترة زمنية محددة',
            icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main,
            permission: PERMISSIONS.REPORTS_TRIAL_BALANCE,
            component: <TrialBalance onBack={() => setSelectedReport(null)} />
        },
        {
            id: 'income_statement',
            title: 'قائمة الدخل',
            subtitle: 'Income Statement',
            description: 'تقرير الأرباح والخسائر عن فترة مالية محددة',
            icon: <PaymentsIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.success.main,
            permission: PERMISSIONS.REPORTS_INCOME_STATEMENT,
            component: <IncomeStatement onBack={() => setSelectedReport(null)} />
        },
        {
            id: 'balance_sheet',
            title: 'الميزانية العمومية',
            subtitle: 'Balance Sheet',
            description: 'بيان المركز المالي للمنشأة في تاريخ محدد',
            icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.info.main,
            permission: PERMISSIONS.REPORTS_BALANCE_SHEET,
            component: <BalanceSheet onBack={() => setSelectedReport(null)} />
        },
        {
            id: 'vat_return',
            title: 'إقرار ضريبة القيمة المضافة',
            subtitle: 'VAT Return',
            description: 'تقرير ضريبة القيمة المضافة للمبيعات والمشتريات',
            icon: <ReceiptLongIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.warning.main,
            permission: PERMISSIONS.REPORTS_VAT_RETURN,
            component: <VatReturn onBack={() => setSelectedReport(null)} />
        },
        {
            id: 'customer_statement',
            title: 'كشف حساب عميل',
            subtitle: 'Customer Statement',
            description: 'تفاصيل حركات وأرصدة عميل محدد',
            icon: <PersonSearchIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.secondary.main,
            permission: PERMISSIONS.REPORTS_CUSTOMER_STATEMENT,
            component: <CustomerStatement onBack={() => setSelectedReport(null)} />
        }
    ];

    const availableReports = reports.filter(report => hasPermission(report.permission));

    if (selectedReport) {
        const report = reports.find(r => r.id === selectedReport);
        return report ? report.component : null;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                    التقارير المالية
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    اختر التقرير الذي ترغب في عرضه أو تصديره
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {availableReports.map((report) => (
                    <Grid item xs={12} sm={6} md={4} key={report.id}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: theme.shadows[10],
                                    '& .arrow-icon': {
                                        transform: 'translateX(5px)'
                                    }
                                },
                                borderRadius: 4,
                                border: '1px solid',
                                borderColor: 'divider',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={() => setSelectedReport(report.id)}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '100px',
                                    height: '100px',
                                    background: `linear-gradient(135deg, transparent 50%, ${alpha(report.color, 0.05)} 50%)`,
                                    zIndex: 0
                                }}
                            />
                            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 2
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 3,
                                            bgcolor: alpha(report.color, 0.1),
                                            color: report.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {report.icon}
                                    </Box>
                                    <IconButton className="arrow-icon" sx={{ transition: 'transform 0.3s' }}>
                                        <ArrowForwardIosIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                                    </IconButton>
                                </Box>

                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    {report.title}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1.5, fontWeight: 500, letterSpacing: 0.5 }}>
                                    {report.subtitle.toUpperCase()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {report.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {availableReports.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 10 }}>
                    <AssessmentIcon sx={{ fontSize: 100, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary">
                        لا توجد تقارير متاحة لصلاحياتك الحالية
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ReportsView;
