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
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';
import WarehouseForm from './WarehouseForm';
import { apiWarehouses } from '../../../services/apiWarehouses';
import { apiBranches } from '../../../services/apiBranches';

const WarehousesList = () => {
    const { hasPermission } = usePermissions();
    const [warehouses, setWarehouses] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const canManageContext = hasPermission(PERMISSIONS.WAREHOUSES_MANAGE) || hasPermission(PERMISSIONS.BRANCHES_MANAGE);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [warehousesData, branchesData] = await Promise.all([
                apiWarehouses.getAll(),
                apiBranches.getAll()
            ]);
            setWarehouses(warehousesData.data || warehousesData);
            setBranches(branchesData.data || branchesData);
            setError(null);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("فشل في تحميل المستودعات");
        } finally {
            setLoading(false);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await apiWarehouses.getAll();
            setWarehouses(response.data || response);
        } catch (err) {
            console.error("Error fetching warehouses", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = () => {
        setSelectedWarehouse(null);
        setOpenForm(true);
    };

    const handleEdit = (warehouse) => {
        setSelectedWarehouse(warehouse);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستودع؟')) {
            try {
                await apiWarehouses.delete(id);
                setWarehouses(warehouses.filter(w => w.id !== id));
            } catch (err) {
                console.error("Error deleting warehouse:", err);
                alert("فشلت عملية الحذف");
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedWarehouse) {
                await apiWarehouses.update(selectedWarehouse.id, formData);
            } else {
                await apiWarehouses.create(formData);
            }
            setOpenForm(false);
            fetchWarehouses();
        } catch (err) {
            console.error("Error saving warehouse:", err);
            alert("فشلت عملية الحفظ");
        }
    };

    const getBranchName = (branchId) => {
        const branch = branches.find(b => b.id === branchId);
        return branch ? branch.name : '-';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">إدارة المستودعات</Typography>
                {canManageContext && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        مستودع جديد
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
                                <TableCell>اسم المستودع</TableCell>
                                <TableCell>الفرع</TableCell>
                                <TableCell>العنوان</TableCell>
                                <TableCell align="center">إجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {warehouses.map((warehouse) => (
                                <TableRow key={warehouse.id}>
                                    <TableCell>{warehouse.name}</TableCell>
                                    <TableCell>{warehouse.branch ? warehouse.branch.name : getBranchName(warehouse.branch_id)}</TableCell>
                                    <TableCell>{warehouse.address || '-'}</TableCell>
                                    <TableCell align="center">
                                        {canManageContext && (
                                            <>
                                                <Tooltip title="تعديل">
                                                    <IconButton size="small" color="info" onClick={() => handleEdit(warehouse)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="حذف">
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(warehouse.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {warehouses.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        لا توجد مستودعات مسجلة
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <WarehouseForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={selectedWarehouse}
                branches={branches}
            />
        </Box>
    );
};

export default WarehousesList;
