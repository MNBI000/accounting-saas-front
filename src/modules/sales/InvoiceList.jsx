
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
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Receipt as InvoiceIcon,
    CheckCircle as FinalizeIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import InvoiceForm from './InvoiceForm';
import PrintPreview from './PrintPreview';

const InvoiceList = () => {
    const { hasPermission } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceToPrint, setInvoiceToPrint] = useState(null);

    // Mock data
    const [invoices, setInvoices] = useState([
        { id: 1, number: 'INV-001', date: '2026-01-20', customer: 'شركة الأمل للتجارة', total: 15000, status: 'draft', items: 3 },
        { id: 2, number: 'INV-002', date: '2026-01-19', customer: 'مؤسسة النور', total: 3500, status: 'finalized', items: 1 },
        { id: 3, number: 'INV-003', date: '2026-01-18', customer: 'العميل النقدي', total: 1200, status: 'finalized', items: 2 },
    ]);

    const getStatusChip = (status) => {
        if (status === 'finalized') return <Chip label="مرحلة" color="success" size="small" variant="outlined" />;
        if (status === 'draft') return <Chip label="مسودة" color="warning" size="small" variant="outlined" />;
        return <Chip label={status} size="small" variant="outlined" />;
    };

    const handleOpenCreate = () => {
        setSelectedInvoice(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (invoice) => {
        setSelectedInvoice(invoice);
        setIsFormOpen(true);
    };

    const handleSaveInvoice = (invoiceData) => {
        if (selectedInvoice) {
            // Update existing
            setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? { ...inv, ...invoiceData } : inv));
        } else {
            // Add new
            const newInvoice = {
                ...invoiceData,
                id: Date.now(),
                status: 'draft',
                items: invoiceData.itemsCount || 0
            };
            setInvoices([newInvoice, ...invoices]);
        }
        setIsFormOpen(false);
    };

    const handleFinalize = (id) => {
        if (window.confirm('هل أنت متأكد من ترحيل هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.')) {
            // TODO: API call to finalize
            setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'finalized' } : inv));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
            // TODO: API call to delete
            setInvoices(invoices.filter(inv => inv.id !== id));
        }
    };

    const handlePrint = (invoice) => {
        setInvoiceToPrint(invoice);
        setIsPrintOpen(true);
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        placeholder="بحث عن فاتورة..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300, bgcolor: 'background.paper', borderRadius: 1 }}
                    />
                </Box>

                {hasPermission(PERMISSIONS.INVOICES_CREATE) && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreate}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            boxShadow: 2
                        }}
                    >
                        إنشاء فاتورة جديدة
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>رقم الفاتورة</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>العميل</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>عدد الأصناف</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>الإجمالي</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">لا توجد فواتير مطابقة للبحث</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((invoice) => (
                                <TableRow
                                    key={invoice.id}
                                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1, color: 'primary.contrastText', display: 'flex' }}>
                                                <InvoiceIcon fontSize="small" />
                                            </Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {invoice.number}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>{invoice.customer}</TableCell>
                                    <TableCell>{invoice.items}</TableCell>
                                    <TableCell>{invoice.total.toLocaleString()} ج.م</TableCell>
                                    <TableCell>{getStatusChip(invoice.status)}</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                            {/* Print Action - Always visible if can view */}
                                            <Tooltip title="طباعة">
                                                <IconButton
                                                    size="small"
                                                    color="info"
                                                    onClick={() => handlePrint(invoice)}
                                                >
                                                    <PrintIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {/* Draft Actions */}
                                            {invoice.status === 'draft' && (
                                                <>
                                                    {hasPermission(PERMISSIONS.INVOICES_EDIT) && (
                                                        <Tooltip title="تعديل">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleOpenEdit(invoice)}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {hasPermission(PERMISSIONS.INVOICES_FINALIZE) && (
                                                        <Tooltip title="ترحيل (اعتماد)">
                                                            <IconButton
                                                                size="small"
                                                                color="success"
                                                                onClick={() => handleFinalize(invoice.id)}
                                                            >
                                                                <FinalizeIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                    {hasPermission(PERMISSIONS.INVOICES_DELETE) && (
                                                        <Tooltip title="حذف">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDelete(invoice.id)}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Invoice Form Dialog */}
            <InvoiceForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                invoice={selectedInvoice}
                onSave={handleSaveInvoice}
            />

            {/* Print Preview Dialog */}
            <PrintPreview
                open={isPrintOpen}
                onClose={() => setIsPrintOpen(false)}
                invoice={invoiceToPrint}
            />
        </Box>
    );
};

export default InvoiceList;
