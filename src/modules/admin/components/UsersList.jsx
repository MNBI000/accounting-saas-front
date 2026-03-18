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
import UserForm from './UserForm';
import { apiUsers } from '../../../services/apiUsers';

const UsersList = () => {
    const { hasPermission } = usePermissions();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const canManage = hasPermission(PERMISSIONS.USERS_MANAGE);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await apiUsers.getAll();
            setUsers(data.data || data);
            setError(null);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("فشل في تحميل المستخدمين");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = () => {
        setSelectedUser(null);
        setOpenForm(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            try {
                await apiUsers.delete(id);
                setUsers(users.filter(u => u.id !== id));
            } catch (err) {
                console.error("Error deleting user:", err);
                alert("فشلت عملية الحذف");
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedUser) {
                const updatedUser = await apiUsers.update(selectedUser.id, formData);
                setUsers(users.map(u => u.id === selectedUser.id ? (updatedUser.data || updatedUser) : u));
            } else {
                const newUser = await apiUsers.create(formData);
                setUsers([newUser.data || newUser, ...users]);
            }
            setOpenForm(false);
            fetchUsers();
        } catch (err) {
            console.error("Error saving user:", err);
            if (err.response && err.response.status === 422) {
                alert('Validation error: ' + JSON.stringify(err.response.data.errors || err.response.data.message));
            } else {
                alert("فشلت عملية الحفظ");
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">إدارة المستخدمين</Typography>
                {canManage && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        مستخدم جديد
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
                                <TableCell>البريد الإلكتروني</TableCell>
                                <TableCell>الصلاحيات</TableCell>
                                <TableCell>الفرع التابع له</TableCell>
                                <TableCell align="center">إجراءات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {user.roles && user.roles.map(r => {
                                                const roleName = typeof r === 'string' ? r : r.name;
                                                return <Chip key={roleName} label={roleName} size="small" color="primary" variant="outlined" />;
                                            })}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {user.branch ? (
                                            <Chip label={user.branch.name} size="small" color="success" />
                                        ) : (
                                            <Chip label="كل الفروع" size="small" color="default" />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {canManage && (
                                            <>
                                                <Tooltip title="تعديل">
                                                    <IconButton size="small" color="info" onClick={() => handleEdit(user)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="حذف">
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(user.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        لا يوجد مستخدمين
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <UserForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={selectedUser}
            />
        </Box>
    );
};

export default UsersList;
