import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Paper,
    Button,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import VoucherForm from './VoucherForm';
import { apiVouchers } from '../../services/apiVouchers';

const VoucherList = () => {
    const { hasPermission } = usePermissions();
    const [openForm, setOpenForm] = useState(false);

    const canCreate = hasPermission(PERMISSIONS.VOUCHERS_CREATE);

    const handleCreate = () => {
        setOpenForm(true);
    };

    const handleSave = async (voucherData) => {
        try {
            await apiVouchers.create(voucherData);
            setOpenForm(false);
        } catch (err) {
            console.error("Error saving voucher:", err);
            alert("فشلت عملية الحفظ");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">سندات القبض والصرف (العمليات النقدية والبنكية)</Typography>
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

            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                    تظهر فى قيود اليومية و باقي التقارير
                </Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/accounting?tab=journal_entries"
                >
                    الذهاب إلى قيود اليومية
                </Button>
            </Paper>

            <VoucherForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={null}
            />
        </Box>
    );
};

export default VoucherList;
