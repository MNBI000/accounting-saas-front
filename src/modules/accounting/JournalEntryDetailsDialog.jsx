import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Grid, Paper, Chip, Divider
} from '@mui/material';

const JournalEntryDetailsDialog = ({ open, onClose, entry }) => {
    if (!entry) return null;

    const items = entry.items || [];
    const totalDebit = items.reduce((sum, item) => sum + Number(item.debit || 0), 0);
    const totalCredit = items.reduce((sum, item) => sum + Number(item.credit || 0), 0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">تفاصيل القيد #{entry.reference_no}</Typography>
                    <Chip
                        label={entry.status === 'posted' ? 'مرحل' : entry.status}
                        color={entry.status === 'posted' ? 'success' : 'default'}
                        size="small"
                    />
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">التاريخ</Typography>
                        <Typography variant="body1">{entry.date ? entry.date.split('T')[0] : '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">بواسطة</Typography>
                        <Typography variant="body1">{entry.user?.name || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">البيان (عربي)</Typography>
                        <Typography variant="body1">{entry.description_ar || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">البيان (إنجليزي)</Typography>
                        <Typography variant="body1">{entry.description_en || '-'}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>بنود القيد</Typography>
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell>رقم الحساب</TableCell>
                                <TableCell>اسم الحساب</TableCell>
                                <TableCell>البيان</TableCell>
                                <TableCell align="right">مدين</TableCell>
                                <TableCell align="right">دائن</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.account?.code || '-'}</TableCell>
                                    <TableCell>{item.account?.name_ar || item.account?.name_en || '-'}</TableCell>
                                    <TableCell>{item.memo || '-'}</TableCell>
                                    <TableCell align="right">{Number(item.debit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="right">{Number(item.credit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow sx={{ bgcolor: 'action.selected', fontWeight: 'bold' }}>
                                <TableCell colSpan={3} align="center"><strong>الإجمالي</strong></TableCell>
                                <TableCell align="right"><strong>{totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></TableCell>
                                <TableCell align="right"><strong>{totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">إغلاق</Button>
            </DialogActions>
        </Dialog>
    );
};

export default JournalEntryDetailsDialog;
