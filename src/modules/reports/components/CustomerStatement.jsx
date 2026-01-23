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
    Autocomplete
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';

const CustomerStatement = ({ onBack }) => {
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-01-20');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Mock customers
    const customers = [
        { id: 1, name: 'شركة الأمل للتجارة' },
        { id: 2, name: 'مؤسسة النجاح للمقاولات' },
        { id: 3, name: 'معرض المستقبل للأثاث' },
    ];

    // Mock data for Customer Statement
    const transactions = [
        { date: '2026-01-01', type: 'رصيد افتتاحى', reference: '-', debit: 15000, credit: 0, balance: 15000 },
        { date: '2026-01-05', type: 'فاتورة مبيعات', reference: 'INV-001', debit: 25000, credit: 0, balance: 40000 },
        { date: '2026-01-10', type: 'سند قبض', reference: 'RCP-001', debit: 0, credit: 20000, balance: 20000 },
        { date: '2026-01-15', type: 'فاتورة مبيعات', reference: 'INV-005', debit: 12000, credit: 0, balance: 32000 },
        { date: '2026-01-18', type: 'مردودات مبيعات', reference: 'SRT-001', debit: 0, credit: 2000, balance: 30000 },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={onBack} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>كشف حساب عميل</Typography>
                        <Typography variant="caption" color="text.secondary">Customer Account Statement</Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" startIcon={<PrintIcon />}>طباعة</Button>
                    <Button variant="contained" startIcon={<DownloadIcon />}>تصدير Excel</Button>
                </Stack>
            </Box>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={12} md={4}>
                        <Autocomplete
                            options={customers}
                            getOptionLabel={(option) => option.name}
                            value={selectedCustomer}
                            onChange={(event, newValue) => setSelectedCustomer(newValue)}
                            renderInput={(params) => <TextField {...params} label="اختر العميل" />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="من تاريخ"
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="إلى تاريخ"
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<FilterListIcon />}
                            sx={{ height: 56 }}
                        >
                            عرض
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {selectedCustomer ? (
                <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{selectedCustomer.name}</Typography>
                                <Typography variant="body2" color="text.secondary">كشف حساب تفصيلي للفترة من {dateFrom} إلى {dateTo}</Typography>
                            </Grid>
                            <Grid item sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="text.secondary" display="block">الرصيد النهائي</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>30,000.00</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>نوع الحركة</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>المرجع</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>مدين</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>دائن</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>الرصيد</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.reference}</TableCell>
                                    <TableCell align="right">{row.debit > 0 ? row.debit.toLocaleString() : '-'}</TableCell>
                                    <TableCell align="right">{row.credit > 0 ? row.credit.toLocaleString() : '-'}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>{row.balance.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'background.paper', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                    <Typography color="text.secondary">يرجى اختيار عميل لعرض كشف الحساب</Typography>
                </Box>
            )}
        </Box>
    );
};

export default CustomerStatement;
