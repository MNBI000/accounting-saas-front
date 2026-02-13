import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Box, Grid, MenuItem, FormControlLabel, Checkbox, Autocomplete, CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { apiAccounts } from '../../services/apiAccounts';

const ACCOUNT_TYPES = [
    { value: 'asset', label: 'أصول' },
    { value: 'liability', label: 'خصوم' },
    { value: 'equity', label: 'حقوق ملكية' },
    { value: 'revenue', label: 'إيرادات' },
    { value: 'expense', label: 'مصروفات' },
];

const AccountForm = ({ open, onClose, onSave, initialData, parentAccount }) => {
    const [formData, setFormData] = useState({
        code: '',
        name_ar: '',
        name_en: '',
        type: 'asset',
        parent_id: null,
        currency_id: 1, // Default currency
        is_selectable: true,
        description: ''
    });
    const [accounts, setAccounts] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(false);

    useEffect(() => {
        if (open) {
            fetchAccounts();
            if (initialData) {
                setFormData({ ...initialData, currency_id: initialData.currency_id || 1 });
            } else {
                setFormData({
                    code: '',
                    name_ar: '',
                    name_en: '',
                    type: parentAccount ? parentAccount.type : 'asset',
                    parent_id: parentAccount ? parentAccount.id : null,
                    currency_id: 1,
                    is_selectable: true,
                    description: ''
                });
            }
        }
    }, [initialData, parentAccount, open]);

    const fetchAccounts = async () => {
        setLoadingAccounts(true);
        try {
            const data = await apiAccounts.getAll();
            let accountsData = [];
            if (Array.isArray(data)) {
                accountsData = data;
            } else if (data.data && Array.isArray(data.data)) {
                accountsData = data.data;
            }
            // Flatten the tree if necessary
            const flatAccounts = flattenAccounts(accountsData);
            setAccounts(flatAccounts);
        } catch (err) {
            console.error("Failed to fetch accounts", err);
        } finally {
            setLoadingAccounts(false);
        }
    };

    const flattenAccounts = (nodes) => {
        let flat = [];
        for (const node of nodes) {
            flat.push(node);
            if (node.children && node.children.length > 0) {
                flat = flat.concat(flattenAccounts(node.children));
            }
        }
        return flat;
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {initialData ? 'تعديل حساب' : 'إضافة حساب جديد'}
                {parentAccount && ` (تابع لـ: ${parentAccount.name_ar})`}
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="كود الحساب"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            select
                            label="نوع الحساب"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            disabled={!!parentAccount || !!formData.parent_id} // Inherit type from parent if exists
                        >
                            {ACCOUNT_TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Parent Account Selection */}
                    <Grid item xs={12}>
                        <Autocomplete
                            options={accounts}
                            loading={loadingAccounts}
                            getOptionLabel={(option) => `${option.code} - ${option.name_ar || option.name}`}
                            value={accounts.find(a => a.id === formData.parent_id) || null}
                            onChange={(_, newValue) => {
                                setFormData({
                                    ...formData,
                                    parent_id: newValue ? newValue.id : null,
                                    type: newValue ? newValue.type : formData.type // Inherit type
                                });
                            }}
                            disabled={!!parentAccount} // Disable if parent is passed via props
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="الحساب الرئيسي (الأب)"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loadingAccounts ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="اسم الحساب (عربي)"
                            name="name_ar"
                            value={formData.name_ar}
                            onChange={handleChange}
                            required
                            dir="rtl"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Account Name (English)"
                            name="name_en"
                            value={formData.name_en}
                            onChange={handleChange}
                            dir="ltr"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="الوصف"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            multiline
                            rows={2}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.is_selectable}
                                    onChange={handleChange}
                                    name="is_selectable"
                                    color="primary"
                                />
                            }
                            label="حساب فرعي (يقبل القيود)"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>إلغاء</Button>
                <Button variant="contained" onClick={handleSubmit} startIcon={<SaveIcon />}>
                    حفظ
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AccountForm;
