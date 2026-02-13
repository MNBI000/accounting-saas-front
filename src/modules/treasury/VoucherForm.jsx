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
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    CircularProgress,
    Alert
} from '@mui/material';
import { apiAccounts } from '../../services/apiAccounts';
import { apiTreasury } from '../../services/apiTreasury';
import { apiBankAccounts } from '../../services/apiBankAccounts';

const VoucherForm = ({ open, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        voucher_number: '',
        date: new Date().toISOString().split('T')[0],
        type: 'payment',
        amount: '',
        description: '',
        account_id: '',
        payment_method: 'cash', // 'cash' or 'bank'
        treasury_id: '',
        bank_account_id: ''
    });

    const [accounts, setAccounts] = useState([]);
    const [treasuries, setTreasuries] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [accountsRes, treasuriesRes, banksRes] = await Promise.all([
                    apiAccounts.getAll(),
                    apiTreasury.getAll(),
                    apiBankAccounts.getAll()
                ]);
                setAccounts(accountsRes.data || accountsRes); // Handle if response is wrapped in data
                setTreasuries(treasuriesRes.data || treasuriesRes);
                setBankAccounts(banksRes.data || banksRes);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("فشل في تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchData();
        }
    }, [open]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                payment_method: initialData.bank_account_id ? 'bank' : 'cash',
                voucher_number: initialData.voucher_number || initialData.number // Handle potential field name mismatch
            });
        } else {
            setFormData({
                voucher_number: '', // Let backend handle generation if empty, or generate here if needed
                date: new Date().toISOString().split('T')[0],
                type: 'payment',
                amount: '',
                description: '',
                account_id: '',
                payment_method: 'cash',
                treasury_id: '',
                bank_account_id: ''
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

        // Prepare payload
        const payload = {
            voucher_number: formData.voucher_number,
            type: formData.type,
            date: formData.date,
            amount: parseFloat(formData.amount),
            description: formData.description,
            account_id: formData.account_id,
            treasury_id: formData.payment_method === 'cash' ? formData.treasury_id : null,
            bank_account_id: formData.payment_method === 'bank' ? formData.bank_account_id : null
        };

        onSave(payload);
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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {initialData ? 'تعديل سند' : 'سند جديد'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="رقم السند"
                                name="voucher_number"
                                value={formData.voucher_number}
                                onChange={handleChange}
                                placeholder="اختياري (يتم التوليد تلقائياً)"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="التاريخ"
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>نوع السند</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    label="نوع السند"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="payment">سند صرف</MenuItem>
                                    <MenuItem value="receipt">سند قبض</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>الحساب (المستفيد / العميل)</InputLabel>
                                <Select
                                    name="account_id"
                                    value={formData.account_id}
                                    label="الحساب (المستفيد / العميل)"
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
                            <FormControl component="fieldset">
                                <FormLabel component="legend">طريقة الدفع</FormLabel>
                                <RadioGroup
                                    row
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="cash" control={<Radio />} label="نقداً (خزينة)" />
                                    <FormControlLabel value="bank" control={<Radio />} label="بنك" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        {formData.payment_method === 'cash' ? (
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>الخزينة</InputLabel>
                                    <Select
                                        name="treasury_id"
                                        value={formData.treasury_id}
                                        label="الخزينة"
                                        onChange={handleChange}
                                    >
                                        {treasuries.map(t => (
                                            <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ) : (
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>الحساب البنكي</InputLabel>
                                    <Select
                                        name="bank_account_id"
                                        value={formData.bank_account_id}
                                        label="الحساب البنكي"
                                        onChange={handleChange}
                                    >
                                        {bankAccounts.map(b => (
                                            <MenuItem key={b.id} value={b.id}>
                                                {b.bank_name} - {b.account_number}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="المبلغ"
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="البيان"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
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

export default VoucherForm;

