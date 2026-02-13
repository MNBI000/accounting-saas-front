import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, Typography, Chip, Tooltip, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import AccountForm from './AccountForm';
import { apiAccounts } from '../../services/apiAccounts';

const AccountRow = ({ account, level = 0, onEdit, onDelete, canEdit, canDelete }) => {
    const [open, setOpen] = useState(true);
    const hasChildren = account.children && account.children.length > 0;

    return (
        <React.Fragment>
            <TableRow hover sx={{ backgroundColor: level === 0 ? '#fafafa' : 'inherit' }}>
                <TableCell sx={{ pl: 2 + level * 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {hasChildren ? (
                            <IconButton
                                size="small"
                                onClick={() => setOpen(!open)}
                                sx={{ mr: 1 }}
                            >
                                {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                            </IconButton>
                        ) : (
                            <Box sx={{ width: 32, mr: 1 }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: hasChildren ? 'bold' : 'normal' }}>
                            {account.code} - {account.name_ar}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>{account.name_en}</TableCell>
                <TableCell>
                    <Chip
                        label={account.type}
                        size="small"
                        color={['asset', 'expense'].includes(account.type) ? 'primary' : 'secondary'}
                        variant="outlined"
                    />
                </TableCell>
                <TableCell align="center">
                    {account.is_selectable ?
                        <Chip label="فرعي" size="small" color="success" variant="outlined" /> :
                        <Chip label="رئيسي" size="small" variant="outlined" />
                    }
                </TableCell>
                <TableCell align="center">
                    {canEdit && (
                        <Tooltip title="تعديل">
                            <IconButton size="small" color="info" onClick={() => onEdit(account)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {canDelete && !hasChildren && (
                        <Tooltip title="حذف">
                            <IconButton size="small" color="error" onClick={() => onDelete(account.id)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </TableCell>
            </TableRow>
            {hasChildren && open && account.children.map((child) => (
                <AccountRow
                    key={child.id}
                    account={child}
                    level={level + 1}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canEdit={canEdit}
                    canDelete={canDelete}
                />
            ))}
        </React.Fragment>
    );
};

const AccountsList = () => {
    const { hasPermission } = usePermissions();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const canCreate = hasPermission(PERMISSIONS.ACCOUNTS_CREATE);
    const canEdit = hasPermission(PERMISSIONS.ACCOUNTS_EDIT);
    const canDelete = hasPermission(PERMISSIONS.ACCOUNTS_DELETE);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const data = await apiAccounts.getAll();

            let accountsData = [];
            if (Array.isArray(data)) {
                accountsData = data;
            } else if (data.data && Array.isArray(data.data)) {
                accountsData = data.data;
            }

            // Check if data is already a tree (roots only in top level) or flat list
            // If we find items with parent_id != null in the top level array, it's likely a flat list
            const isFlat = accountsData.some(item => item.parent_id !== null && item.parent_id !== undefined);

            if (isFlat) {
                const tree = buildTree(accountsData);
                setAccounts(tree);
            } else {
                setAccounts(accountsData);
            }

            setError(null);
        } catch (err) {
            console.error("Failed to fetch accounts", err);
            setError("فشل في تحميل دليل الحسابات. تأكد من الاتصال بالخادم.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to build tree from flat list
    const buildTree = (items) => {
        const rootItems = [];
        const lookup = {};
        for (const item of items) {
            lookup[item.id] = { ...item, children: [] };
        }
        for (const item of items) {
            if (item.parent_id) {
                if (lookup[item.parent_id]) {
                    lookup[item.parent_id].children.push(lookup[item.id]);
                } else {
                    // Parent not found, maybe treat as root?
                    rootItems.push(lookup[item.id]);
                }
            } else {
                rootItems.push(lookup[item.id]);
            }
        }
        return rootItems;
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleCreate = () => {
        setSelectedAccount(null);
        setOpenForm(true);
    };

    const handleEdit = (account) => {
        setSelectedAccount(account);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
            try {
                await apiAccounts.delete(id);
                fetchAccounts(); // Refresh list
            } catch (err) {
                console.error("Failed to delete account", err);
                alert("فشل حذف الحساب");
            }
        }
    };

    const handleSave = async (accountData) => {
        try {
            if (selectedAccount) {
                await apiAccounts.update(selectedAccount.id, accountData);
            } else {
                await apiAccounts.create(accountData);
            }
            setOpenForm(false);
            fetchAccounts(); // Refresh list
        } catch (err) {
            console.error("Failed to save account", err);
            alert("فشل حفظ الحساب");
        }
    };

    if (loading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">دليل الحسابات</Typography>
                {canCreate && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                    >
                        حساب جديد
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell>كود / اسم الحساب</TableCell>
                            <TableCell>Name (EN)</TableCell>
                            <TableCell>النوع</TableCell>
                            <TableCell align="center">التصنيف</TableCell>
                            <TableCell align="center">إجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {accounts.length > 0 ? (
                            accounts.map((account) => (
                                <AccountRow
                                    key={account.id}
                                    account={account}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    canEdit={canEdit}
                                    canDelete={canDelete}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">لا توجد حسابات</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <AccountForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSave={handleSave}
                initialData={selectedAccount}
            />
        </Box>
    );
};

export default AccountsList;
