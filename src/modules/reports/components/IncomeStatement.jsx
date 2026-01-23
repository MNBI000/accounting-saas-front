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

const IncomeStatement = ({ onBack }) => {
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-12-31');

    // Mock data for Income Statement
    const revenues = [
        { name: 'مبيعات السلع', amount: 150000 },
        { name: 'إيرادات خدمات', amount: 25000 },
    ];

    const cogs = [
        { name: 'تكلفة البضاعة المباعة', amount: 85000 },
    ];

    const expenses = [
        { name: 'رواتب وأجور', amount: 15000 },
        { name: 'إيجارات', amount: 5000 },
        { name: 'كهرباء ومياه', amount: 1200 },
        { name: 'مصاريف تسويق', amount: 3000 },
    ];

    const totalRevenues = revenues.reduce((sum, item) => sum + item.amount, 0);
    const totalCogs = cogs.reduce((sum, item) => sum + item.amount, 0);
    const grossProfit = totalRevenues - totalCogs;
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netProfit = grossProfit - totalExpenses;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={onBack} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>قائمة الدخل</Typography>
                        <Typography variant="caption" color="text.secondary">Income Statement (P&L)</Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<PrintIcon />}>طباعة</Button>
                    <Button variant="contained" startIcon={<DownloadIcon />}>تصدير Excel</Button>
                </Stack>
            </Box>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="من تاريخ"
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="إلى تاريخ"
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
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

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', p: 4 }}>
                <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                    قائمة الدخل عن الفترة من {dateFrom} إلى {dateTo}
                </Typography>

                <Table>
                    <TableBody>
                        {/* Revenues */}
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>الإيرادات</TableCell>
                        </TableRow>
                        {revenues.map((item) => (
                            <TableRow key={item.name}>
                                <TableCell sx={{ pl: 4 }}>{item.name}</TableCell>
                                <TableCell align="right">{item.amount.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>إجمالي الإيرادات</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', borderTop: '2px solid black' }}>
                                {totalRevenues.toLocaleString()}
                            </TableCell>
                        </TableRow>

                        <TableRow><TableCell colSpan={2} sx={{ border: 0, py: 1 }}></TableCell></TableRow>

                        {/* COGS */}
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>تكلفة المبيعات</TableCell>
                        </TableRow>
                        {cogs.map((item) => (
                            <TableRow key={item.name}>
                                <TableCell sx={{ pl: 4 }}>{item.name}</TableCell>
                                <TableCell align="right">({item.amount.toLocaleString()})</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>إجمالي تكلفة المبيعات</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', borderTop: '2px solid black' }}>
                                ({totalCogs.toLocaleString()})
                            </TableCell>
                        </TableRow>

                        <TableRow><TableCell colSpan={2} sx={{ border: 0, py: 1 }}></TableCell></TableRow>

                        {/* Gross Profit */}
                        <TableRow sx={{ bgcolor: 'primary.light', '& td': { color: 'primary.contrastText', fontWeight: 'bold' } }}>
                            <TableCell>مجمل الربح</TableCell>
                            <TableCell align="right">{grossProfit.toLocaleString()}</TableCell>
                        </TableRow>

                        <TableRow><TableCell colSpan={2} sx={{ border: 0, py: 1 }}></TableCell></TableRow>

                        {/* Expenses */}
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>المصاريف التشغيلية</TableCell>
                        </TableRow>
                        {expenses.map((item) => (
                            <TableRow key={item.name}>
                                <TableCell sx={{ pl: 4 }}>{item.name}</TableCell>
                                <TableCell align="right">{item.amount.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>إجمالي المصاريف</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', borderTop: '2px solid black' }}>
                                {totalExpenses.toLocaleString()}
                            </TableCell>
                        </TableRow>

                        <TableRow><TableCell colSpan={2} sx={{ border: 0, py: 2 }}></TableCell></TableRow>

                        {/* Net Profit */}
                        <TableRow sx={{ bgcolor: netProfit >= 0 ? 'success.main' : 'error.main', '& td': { color: 'white', fontWeight: 'bold', fontSize: '1.1rem' } }}>
                            <TableCell>صافي الربح / (الخسارة)</TableCell>
                            <TableCell align="right">{netProfit.toLocaleString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default IncomeStatement;
