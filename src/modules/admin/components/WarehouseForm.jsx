import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    MenuItem
} from '@mui/material';

const WarehouseForm = ({ open, onClose, onSave, initialData, branches }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        branch_id: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    address: initialData.address || '',
                    branch_id: initialData.branch_id || ''
                });
            } else {
                setFormData({
                    name: '',
                    address: '',
                    branch_id: ''
                });
            }
            setErrors({});
        }
    }, [open, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'اسم المستودع مطلوب';
        if (!formData.branch_id) newErrors.branch_id = 'الفرع مطلوب';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {initialData ? 'تعديل مستودع' : 'إضافة مستودع جديد'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="اسم المستودع *"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="الفرع *"
                                name="branch_id"
                                value={formData.branch_id}
                                onChange={handleChange}
                                error={!!errors.branch_id}
                                helperText={errors.branch_id}
                            >
                                {branches && branches.map((branch) => (
                                    <MenuItem key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="العنوان"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose}>إلغاء</Button>
                    <Button type="submit" variant="contained" color="primary">
                        حفظ
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default WarehouseForm;
