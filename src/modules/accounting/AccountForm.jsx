import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Box, Grid, MenuItem, FormControlLabel, Checkbox
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

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
        is_selectable: true,
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                code: '',
                name_ar: '',
                name_en: '',
                type: parentAccount ? parentAccount.type : 'asset',
                parent_id: parentAccount ? parentAccount.id : null,
                is_selectable: true,
                description: ''
            });
        }
    }, [initialData, parentAccount, open]);

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
                            disabled={!!parentAccount} // Inherit type from parent if exists
                        >
                            {ACCOUNT_TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
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
