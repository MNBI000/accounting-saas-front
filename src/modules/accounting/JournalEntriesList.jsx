import React, { useState } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, Typography, Chip, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import JournalEntryForm from './JournalEntryForm';

const MOCK_ENTRIES = [
    { id: 1, number: 'JE-2024-001', date: '2024-01-01', description: 'Opening Balance', amount: 150000, status: 'posted', created_by: 'Admin' },
    { id: 2, number: 'JE-2024-002', date: '2024-01-02', description: 'Sales Invoice #101', amount: 5000, status: 'posted', created_by: 'Sales Agent' },
    { id: 3, number: 'JE-2024-003', date: '2024-01-03', description: 'Office Supplies', amount: 1200, status: 'draft', created_by: 'Accountant' },
];

const JournalEntriesList = () => {
    const { hasPermission } = usePermissions();
    const [entries, setEntries] = useState(MOCK_ENTRIES);
    const [openForm, setOpenForm] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const canCreate = hasPermission(PERMISSIONS.JOURNAL_ENTRIES_CREATE);
    const canView = hasPermission(PERMISSIONS.JOURNAL_ENTRIES_VIEW);

    const handleCreate = () => {
        setSelectedEntry(null);
        setOpenForm(true);
    };

    const handleView = (entry) => {
        setSelectedEntry(entry);
        setOpenForm(true);
    };

    const handleSave = (newEntry) => {
        if (selectedEntry) {
            setEntries(entries.map(e => e.id === selectedEntry.id ? { ...newEntry, id: e.id } : e));
        } else {
            setEntries([...entries, { ...newEntry, id: Date.now(), number: 'JE-NEW', status: 'draft', created_by: 'Me' }]);
        }
        setOpenForm(false);
    };

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
                        {entries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{entry.number}</TableCell>
                                <TableCell>{entry.date}</TableCell>
                                <TableCell>{entry.description}</TableCell>
                                <TableCell>{entry.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={entry.status === 'posted' ? 'مرحل' : 'مسودة'}
                                        color={entry.status === 'posted' ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{entry.created_by}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="عرض التفاصيل">
                                        <IconButton size="small" color="primary" onClick={() => handleView(entry)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
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
