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
    Select
} from '@mui/material';

const VoucherForm = ({ open, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        number: '',
        date: new Date().toISOString().split('T')[0],
        type: 'payment',
        beneficiary: '',
        amount: '',
        currency: 'EGP',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                number: `V-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`, // Auto-generate mock number
                date: new Date().toISOString().split('T')[0],
                type: 'payment',
                beneficiary: '',
                amount: '',
                currency: 'EGP',
                description: ''
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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {initialData ? 'تعديل سند' : 'سند جديد'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="رقم السند"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                required
                                disabled // Usually auto-generated
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
                            <TextField
                                fullWidth
                                label="المستفيد / المستلم"
                                name="beneficiary"
                                value={formData.beneficiary}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
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
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>العملة</InputLabel>
                                <Select
                                    name="currency"
                                    value={formData.currency}
                                    label="العملة"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="EGP">جنيه مصري (EGP)</MenuItem>
                                    <MenuItem value="USD">دولار أمريكي (USD)</MenuItem>
                                    <MenuItem value="EUR">يورو (EUR)</MenuItem>
                                    <MenuItem value="SAR">ريال سعودي (SAR)</MenuItem>
                                </Select>
                            </FormControl>
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
