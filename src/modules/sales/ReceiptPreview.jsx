import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    IconButton
} from '@mui/material';
import {
    Print as PrintIcon,
    Close as CloseIcon,
    Receipt as ReceiptIcon
} from '@mui/icons-material';

const ReceiptPreview = ({ open, onClose, receipt }) => {
    if (!receipt) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon color="primary" />
                    <Typography variant="h6">إيصال البيع</Typography>
                </Box>
                <Box>
                    <IconButton onClick={handlePrint} color="primary" sx={{ mr: 1 }}>
                        <PrintIcon />
                    </IconButton>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0 }}>
                {/* Printable Receipt Area */}
                <Box id="printable-receipt" sx={{ p: 4, bgcolor: 'white', minHeight: 500 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3, pb: 2, borderBottom: '2px dashed #ccc' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                            اسم الشركة
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            العنوان: القاهرة، مصر
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            هاتف: 0123456789
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            السجل التجاري: 123456 | الرقم الضريبي: 987-654-321
                        </Typography>
                    </Box>

                    {/* Receipt Info */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2"><strong>رقم الإيصال:</strong></Typography>
                            <Typography variant="body2">{receipt.number}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2"><strong>التاريخ:</strong></Typography>
                            <Typography variant="body2">{receipt.date}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2"><strong>الوقت:</strong></Typography>
                            <Typography variant="body2">{receipt.time}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2"><strong>العميل:</strong></Typography>
                            <Typography variant="body2">{receipt.customer}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2"><strong>الكاشير:</strong></Typography>
                            <Typography variant="body2">{receipt.cashier}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                    {/* Items Table */}
                    <TableContainer sx={{ mb: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', p: 1 }}>الصنف</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', p: 1 }}>الكمية</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', p: 1 }}>السعر</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', p: 1 }}>الإجمالي</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {receipt.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ p: 1 }}>
                                            <Typography variant="body2">{item.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.sku}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ p: 1 }}>
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell align="right" sx={{ p: 1 }}>
                                            {item.price.toLocaleString()}
                                        </TableCell>
                                        <TableCell align="right" sx={{ p: 1 }}>
                                            <strong>{(item.price * item.quantity).toLocaleString()}</strong>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                    {/* Totals */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">المجموع الفرعي:</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {receipt.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} ج.م
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">ضريبة القيمة المضافة (14%):</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {receipt.vat.toLocaleString(undefined, { minimumFractionDigits: 2 })} ج.م
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 1.5, borderWidth: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>الإجمالي:</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {receipt.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} ج.م
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                    {/* Footer */}
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            شكراً لتعاملكم معنا
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            نتمنى لكم يوماً سعيداً
                        </Typography>

                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #ccc' }}>
                            <Typography variant="caption" color="text.secondary">
                                هذا إيصال رسمي صادر من النظام المحاسبي
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                                تاريخ الطباعة: {new Date().toLocaleString('ar-EG')}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Button onClick={onClose} color="inherit">
                    إغلاق
                </Button>
                <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
                    طباعة الإيصال
                </Button>
            </DialogActions>

            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-receipt, #printable-receipt * {
                        visibility: visible;
                    }
                    #printable-receipt {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 80mm; /* Standard receipt width */
                        padding: 10px;
                        margin: 0;
                        font-size: 12px;
                    }
                    .MuiDialog-root {
                        position: static;
                    }
                    .MuiBackdrop-root {
                        display: none;
                    }
                    .MuiPaper-root {
                        box-shadow: none;
                    }
                }
                `}
            </style>
        </Dialog>
    );
};

export default ReceiptPreview;
