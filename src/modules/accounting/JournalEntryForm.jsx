import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow,
    Typography, Autocomplete, Grid, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { apiAccounts } from '../../services/apiAccounts';

const JournalEntryForm = ({ open, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        lines: [
            { account_id: null, description: '', debit: 0, credit: 0 },
            { account_id: null, description: '', debit: 0, credit: 0 }
        ]
    });
    const [accounts, setAccounts] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(false);

    useEffect(() => {
        if (open) {
            fetchAccounts();
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    lines: [
                        { account_id: null, description: '', debit: 0, credit: 0 },
                        { account_id: null, description: '', debit: 0, credit: 0 }
                    ]
                });
            }
        }
    }, [open, initialData]);

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
            // Flatten the tree if necessary or just use the list if it's already flat
            // For autocomplete, we need a flat list of selectable accounts
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
            // Only add selectable accounts (leaf nodes usually)
            if (node.is_selectable || (!node.children || node.children.length === 0)) {
                flat.push(node);
            }
            if (node.children && node.children.length > 0) {
                flat = flat.concat(flattenAccounts(node.children));
            }
        }
        return flat;
    };

    const handleLineChange = (index, field, value) => {
        const newLines = [...formData.lines];
        newLines[index][field] = value;
        setFormData({ ...formData, lines: newLines });
    };

    const addLine = () => {
        setFormData({
            ...formData,
            lines: [...formData.lines, { account_id: null, description: '', debit: 0, credit: 0 }]
        });
    };

    const removeLine = (index) => {
        if (formData.lines.length > 2) {
            const newLines = formData.lines.filter((_, i) => i !== index);
            setFormData({ ...formData, lines: newLines });
        }
    };

    const totalDebit = formData.lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    const handleSubmit = () => {
        if (!isBalanced) {
            alert('القيد غير متوازن!');
            return;
        }
        onSave({ ...formData, amount: totalDebit });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{initialData ? 'تعديل قيد' : 'قيد يومية جديد'}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="التاريخ"
                                type="date"
                                fullWidth
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="البيان"
                                fullWidth
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                    </Grid>

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell width="30%">الحساب</TableCell>
                                <TableCell width="30%">البيان</TableCell>
                                <TableCell width="15%">مدين</TableCell>
                                <TableCell width="15%">دائن</TableCell>
                                <TableCell width="10%"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formData.lines.map((line, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Autocomplete
                                            options={accounts}
                                            loading={loadingAccounts}
                                            getOptionLabel={(option) => `${option.code} - ${option.name_ar || option.name}`}
                                            value={accounts.find(a => a.id === line.account_id) || null}
                                            onChange={(_, newValue) => handleLineChange(index, 'account_id', newValue?.id)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
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
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            value={line.description}
                                            onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            type="number"
                                            fullWidth
                                            value={line.debit}
                                            onChange={(e) => handleLineChange(index, 'debit', e.target.value)}
                                            disabled={Number(line.credit) > 0}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            type="number"
                                            fullWidth
                                            value={line.credit}
                                            onChange={(e) => handleLineChange(index, 'credit', e.target.value)}
                                            disabled={Number(line.debit) > 0}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" color="error" onClick={() => removeLine(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button startIcon={<AddIcon />} onClick={addLine} sx={{ mt: 1 }}>
                        إضافة طرف
                    </Button>

                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>الإجمالي:</Typography>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                            <Typography color={isBalanced ? 'success.main' : 'error.main'}>
                                مدين: {totalDebit.toLocaleString()}
                            </Typography>
                            <Typography color={isBalanced ? 'success.main' : 'error.main'}>
                                دائن: {totalCredit.toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>إلغاء</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!isBalanced}>
                    حفظ
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JournalEntryForm;
