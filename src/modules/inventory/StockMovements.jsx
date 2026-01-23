import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TextField,
    MenuItem,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    ArrowUpward as InIcon,
    ArrowDownward as OutIcon,
    History as HistoryIcon,
    Close as CloseIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';

const StockMovements = () => {
    const { hasPermission } = usePermissions();
    const [filterType, setFilterType] = useState('all');
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    // Mock data
    const movements = [
        { id: 1, date: '2026-01-19', type: 'In', product: 'لابتوب ديل XPS', quantity: 10, reference: 'PO-001', user: 'أحمد محمد' },
        { id: 2, date: '2026-01-18', type: 'Out', product: 'ماوس لوجيتك MX', quantity: 5, reference: 'INV-001', user: 'سارة علي' },
        { id: 3, date: '2026-01-18', type: 'In', product: 'شاشة سامسونج', quantity: 20, reference: 'PO-002', user: 'أحمد محمد' },
        { id: 4, date: '2026-01-17', type: 'Out', product: 'كيبورد ميكانيكال', quantity: 2, reference: 'INV-002', user: 'خالد حسن' },
    ];

    const getMovementIcon = (type) => {
        return type === 'In' ? <InIcon fontSize="small" /> : <OutIcon fontSize="small" />;
    };

    const getMovementColor = (type) => {
        return type === 'In' ? 'success' : 'error';
    };

    const getMovementLabel = (type) => {
        return type === 'In' ? 'وارد' : 'صادر';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        placeholder="بحث في الحركات..."
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 250, bgcolor: 'background.paper', borderRadius: 1 }}
                    />
                    <TextField
                        select
                        size="small"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        sx={{ width: 150, bgcolor: 'background.paper', borderRadius: 1 }}
                    >
                        <MenuItem value="all">الكل</MenuItem>
                        <MenuItem value="In">وارد</MenuItem>
                        <MenuItem value="Out">صادر</MenuItem>
                    </TextField>
                </Box>

                {hasPermission(PERMISSIONS.INVENTORY_MANAGE) && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            boxShadow: 2
                        }}
                    >
                        حركة جديدة
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>النوع</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>المنتج</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>الكمية</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>المرجع</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>المستخدم</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movements.map((move) => (
                            <TableRow
                                key={move.id}
                                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                            >
                                <TableCell sx={{ fontFamily: 'monospace' }}>{move.date}</TableCell>
                                <TableCell>
                                    <Chip
                                        icon={getMovementIcon(move.type)}
                                        label={getMovementLabel(move.type)}
                                        color={getMovementColor(move.type)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ minWidth: 80, justifyContent: 'flex-start' }}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'medium' }}>{move.product}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: move.type === 'In' ? 'success.main' : 'error.main' }}>
                                    {move.type === 'In' ? '+' : '-'}{move.quantity}
                                </TableCell>
                                <TableCell>
                                    <Chip label={move.reference} size="small" sx={{ bgcolor: 'grey.100', fontFamily: 'monospace' }} />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <HistoryIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
                                        <Typography variant="caption">{move.user}</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* New Movement Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    تسجيل حركة مخزون
                    <IconButton onClick={handleCloseDialog} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="نوع الحركة"
                                defaultValue="In"
                                variant="outlined"
                            >
                                <MenuItem value="In">وارد (إضافة للمخزون)</MenuItem>
                                <MenuItem value="Out">صادر (خصم من المخزون)</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="المنتج" variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="الكمية" type="number" variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="المرجع (رقم الفاتورة/الإذن)" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="ملاحظات" multiline rows={2} variant="outlined" />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit">
                        إلغاء
                    </Button>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleCloseDialog}>
                        حفظ الحركة
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StockMovements;
