import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, Typography, Chip, Tooltip, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import JournalEntryForm from './JournalEntryForm';
import { apiJournal } from '../../services/apiJournal';

const JournalEntriesList = () => {
    const { hasPermission } = usePermissions();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const canCreate = hasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE);
    const canView = hasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const data = await apiJournal.getAll();
            if (Array.isArray(data)) {
                setEntries(data);
            } else if (data.data && Array.isArray(data.data)) {
                setEntries(data.data);
            } else {
                setEntries([]);
            }
            setError(null);
        } catch (err) {
            console.error("Failed to fetch journal entries", err);
            setError("فشل في تحميل القيود اليومية.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleCreate = () => {
        setSelectedEntry(null);
        setOpenForm(true);
    };

    const handleView = (entry) => {
        setSelectedEntry(entry);
        setOpenForm(true);
    };

    const handleSave = async (newEntry) => {
        try {
            if (selectedEntry) {
                // Usually journal entries are not editable after posting, but for draft maybe
                // Assuming update logic if needed, or just create
                // If API supports update:
                // await apiJournal.update(selectedEntry.id, newEntry);
                // But typically we might just be creating new ones here or viewing.
                // For now, let's assume we can only create new ones or viewing existing.
                // If the requirement allows editing, we would call update.
                // Let's assume create only for now based on typical accounting rules, 
                // or if it is a draft.
                if (selectedEntry.id) {
                    await apiJournal.update(selectedEntry.id, newEntry);
                }
            } else {
                await apiJournal.create(newEntry);
            }
            setOpenForm(false);
            fetchEntries();
        } catch (err) {
            console.error("Failed to save journal entry", err);
            alert("فشل حفظ القيد");
        }
    };

    if (loading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">القيود اليومية</Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        قيد جديد
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>رقم القيد</TableCell>
                            <TableCell>التاريخ</TableCell>
                            <TableCell>البيان</TableCell>
                            <TableCell>إجمالي المدين/الدائن</TableCell>
                            <TableCell>الحالة</TableCell>
                            <TableCell>بواسطة</TableCell>
                            <TableCell align="center">إجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.number || entry.id}</TableCell>
                                    <TableCell>{entry.date}</TableCell>
                                    <TableCell>{entry.description}</TableCell>
                                    <TableCell>{Number(entry.amount || 0).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={entry.status === 'posted' ? 'مرحل' : 'مسودة'}
                                            color={entry.status === 'posted' ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{entry.created_by || '-'}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="عرض التفاصيل">
                                            <IconButton size="small" color="primary" onClick={() => handleView(entry)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">لا توجد قيود</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <JournalEntryForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={selectedEntry}
            />
        </Box>
    );
};

export default JournalEntriesList;
