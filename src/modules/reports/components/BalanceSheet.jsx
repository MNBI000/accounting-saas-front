import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    IconButton,
    Divider,
    Stack,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';

const BalanceSheet = ({ onBack }) => {
    const [asOfDate, setAsOfDate] = useState('2026-12-31');

    // Mock data for Balance Sheet
    const currentAssets = [
        { name: 'الصندوق', amount: 50000 },
        { name: 'البنك', amount: 150000 },
        { name: 'العملاء', amount: 75000 },
        { name: 'المخزون', amount: 120000 },
    ];

    const fixedAssets = [
        { name: 'الأثاث والمعدات', amount: 45000 },
        { name: 'مجمع الإهلاك', amount: -5000 },
    ];

    const currentLiabilities = [
        { name: 'الموردين', amount: 45000 },
        { name: 'مصاريف مستحقة', amount: 8000 },
    ];

    const equity = [
        { name: 'رأس المال', amount: 200000 },
        { name: 'الأرباح المحتجزة', amount: 182000 },
    ];

    const totalCurrentAssets = currentAssets.reduce((sum, item) => sum + item.amount, 0);
    const totalFixedAssets = fixedAssets.reduce((sum, item) => sum + item.amount, 0);
    const totalAssets = totalCurrentAssets + totalFixedAssets;

    const totalLiabilities = currentLiabilities.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={onBack} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>الميزانية العمومية</Typography>
                        <Typography variant="caption" color="text.secondary">Balance Sheet (Statement of Financial Position)</Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<PrintIcon />}>طباعة</Button>
                    <Button variant="contained" startIcon={<DownloadIcon />}>تصدير Excel</Button>
                </Stack>
            </Box>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            label="في تاريخ"
                            type="date"
                            value={asOfDate}
                            onChange={(e) => setAsOfDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<FilterListIcon />}
                            sx={{ height: 56 }}
                        >
                            تحديث التقرير
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                {/* Assets Column */}
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            الأصول (Assets)
                        </Typography>
                        <Table size="small">
                            <TableBody>
                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>الأصول المتداولة</TableCell>
                                </TableRow>
                                {currentAssets.map((item) => (
                                    <TableRow key={item.name}>
                                        <TableCell sx={{ pl: 4 }}>{item.name}</TableCell>
                                        <TableCell align="right">{item.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>إجمالي الأصول المتداولة</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', borderTop: '1px solid black' }}>
                                        {totalCurrentAssets.toLocaleString()}
                                    </TableCell>
                                </TableRow>

                                <TableRow><TableCell colSpan={2} sx={{ border: 0, py: 1 }}></TableCell></TableRow>

                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>الأصول الثابتة</TableCell>
                                </TableRow>
                                {fixedAssets.map((item) => (
                                    <TableRow key={item.name}>
                                        <TableCell sx={{ pl: 4 }}>{item.name}</TableCell>
                                        <TableCell align="right">{item.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>صافي الأصول الثابتة</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', borderTop: '1px solid black' }}>
                                        {totalFixedAssets.toLocaleString()}
                                    </TableCell>
                                </TableRow>

                                <TableRow><TableCell colSpan={2} sx={{ border: 0, py: 2 }}></TableCell></TableRow>

                                <TableRow sx={{ bgcolor: 'primary.main', '& td': { color: 'white', fontWeight: 'bold', fontSize: '1.1rem' } }}>
                                    <TableCell>إجمالي الأصول</TableCell>
                                    <TableCell align="right">{totalAssets.toLocaleString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Liabilities & Equity Column */}
                <Grid item xs={12} md={6}>
                    <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                            الخصوم وحقوق الملكية (Liabilities & Equity)
                        </Typography>
                        <Table size="small">
                            <TableBody>
                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>الالتزامات المتداولة</TableCell>
                                </TableRow>
                                {currentLiabilities.map((item) => (
                                    <TableRow key={item.name}>
                                        <TableCell sx={{ pl: 4 }}>{item.name}</TableCell>
                                        <TableCell align="right">{item.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>إجمالي الالتزامات</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', borderTop: '1px solid black' }}>
                                        {totalLiabilities.toLocaleString()}
                                    </TableCell>
                                </TableRow>

                                <TableRow><TableCell colSpan={2} sx={{ border: 0, py: 1 }}></TableCell></TableRow>

                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>حقوق الملكية</TableCell>
                                </TableRow>
                                {equity.map((item) => (
                                    <TableRow key={item.name}>
                                        <TableCell sx={{ pl: 4 }}>{item.name}</TableCell>
                                        <TableCell align="right">{item.amount.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>إجمالي حقوق الملكية</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', borderTop: '1px solid black' }}>
                                        {totalEquity.toLocaleString()}
                                    </TableCell>
                                </TableRow>

                                <TableRow><TableCell colSpan={2} sx={{ border: 0, py: 2 }}></TableCell></TableRow>

                                <TableRow sx={{ bgcolor: 'secondary.main', '& td': { color: 'white', fontWeight: 'bold', fontSize: '1.1rem' } }}>
                                    <TableCell>إجمالي الخصوم وحقوق الملكية</TableCell>
                                    <TableCell align="right">{totalLiabilitiesAndEquity.toLocaleString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            {totalAssets !== totalLiabilitiesAndEquity && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'error.light', borderRadius: 2, color: 'error.contrastText', textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        تنبيه: الميزانية غير متزنة! هناك فرق قدره {(totalAssets - totalLiabilitiesAndEquity).toLocaleString()}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default BalanceSheet;
