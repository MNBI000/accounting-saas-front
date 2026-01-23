import React, { useState } from 'react';
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
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import VoucherForm from './VoucherForm';

// Mock Data
const MOCK_VOUCHERS = [
    { id: 1, number: 'V-2024-001', date: '2024-01-15', type: 'payment', beneficiary: 'شركة التوريدات الحديثة', amount: 5000, currency: 'EGP', status: 'posted', description: 'دفعة مقدمة - فاتورة 101' },
    { id: 2, number: 'V-2024-002', date: '2024-01-16', type: 'receipt', beneficiary: 'العميل: أحمد محمد', amount: 1200, currency: 'EGP', status: 'draft', description: 'سداد فاتورة مبيعات 55' },
    { id: 3, number: 'V-2024-003', date: '2024-01-18', type: 'payment', beneficiary: 'شركة الكهرباء', amount: 350, currency: 'EGP', status: 'posted', description: 'فاتورة كهرباء يناير' },
];

const VoucherList = () => {
    const { hasPermission } = usePermissions();
    const [vouchers, setVouchers] = useState(MOCK_VOUCHERS);
    const [openForm, setOpenForm] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    const canCreate = hasPermission(PERMISSIONS.VOUCHERS_CREATE);
    const canEdit = hasPermission(PERMISSIONS.VOUCHERS_EDIT);
    const canDelete = hasPermission(PERMISSIONS.VOUCHERS_DELETE);

    const handleCreate = () => {
        setSelectedVoucher(null);
        setOpenForm(true);
    };

    const handleEdit = (voucher) => {
        setSelectedVoucher(voucher);
        setOpenForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السند؟')) {
            setVouchers(vouchers.filter(v => v.id !== id));
        }
    };

    const handleSave = (voucher) => {
        if (selectedVoucher) {
            // Edit
            setVouchers(vouchers.map(v => v.id === voucher.id ? { ...v, ...voucher } : v));
        } else {
            // Create
            setVouchers([...vouchers, { ...voucher, id: Date.now(), status: 'draft' }]);
        }
        setOpenForm(false);
    };

    const handlePrint = (voucher) => {
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        const voucherTitle = voucher.type === 'payment' ? 'سند صرف نقدية' : 'سند قبض نقدية';
        const companyName = 'الشركة الافتراضية للتجارة'; // Placeholder

        const htmlContent = `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <title>طباعة ${voucher.number}</title>
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
                            <span>${voucher.number}</span>
                        </div>
                        <div class="meta-item" style="text-align: left;">
                            <strong>التاريخ</strong>
                            <span>${voucher.date}</span>
                        </div>
                    </div>

                    <div class="amount-box">
                        ${voucher.amount.toLocaleString()} ${voucher.currency}
                    </div>

                    <table class="details-table">
                        <tr>
                            <td class="label">المستفيد / المستلم:</td>
                            <td class="value">${voucher.beneficiary}</td>
                        </tr>
                        <tr>
                            <td class="label">وذلك عن:</td>
                            <td class="value">${voucher.description}</td>
                        </tr>
                        <tr>
                            <td class="label">طريقة الدفع:</td>
                            <td class="value">نقداً / شيك</td>
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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>رقم السند</TableCell>
                            <TableCell>التاريخ</TableCell>
                            <TableCell>النوع</TableCell>
                            <TableCell>المستفيد / المستلم</TableCell>
                            <TableCell>المبلغ</TableCell>
                            <TableCell>العملة</TableCell>
                            <TableCell>الحالة</TableCell>
                            <TableCell>البيان</TableCell>
                            <TableCell align="center">إجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vouchers.map((voucher) => (
                            <TableRow key={voucher.id}>
                                <TableCell>{voucher.number}</TableCell>
                                <TableCell>{voucher.date}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getTypeLabel(voucher.type)}
                                        size="small"
                                        color={voucher.type === 'payment' ? 'error' : 'success'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{voucher.beneficiary}</TableCell>
                                <TableCell>{voucher.amount.toLocaleString()}</TableCell>
                                <TableCell>{voucher.currency}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusLabel(voucher.status)}
                                        color={getStatusColor(voucher.status)}
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
                                    {canEdit && voucher.status === 'draft' && (
                                        <Tooltip title="تعديل">
                                            <IconButton size="small" color="info" onClick={() => handleEdit(voucher)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {canDelete && voucher.status === 'draft' && (
                                        <Tooltip title="حذف">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(voucher.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
