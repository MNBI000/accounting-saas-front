import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    IconButton,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    MenuItem
} from '@mui/material';
import {
    Close as CloseIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Save as SaveIcon
} from '@mui/icons-material';

const InvoiceForm = ({ open, onClose, invoice, onSave }) => {
    const [formData, setFormData] = useState({
        number: '',
        date: new Date().toISOString().split('T')[0],
        customer: '',
        items: []
    });

    // Mock products for selection
    const products = [
        { id: 1, name: 'لابتوب ديل XPS', price: 45000 },
        { id: 2, name: 'ماوس لوجيتك MX', price: 3500 },
        { id: 3, name: 'شاشة سامسونج 27 بوصة', price: 12000 },
        { id: 4, name: 'كيبورد ميكانيكال', price: 2800 },
    ];

    useEffect(() => {
        if (invoice) {
            setFormData({
                ...invoice,
                items: invoice.items || [] // Ensure items is an array
            });
        } else {
            setFormData({
                number: `INV-${Math.floor(Math.random() * 1000)}`, // Auto-generate number
                date: new Date().toISOString().split('T')[0],
                customer: '',
                items: []
            });
        }
    }, [invoice, open]);

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                { id: Date.now(), productId: '', quantity: 1, price: 0, total: 0 }
            ]
        });
    };

    const handleRemoveItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        const item = { ...newItems[index] };

        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            item.productId = value;
            item.productName = product?.name || '';
            item.price = product?.price || 0;
        } else {
            item[field] = value;
        }

        // Recalculate total
        item.total = item.quantity * item.price;
        newItems[index] = item;

        setFormData({ ...formData, items: newItems });
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
    };

    const handleSave = () => {
        onSave({
            ...formData,
            total: calculateTotal() * 1.14,
            itemsCount: formData.items.length
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {invoice ? 'تعديل فاتورة' : 'إنشاء فاتورة جديدة'}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Header Info */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="رقم الفاتورة"
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            disabled={!!invoice} // Disable editing number for existing invoices
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="التاريخ"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="العميل"
                            value={formData.customer}
                            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                            placeholder="اسم العميل"
                        />
                    </Grid>

                    {/* Items Table */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">الأصناف</Typography>
                            <Button startIcon={<AddIcon />} onClick={handleAddItem} variant="outlined" size="small">
                                إضافة صنف
                            </Button>
                        </Box>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width="40%">المنتج</TableCell>
                                        <TableCell width="15%">الكمية</TableCell>
                                        <TableCell width="20%">السعر</TableCell>
                                        <TableCell width="20%">الإجمالي</TableCell>
                                        <TableCell width="5%"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formData.items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                                لا توجد أصناف مضافة
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        formData.items.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <TextField
                                                        select
                                                        fullWidth
                                                        size="small"
                                                        value={item.productId}
                                                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                                    >
                                                        {products.map((p) => (
                                                            <MenuItem key={p.id} value={p.id}>
                                                                {p.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        fullWidth
                                                        size="small"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                                        inputProps={{ min: 1 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        fullWidth
                                                        size="small"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {item.total.toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Totals */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Paper sx={{ p: 2, minWidth: 250, bgcolor: 'grey.50' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>المجموع الفرعي:</Typography>
                                    <Typography fontWeight="bold">{calculateTotal().toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography>ضريبة القيمة المضافة (14%):</Typography>
                                    <Typography fontWeight="bold">{(calculateTotal() * 0.14).toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #ddd' }}>
                                    <Typography variant="h6">الإجمالي:</Typography>
                                    <Typography variant="h6" color="primary">{(calculateTotal() * 1.14).toLocaleString()}</Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    إلغاء
                </Button>
                <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>
                    {invoice ? 'حفظ التعديلات' : 'إنشاء الفاتورة'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InvoiceForm;
