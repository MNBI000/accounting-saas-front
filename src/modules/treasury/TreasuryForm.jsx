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

const TreasuryForm = ({ open, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        account_id: '',
        branch_id: ''
    });

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            try {
                const response = await apiAccounts.getAll();
                setAccounts(response.data || response);
            } catch (err) {
                console.error("Error fetching accounts:", err);
                setError("فشل في تحميل الحسابات");
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchAccounts();
            // Get branch_id from localStorage or default to 1 (Main Branch)
            const currentBranch = localStorage.getItem('current_branch_id') || 1;
            setFormData(prev => ({ ...prev, branch_id: currentBranch }));
        }
    }, [open]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                account_id: initialData.account_id,
                branch_id: initialData.branch_id
            });
        } else {
            const currentBranch = localStorage.getItem('current_branch_id') || 1;
            setFormData({
                name: '',
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
                {initialData ? 'تعديل خزينة' : 'إضافة خزينة جديدة'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="اسم الخزينة"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>الحساب المرتبط</InputLabel>
                                <Select
                                    name="account_id"
                                    value={formData.account_id}
                                    label="الحساب المرتبط"
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
                        {/* Branch ID is hidden for now as we assume current branch */}
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

export default TreasuryForm;
