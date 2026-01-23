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
    Paper,
    Divider,
    IconButton
} from '@mui/material';
import {
    Print as PrintIcon,
    Close as CloseIcon,
    Download as DownloadIcon
} from '@mui/icons-material';

const PrintPreview = ({ open, onClose, invoice }) => {
    if (!invoice) return null;

    const handlePrint = () => {
        window.print();
    };

    const subtotal = invoice.total / 1.14;
    const vat = invoice.total - subtotal;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.50' }}>
                معاينة الطباعة
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
                {/* Printable Area */}
                <Box id="printable-invoice" sx={{ p: 6, minHeight: '29.7cm', bgcolor: 'white' }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        <Box>
                            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                اسم الشركة الخاصة بك
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                العنوان: القاهرة، مصر
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                السجل التجاري: 123456
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                البطاقة الضريبية: 987-654-321
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                فاتورة ضريبية
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Tax Invoice
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 4, borderBottomWidth: 2 }} />

                    {/* Invoice Info */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>إلى السيد / السادة:</Typography>
                            <Typography variant="h6">{invoice.customer}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="body1"><strong>رقم الفاتورة:</strong> {invoice.number}</Typography>
                            <Typography variant="body1"><strong>التاريخ:</strong> {invoice.date}</Typography>
                        </Box>
                    </Box>

                    {/* Items Table */}
                    <TableContainer component={Box} sx={{ mb: 4 }}>
                        <Table sx={{ border: '1px solid #eee' }}>
                            <TableHead sx={{ bgcolor: 'grey.100' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>م</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>البيان / الصنف</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>الكمية</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>السعر</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>الإجمالي</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* In a real app, we'd map over invoice.items. 
                                    Since our mock data only has itemsCount, we'll show a placeholder row */}
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>خدمات / بضائع متنوعة</TableCell>
                                    <TableCell align="center">{invoice.items}</TableCell>
                                    <TableCell align="center">{(subtotal / invoice.items).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="center">{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                </TableRow>
                                {/* Fill empty rows to maintain height if needed */}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Summary */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Box sx={{ width: 300 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>الإجمالي قبل الضريبة:</Typography>
                                <Typography>{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>ضريبة القيمة المضافة (14%):</Typography>
                                <Typography>{vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>الإجمالي النهائي:</Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                    {invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} ج.م
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ mt: 10, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            شكراً لتعاملكم معنا
                        </Typography>
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-around' }}>
                            <Box sx={{ borderTop: '1px solid #ccc', pt: 1, width: 150 }}>توقيع المستلم</Box>
                            <Box sx={{ borderTop: '1px solid #ccc', pt: 1, width: 150 }}>ختم الشركة</Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Button onClick={onClose} color="inherit">إغلاق</Button>
                <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}>
                    طباعة الآن
                </Button>
            </DialogActions>

            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-invoice, #printable-invoice * {
                        visibility: visible;
                    }
                    #printable-invoice {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 0;
                        margin: 0;
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

export default PrintPreview;
