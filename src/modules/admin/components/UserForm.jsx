import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    Chip,
    OutlinedInput
} from '@mui/material';
import { apiBranches } from '../../../services/apiBranches';

// Known system roles
const AVAILABLE_ROLES = [
    'Admin',
    'Manager',
    'Accountant',
    'Sales_Agent',
    'Warehouse_Manager'
];

const UserForm = ({ open, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        roles: [],
        branch_id: ''
    });
    const [branches, setBranches] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch branches for dropdown
        const fetchBranches = async () => {
            try {
                const data = await apiBranches.getAll();
                setBranches(data.data || data);
            } catch (err) {
                console.error("Failed to load branches", err);
            }
        };
        fetchBranches();
    }, []);

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    email: initialData.email || '',
                    password: '', // Keep empty unless updating
                    roles: initialData.roles ? initialData.roles.map(r => typeof r === 'string' ? r : r.name) : [],
                    branch_id: initialData.branch?.id || initialData.branch_id || ''
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    roles: [],
                    branch_id: ''
                });
            }
            setErrors({});
        }
    }, [open, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const isAdminOrManager = () => {
        return formData.roles.some(r => r.toLowerCase() === 'admin' || r.toLowerCase() === 'manager');
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'اسم المستخدم مطلوب';
        if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
        if (!initialData && !formData.password) newErrors.password = 'كلمة المرور مطلوبة';

        // Dynamic Requirement: Branch ID required unless Admin/Manager
        if (!isAdminOrManager() && !formData.branch_id) {
            newErrors.branch_id = 'يجب اختيار الفرع للمستخدمين العاديين';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Only send password if it has been filled in
            const dataToSave = { ...formData };
            if (initialData && !formData.password) {
                delete dataToSave.password;
            }
            // Nullify branch id if not needed, or let backend handle
            if (formData.branch_id === '') {
                dataToSave.branch_id = null;
            }
            onSave(dataToSave);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {initialData ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="الاسم *"
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
                                label="البريد الإلكتروني *"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                dir="ltr"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={initialData ? "كلمة المرور (اتركه فارغاً للاحتفاظ بالحالية)" : "كلمة المرور *"}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                dir="ltr"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.roles}>
                                <InputLabel>الصلاحيات والمناصب</InputLabel>
                                <Select
                                    multiple
                                    name="roles"
                                    value={formData.roles}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="الصلاحيات والمناصب" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {AVAILABLE_ROLES.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.branch_id}>
                                <InputLabel>الفرع التابع له {isAdminOrManager() ? '(إختياري للإدارة)' : '*'}</InputLabel>
                                <Select
                                    name="branch_id"
                                    value={formData.branch_id}
                                    onChange={handleChange}
                                    input={<OutlinedInput label={`الفرع التابع له ${isAdminOrManager() ? '(إختياري للإدارة)' : '*'}`} />}
                                >
                                    <MenuItem value="">
                                        <em>إختيار الفرع</em>
                                    </MenuItem>
                                    {branches.map((branch) => (
                                        <MenuItem key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.branch_id && <FormHelperText>{errors.branch_id}</FormHelperText>}
                            </FormControl>
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

export default UserForm;
