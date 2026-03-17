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
    Tooltip,
    CircularProgress,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import BankAccountForm from './BankAccountForm';
import { apiBankAccounts } from '../../services/apiBankAccounts';

const BankAccountList = () => {
    const { hasPermission } = usePermissions();
    const [bankAccounts, setBankAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    // Reuse Treasury permissions for now as requested/implied context
    const canCreate = hasPermission(PERMISSIONS.TREASURIES_CREATE);
    const canEdit = hasPermission(PERMISSIONS.TREASURIES_EDIT);
    const canDelete = hasPermission(PERMISSIONS.TREASURIES_DELETE);

    const fetchBankAccounts = async () => {
        setLoading(true);
        try {
            const data = await apiBankAccounts.getAll();
            setBankAccounts(data.data || data);
            setError(null);
        } catch (err) {
            console.error("Error fetching bank accounts:", err);
            setError("فشل في تحميل الحسابات البنكية");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBankAccounts();
    }, []);

    const handleCreate = () => {
        setSelectedAccount(null);
        setOpenForm(true);
    };

    const handleEdit = (account) => {
        setSelectedAccount(account);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الحساب البنكي؟')) {
            try {
                await apiBankAccounts.delete(id);
                setBankAccounts(bankAccounts.filter(a => a.id !== id));
            } catch (err) {
                console.error("Error deleting bank account:", err);
                alert("فشلت عملية الحذف");
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedAccount) {
                const updatedAccount = await apiBankAccounts.update(selectedAccount.id, formData);
                setBankAccounts(bankAccounts.map(a => a.id === selectedAccount.id ? (updatedAccount.data || updatedAccount) : a));
            } else {
                const newAccount = await apiBankAccounts.create(formData);
                setBankAccounts([newAccount.data || newAccount, ...bankAccounts]);
            }
            setOpenForm(false);
            fetchBankAccounts(); // Refresh to ensure data consistency
        } catch (err) {
            console.error("Error saving bank account:", err);
            alert("فشلت عملية الحفظ");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">الحسابات البنكية</Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        حساب بنكي جديد
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
                                <TableCell>اسم البنك</TableCell>
                                <TableCell>رقم الحساب</TableCell>
                                <TableCell>IBAN</TableCell>
                                <TableCell>الحساب المرتبط</TableCell>
                                <TableCell align="center">إجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bankAccounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell>{account.bank_name || account.name}</TableCell>
                                    <TableCell>{account.account_number || '-'}</TableCell>
                                    <TableCell>{account.iban || '-'}</TableCell>
                                    <TableCell>
                                        {account.account?.name_ar || account.account?.name_en || 'غير محدد'}
                                    </TableCell>
                                    <TableCell align="center">
                                        {canEdit && (
                                            <Tooltip title="تعديل">
                                                <IconButton size="small" color="info" onClick={() => handleEdit(account)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {canDelete && (
                                            <Tooltip title="حذف">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(account.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {bankAccounts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        لا توجد حسابات بنكية
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <BankAccountForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={selectedAccount}
            />
        </Box>
    );
};

export default BankAccountList;
