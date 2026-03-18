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
    Alert,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';
import BranchForm from './BranchForm';
import { apiBranches } from '../../../services/apiBranches';

const BranchesList = () => {
    const { hasPermission } = usePermissions();
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    const canManage = hasPermission(PERMISSIONS.BRANCHES_MANAGE);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const data = await apiBranches.getAll();
            setBranches(data.data || data);
            setError(null);
        } catch (err) {
            console.error("Error fetching branches:", err);
            setError("فشل في تحميل الفروع");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleCreate = () => {
        setSelectedBranch(null);
        setOpenForm(true);
    };

    const handleEdit = (branch) => {
        setSelectedBranch(branch);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الفرع؟')) {
            try {
                await apiBranches.delete(id);
                setBranches(branches.filter(b => b.id !== id));
            } catch (err) {
                console.error("Error deleting branch:", err);
                if (err.response && err.response.status === 422) {
                    alert('Cannot delete branch. Reassign or remove its users first.');
                } else {
                    alert("فشلت عملية الحذف");
                }
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedBranch) {
                const updatedBranch = await apiBranches.update(selectedBranch.id, formData);
                setBranches(branches.map(b => b.id === selectedBranch.id ? (updatedBranch.data || updatedBranch) : b));
            } else {
                const newBranch = await apiBranches.create(formData);
                setBranches([newBranch.data || newBranch, ...branches]);
            }
            setOpenForm(false);
            fetchBranches();
        } catch (err) {
            console.error("Error saving branch:", err);
            alert("فشلت عملية الحفظ");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">إدارة الفروع</Typography>
                {canManage && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        فرع جديد
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
                                <TableCell>رقم الهاتف</TableCell>
                                <TableCell>العنوان</TableCell>
                                <TableCell align="center">المستخدمين المرتبطين</TableCell>
                                <TableCell align="center">الحالة</TableCell>
                                <TableCell align="center">إجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {branches.map((branch) => (
                                <TableRow key={branch.id}>
                                    <TableCell>{branch.name}</TableCell>
                                    <TableCell>{branch.phone || '-'}</TableCell>
                                    <TableCell>{branch.address || '-'}</TableCell>
                                    <TableCell align="center">{branch.users_count || 0}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={branch.is_active ? 'نشط' : 'غير نشط'}
                                            color={branch.is_active ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {canManage && (
                                            <>
                                                <Tooltip title="تعديل">
                                                    <IconButton size="small" color="info" onClick={() => handleEdit(branch)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="حذف">
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(branch.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {branches.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        لا توجد فروع مسجلة
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <BranchForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={selectedBranch}
            />
        </Box>
    );
};

export default BranchesList;
