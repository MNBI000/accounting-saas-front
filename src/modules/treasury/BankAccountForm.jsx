import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
    Alert
} from '@mui/material';
import { apiAccounts } from '../../services/apiAccounts';
import { apiCurrencies } from '../../services/apiCurrencies';
import { apiBranches } from '../../services/apiBranches';

const BankAccountForm = ({ open, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        bank_name: '',
        account_number: '',
        iban: '',
        currency_id: '',
        account_id: '',
        branch_id: ''
    });

    const [accounts, setAccounts] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [accountsRes, currenciesRes, branchesRes] = await Promise.all([
                    apiAccounts.getAll(),
                    apiCurrencies.getAll(),
                    apiBranches.getAll()
                ]);
                setAccounts(accountsRes.data || accountsRes);
                setCurrencies(currenciesRes.data || currenciesRes);
                setBranches(branchesRes.data || branchesRes);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("فشل في تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchData();
            const currentBranch = localStorage.getItem('current_branch_id') || 1;
            setFormData(prev => ({ ...prev, branch_id: currentBranch }));
        }
    }, [open]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                bank_name: initialData.bank_name || initialData.name, // Handle default/fallback
                account_number: initialData.account_number || '',
                iban: initialData.iban || '',
                currency_id: initialData.currency_id || '',
                account_id: initialData.account_id,
                branch_id: initialData.branch_id
            });
        } else {
            const currentBranch = localStorage.getItem('current_branch_id') || 1;
            setFormData({
                bank_name: '',
                account_number: '',
                iban: '',
                currency_id: '',
                account_id: '',
                branch_id: currentBranch
            });
        }
    }, [initialData, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (loading && !accounts.length) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {initialData ? 'تعديل حساب بنكي' : 'إضافة حساب بنكي جديد'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="اسم البنك"
                                name="bank_name"
                                value={formData.bank_name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="رقم الحساب"
                                name="account_number"
                                value={formData.account_number}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="IBAN"
                                name="iban"
                                value={formData.iban}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>العملة</InputLabel>
                                <Select
                                    name="currency_id"
                                    value={formData.currency_id}
                                    label="العملة"
                                    onChange={handleChange}
                                >
                                    {currencies.map(currency => (
                                        <MenuItem key={currency.id} value={currency.id}>
                                            {currency.name} ({currency.code})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>الحساب المرتبط (شجرة الحسابات)</InputLabel>
                                <Select
                                    name="account_id"
                                    value={formData.account_id}
                                    label="الحساب المرتبط (شجرة الحسابات)"
                                    onChange={handleChange}
                                >
                                    {accounts.map(acc => (
                                        <MenuItem key={acc.id} value={acc.id}>
                                            {acc.name_ar} ({acc.code})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>الفرع</InputLabel>
                                <Select
                                    name="branch_id"
                                    value={formData.branch_id}
                                    label="الفرع"
                                    onChange={handleChange}
                                >
                                    {branches.map(branch => (
                                        <MenuItem key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>إلغاء</Button>
                    <Button type="submit" variant="contained" color="primary">
                        حفظ
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BankAccountForm;
