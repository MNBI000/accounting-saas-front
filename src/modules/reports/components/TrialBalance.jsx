import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Grid,
    IconButton,
    Divider,
    Stack,
    Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';

const TrialBalance = ({ onBack }) => {
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-12-31');

    // Mock data for Trial Balance
    const mockData = [
        { code: '1101', name: 'الصندوق', debit: 50000, credit: 0 },
        { code: '1102', name: 'البنك', debit: 150000, credit: 0 },
        { code: '1201', name: 'العملاء', debit: 75000, credit: 0 },
        { code: '2101', name: 'الموردين', debit: 0, credit: 45000 },
        { code: '3101', name: 'رأس المال', debit: 0, credit: 200000 },
        { code: '4101', name: 'المبيعات', debit: 0, credit: 120000 },
        { code: '5101', name: 'المشتريات', debit: 80000, credit: 0 },
        { code: '5201', name: 'الرواتب', debit: 10000, credit: 0 },
    ];

    const totalDebit = mockData.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = mockData.reduce((sum, item) => sum + item.credit, 0);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={onBack} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>ميزان المراجعة</Typography>
                        <Typography variant="caption" color="text.secondary">Trial Balance Report</Typography>
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

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>كود الحساب</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>اسم الحساب</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>مدين</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>دائن</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockData.map((row) => (
                            <TableRow key={row.code} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{row.code}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell align="right">{row.debit.toLocaleString()}</TableCell>
                                <TableCell align="right">{row.credit.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: 'primary.light', '& td': { color: 'primary.contrastText', fontWeight: 'bold' } }}>
                            <TableCell colSpan={2} align="center">الإجمالي</TableCell>
                            <TableCell align="right">{totalDebit.toLocaleString()}</TableCell>
                            <TableCell align="right">{totalCredit.toLocaleString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {totalDebit !== totalCredit && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 2, color: 'error.contrastText' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        تنبيه: ميزان المراجعة غير متزن! هناك فرق قدره {(totalDebit - totalCredit).toLocaleString()}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default TrialBalance;
