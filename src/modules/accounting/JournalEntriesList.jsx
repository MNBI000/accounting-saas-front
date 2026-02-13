import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Typography, Chip, Tooltip, CircularProgress, Alert, TextField
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import JournalEntryDetailsDialog from './JournalEntryDetailsDialog';
import { apiJournal } from '../../services/apiJournal';

const JournalEntriesList = () => {
    const { hasPermission } = usePermissions();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);


    const canView = hasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW);

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const data = await apiJournal.getAll(selectedDate);
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
    }, [selectedDate]);



    const handleView = async (entry) => {
        try {
            // Optimistically show details if we have them, usually list items are summaries.
            // We fetch the full detail to get 'items' (debit/credit lines).
            const fullEntry = await apiJournal.getById(entry.id);
            setSelectedEntry(fullEntry);
        } catch (err) {
            console.error("Failed to fetch full entry details", err);
            // Fallback to the partial entry from the list
            setSelectedEntry(entry);
        }
        setOpenForm(true);
    };



    if (loading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h6">القيود اليومية</Typography>
                <TextField
                    label="التاريخ"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    size="small"
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>رقم القيد</TableCell>
                            <TableCell>التاريخ</TableCell>
                            <TableCell>البيان</TableCell>
                            <TableCell>الإجمالي</TableCell>
                            <TableCell>الحالة</TableCell>
                            <TableCell>بواسطة</TableCell>
                            <TableCell align="center">إجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.reference_no || entry.id}</TableCell>
                                    <TableCell>{entry.date ? entry.date.split('T')[0] : '-'}</TableCell>
                                    <TableCell>{entry.description_ar || entry.description_en || '-'}</TableCell>
                                    <TableCell>{Number(entry.total_amount || 0).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={entry.status === 'posted' ? 'مرحل' : entry.status}
                                            color={entry.status === 'posted' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{entry.user?.name || '-'}</TableCell>
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

            <JournalEntryDetailsDialog
                open={openForm}
                onClose={() => setOpenForm(false)}
                entry={selectedEntry}
            />
        </Box>
    );
};

export default JournalEntriesList;
