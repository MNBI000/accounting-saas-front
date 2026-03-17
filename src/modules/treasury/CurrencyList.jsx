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
import CurrencyForm from './CurrencyForm';
import { apiCurrencies } from '../../services/apiCurrencies';

const CurrencyList = () => {
    const { hasPermission } = usePermissions();
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    // Reuse Treasury permissions for now
    const canCreate = hasPermission(PERMISSIONS.TREASURIES_CREATE);
    const canEdit = hasPermission(PERMISSIONS.TREASURIES_EDIT);
    const canDelete = hasPermission(PERMISSIONS.TREASURIES_DELETE);

    const fetchCurrencies = async () => {
        setLoading(true);
        try {
            const data = await apiCurrencies.getAll();
            setCurrencies(data.data || data);
            setError(null);
        } catch (err) {
            console.error("Error fetching currencies:", err);
            setError("فشل في تحميل العملات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const handleCreate = () => {
        setSelectedCurrency(null);
        setOpenForm(true);
    };

    const handleEdit = (currency) => {
        setSelectedCurrency(currency);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذه العملة؟')) {
            try {
                await apiCurrencies.delete(id);
                setCurrencies(currencies.filter(c => c.id !== id));
            } catch (err) {
                console.error("Error deleting currency:", err);
                alert("فشلت عملية الحذف");
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedCurrency) {
                const updatedCurrency = await apiCurrencies.update(selectedCurrency.id, formData);
                setCurrencies(currencies.map(c => c.id === selectedCurrency.id ? (updatedCurrency.data || updatedCurrency) : c));
            } else {
                const newCurrency = await apiCurrencies.create(formData);
                setCurrencies([newCurrency.data || newCurrency, ...currencies]);
            }
            setOpenForm(false);
            fetchCurrencies(); // Refresh to ensure data consistency
        } catch (err) {
            console.error("Error saving currency:", err);
            alert("فشلت عملية الحفظ");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">العملات</Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        عملة جديدة
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
                                <TableCell>الكود</TableCell>
                                <TableCell>الاسم</TableCell>
                                <TableCell>الرمز</TableCell>
                                <TableCell align="center">إجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currencies.map((currency) => (
                                <TableRow key={currency.id}>
                                    <TableCell>{currency.code}</TableCell>
                                    <TableCell>{currency.name}</TableCell>
                                    <TableCell>{currency.symbol || '-'}</TableCell>
                                    <TableCell align="center">
                                        {canEdit && (
                                            <Tooltip title="تعديل">
                                                <IconButton size="small" color="info" onClick={() => handleEdit(currency)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {canDelete && (
                                            <Tooltip title="حذف">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(currency.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {currencies.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        لا توجد عملات
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <CurrencyForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={selectedCurrency}
            />
        </Box>
    );
};

export default CurrencyList;
