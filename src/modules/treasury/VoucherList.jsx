import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Typography,
    Chip,
    Tooltip,
    CircularProgress,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import VoucherForm from './VoucherForm';
import { apiVouchers } from '../../services/apiVouchers';

const VoucherList = () => {
    const { hasPermission } = usePermissions();
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    const canCreate = hasPermission(PERMISSIONS.VOUCHERS_CREATE);
    const canEdit = hasPermission(PERMISSIONS.VOUCHERS_EDIT);
    const canDelete = hasPermission(PERMISSIONS.VOUCHERS_DELETE);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const data = await apiVouchers.getAll();
            setVouchers(data.data || data); // Handle cases where data is wrapped
            setError(null);
        } catch (err) {
            console.error("Error fetching vouchers:", err);
            setError("فشل في تحميل السندات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleCreate = () => {
        setSelectedVoucher(null);
        setOpenForm(true);
    };

    const handleEdit = (voucher) => {
        setSelectedVoucher(voucher);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السند؟')) {
            try {
                await apiVouchers.delete(id);
                setVouchers(vouchers.filter(v => v.id !== id));
            } catch (err) {
                console.error("Error deleting voucher:", err);
                alert("فشلت عملية الحذف");
            }
        }
    };

    const handleSave = async (voucherData) => {
        try {
            if (selectedVoucher) {
                // Edit
                const updatedVoucher = await apiVouchers.update(selectedVoucher.id, voucherData);
                setVouchers(vouchers.map(v => v.id === selectedVoucher.id ? (updatedVoucher.data || updatedVoucher) : v));
            } else {
                // Create
                const newVoucher = await apiVouchers.create(voucherData);
                setVouchers([newVoucher.data || newVoucher, ...vouchers]);
            }
            setOpenForm(false);
            fetchVouchers(); // Refresh list to ensure consistency
        } catch (err) {
            console.error("Error saving voucher:", err);
            alert("فشلت عملية الحفظ");
        }
    };

    const handlePrint = (voucher) => {
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        const voucherTitle = voucher.type === 'payment' ? 'سند صرف نقدية' : 'سند قبض نقدية';
        const companyName = 'الشركة الافتراضية للتجارة'; // Placeholder or from config

        // Determine beneficiary name
        const beneficiaryName = voucher.account?.name_ar || voucher.account?.name_en || 'غير محدد';
        const paymentDetails = voucher.treasury
            ? `خزينة: ${voucher.treasury.name}`
            : (voucher.bank_account ? `بنك: ${voucher.bank_account.bank_name} - ${voucher.bank_account.account_number}` : '');

        const htmlContent = `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <title>طباعة ${voucher.voucher_number}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background: #f5f5f5; }
                    .voucher-container { 
                        background: white;
                        border: 1px solid #ccc; 
                        padding: 40px; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                    .company-name { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
                    .voucher-title { 
                        font-size: 28px; 
                        font-weight: bold; 
                        color: #1976d2; 
                        border: 2px solid #1976d2;
                        display: inline-block;
                        padding: 5px 20px;
                        border-radius: 5px;
                        margin-top: 10px;
                    }
                    .meta-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 20px;
                        margin-bottom: 30px;
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                    }
                    .meta-item strong { display: block; color: #666; font-size: 14px; margin-bottom: 5px; }
                    .meta-item span { font-size: 18px; font-weight: 500; }
                    
                    .amount-box { 
                        background: #e3f2fd; 
                        border: 1px dashed #1976d2; 
                        padding: 20px; 
                        text-align: center; 
                        font-size: 24px; 
                        font-weight: bold; 
                        margin: 30px 0; 
                        border-radius: 8px;
                    }
                    
                    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                    .details-table td { padding: 15px; border-bottom: 1px solid #eee; }
                    .details-table .label { font-weight: bold; width: 150px; color: #555; }
                    .details-table .value { font-size: 16px; }

                    .footer { margin-top: 60px; display: flex; justify-content: space-between; padding-top: 20px; }
                    .signature-box { 
                        text-align: center; 
                        width: 200px; 
                    }
                    .signature-line {
                        border-top: 1px solid #333; 
                        margin-top: 40px;
                        padding-top: 10px;
                        font-weight: bold;
                    }

                    @media print {
                        body { background: white; padding: 0; }
                        .voucher-container { box-shadow: none; border: none; padding: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="voucher-container">
                    <div class="header">
                        <div class="company-name">${companyName}</div>
                        <div class="voucher-title">${voucherTitle}</div>
                    </div>
                    
                    <div class="meta-grid">
                        <div class="meta-item">
                            <strong>رقم السند</strong>
                            <span>${voucher.voucher_number}</span>
                        </div>
                        <div class="meta-item" style="text-align: left;">
                            <strong>التاريخ</strong>
                            <span>${voucher.date}</span>
                        </div>
                    </div>

                    <div class="amount-box">
                        ${Number(voucher.amount).toLocaleString()}
                    </div>

                    <table class="details-table">
                        <tr>
                            <td class="label">المستفيد / المستلم:</td>
                            <td class="value">${beneficiaryName}</td>
                        </tr>
                        <tr>
                            <td class="label">وذلك عن:</td>
                            <td class="value">${voucher.description}</td>
                        </tr>
                         <tr>
                            <td class="label">وسيلة الدفع:</td>
                            <td class="value">${paymentDetails}</td>
                        </tr>
                    </table>

                    <div class="footer">
                        <div class="signature-box">
                            <div>المحاسب</div>
                            <div class="signature-line"></div>
                        </div>
                        <div class="signature-box">
                            <div>المدير المالي</div>
                            <div class="signature-line"></div>
                        </div>
                        <div class="signature-box">
                            <div>المستلم</div>
                            <div class="signature-line"></div>
                        </div>
                    </div>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'posted': return 'success';
            case 'draft': return 'warning';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'posted': return 'مرحل';
            case 'draft': return 'مسودة';
            case 'cancelled': return 'ملغي';
            default: return status;
        }
    };

    const getTypeLabel = (type) => {
        return type === 'payment' ? 'سند صرف' : 'سند قبض';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">سندات القبض والصرف</Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        سند جديد
                    </Button>
                )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>رقم السند</TableCell>
                                <TableCell>التاريخ</TableCell>
                                <TableCell>النوع</TableCell>
                                <TableCell>المستفيد / المستلم</TableCell>
                                <TableCell>المبلغ</TableCell>
                                <TableCell>الوسيلة</TableCell>
                                <TableCell>الحالة</TableCell>
                                <TableCell>البيان</TableCell>
                                <TableCell align="center">إجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vouchers.map((voucher) => (
                                <TableRow key={voucher.id}>
                                    <TableCell>{voucher.voucher_number || voucher.number}</TableCell>
                                    <TableCell>{voucher.date}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getTypeLabel(voucher.type)}
                                            size="small"
                                            color={voucher.type === 'payment' ? 'error' : 'success'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {voucher.account?.name_ar || voucher.account?.name_en || 'غير محدد'}
                                    </TableCell>
                                    <TableCell>{Number(voucher.amount).toLocaleString()}</TableCell>
                                    <TableCell>
                                        {voucher.treasury_id ? 'خزينة' : (voucher.bank_account_id ? 'بنك' : 'غير محدد')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStatusLabel(voucher.status || 'posted')} // Default for now if missing
                                            color={getStatusColor(voucher.status || 'posted')}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{voucher.description}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="طباعة">
                                            <IconButton size="small" color="primary" onClick={() => handlePrint(voucher)}>
                                                <PrintIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {/* Assuming only draft can be acted upon, or remove check if API handles permissions */}
                                        {canEdit && (voucher.status === 'draft' || !voucher.status) && (
                                            <Tooltip title="تعديل">
                                                <IconButton size="small" color="info" onClick={() => handleEdit(voucher)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {canDelete && (voucher.status === 'draft' || !voucher.status) && (
                                            <Tooltip title="حذف">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(voucher.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {vouchers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        لا توجد سندات
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <VoucherForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={selectedVoucher}
            />
        </Box>
    );
};

export default VoucherList;

