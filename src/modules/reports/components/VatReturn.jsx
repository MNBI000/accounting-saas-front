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
    TableHead,
    TableRow,
    Card,
    CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';

const VatReturn = ({ onBack }) => {
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-03-31');

    // Mock data for VAT Return
    const salesVat = {
        taxableAmount: 500000,
        vatAmount: 70000, // 14%
    };

    const purchasesVat = {
        taxableAmount: 300000,
        vatAmount: 42000, // 14%
    };

    const netVatPayable = salesVat.vatAmount - purchasesVat.vatAmount;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={onBack} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>إقرار ضريبة القيمة المضافة</Typography>
                        <Typography variant="caption" color="text.secondary">VAT Return Report (14%)</Typography>
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

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="subtitle2" gutterBottom>ضريبة المبيعات (المخرجات)</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{salesVat.vatAmount.toLocaleString()}</Typography>
                            <Typography variant="caption">على مبيعات قدرها {salesVat.taxableAmount.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: 'warning.main', color: 'white', borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="subtitle2" gutterBottom>ضريبة المشتريات (المدخلات)</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{purchasesVat.vatAmount.toLocaleString()}</Typography>
                            <Typography variant="caption">على مشتريات قدرها {purchasesVat.taxableAmount.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: netVatPayable >= 0 ? 'error.main' : 'success.main', color: 'white', borderRadius: 4 }}>
                        <CardContent>
                            <Typography variant="subtitle2" gutterBottom>صافي الضريبة {netVatPayable >= 0 ? 'المستحقة' : 'الدائنة'}</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{Math.abs(netVatPayable).toLocaleString()}</Typography>
                            <Typography variant="caption">{netVatPayable >= 0 ? 'واجبة السداد لمصلحة الضرائب' : 'رصيد دائن للمنشأة'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>البيان</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>المبلغ الخاضع للضريبة</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>قيمة الضريبة (14%)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>المبيعات المحلية</TableCell>
                            <TableCell align="right">{salesVat.taxableAmount.toLocaleString()}</TableCell>
                            <TableCell align="right">{salesVat.vatAmount.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>المشتريات المحلية</TableCell>
                            <TableCell align="right">{purchasesVat.taxableAmount.toLocaleString()}</TableCell>
                            <TableCell align="right">{purchasesVat.vatAmount.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>الإجمالي</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{(salesVat.taxableAmount - purchasesVat.taxableAmount).toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{netVatPayable.toLocaleString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default VatReturn;
