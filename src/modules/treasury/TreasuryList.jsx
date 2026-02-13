import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Typography,
    Tooltip,
    CircularProgress,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import TreasuryForm from './TreasuryForm';
import { apiTreasury } from '../../services/apiTreasury';

const TreasuryList = () => {
    const { hasPermission } = usePermissions();
    const [treasuries, setTreasuries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedTreasury, setSelectedTreasury] = useState(null);

    const canCreate = hasPermission(PERMISSIONS.TREASURIES_CREATE);
    const canEdit = hasPermission(PERMISSIONS.TREASURIES_EDIT);
    const canDelete = hasPermission(PERMISSIONS.TREASURIES_DELETE);

    const fetchTreasuries = async () => {
        setLoading(true);
        try {
            const data = await apiTreasury.getAll();
            setTreasuries(data.data || data); // Handle cases where data is wrapped
            setError(null);
        } catch (err) {
            console.error("Error fetching treasuries:", err);
            setError("فشل في تحميل الخزائن");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTreasuries();
    }, []);

    const handleCreate = () => {
        setSelectedTreasury(null);
        setOpenForm(true);
    };

    const handleEdit = (treasury) => {
        setSelectedTreasury(treasury);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الخزينة؟')) {
            try {
                await apiTreasury.delete(id);
                setTreasuries(treasuries.filter(t => t.id !== id));
            } catch (err) {
                console.error("Error deleting treasury:", err);
                alert("فشلت عملية الحذف");
            }
        }
    };

    const handleSave = async (treasuryData) => {
        try {
            if (selectedTreasury) {
                // Edit
                const updatedTreasury = await apiTreasury.update(selectedTreasury.id, treasuryData);
                setTreasuries(treasuries.map(t => t.id === selectedTreasury.id ? (updatedTreasury.data || updatedTreasury) : t));
            } else {
                // Create
                const newTreasury = await apiTreasury.create(treasuryData);
                setTreasuries([newTreasury.data || newTreasury, ...treasuries]);
            }
            setOpenForm(false);
            fetchTreasuries(); // Refresh list to ensure consistency
        } catch (err) {
            console.error("Error saving treasury:", err);
            alert("فشلت عملية الحفظ");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">إدارة الخزائن</Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        خزينة جديدة
                    </Button>
                )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>الاسم</TableCell>
                                <TableCell>الحساب المرتبط</TableCell>
                                <TableCell align="center">إجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {treasuries.map((treasury) => (
                                <TableRow key={treasury.id}>
                                    <TableCell>{treasury.name}</TableCell>
                                    <TableCell>
                                        {treasury.account?.name_ar || treasury.account?.name_en || 'غير محدد'}
                                    </TableCell>
                                    <TableCell align="center">
                                        {canEdit && (
                                            <Tooltip title="تعديل">
                                                <IconButton size="small" color="info" onClick={() => handleEdit(treasury)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {canDelete && (
                                            <Tooltip title="حذف">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(treasury.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {treasuries.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        لا توجد خزائن
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <TreasuryForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={selectedTreasury}
            />
        </Box>
    );
};

export default TreasuryList;
