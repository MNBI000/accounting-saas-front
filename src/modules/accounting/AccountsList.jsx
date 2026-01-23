import React, { useState } from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, Typography, Chip, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import AccountForm from './AccountForm';

// Mock Data for Chart of Accounts
const MOCK_ACCOUNTS = [
    {
        id: 1, code: '1', name_ar: 'الأصول', name_en: 'Assets', type: 'asset', parent_id: null, level: 1, children: [
            {
                id: 11, code: '11', name_ar: 'الأصول المتداولة', name_en: 'Current Assets', type: 'asset', parent_id: 1, level: 2, children: [
                    {
                        id: 111, code: '111', name_ar: 'النقدية وما في حكمها', name_en: 'Cash & Equivalents', type: 'asset', parent_id: 11, level: 3, children: [
                            { id: 1111, code: '1111', name_ar: 'الصندوق الرئيسي', name_en: 'Main Cash', type: 'asset', parent_id: 111, level: 4, is_selectable: true },
                            { id: 1112, code: '1112', name_ar: 'البنك الأهلي', name_en: 'NBE Bank', type: 'asset', parent_id: 111, level: 4, is_selectable: true },
                            { id: 1113, code: '1113', name_ar: 'فودافون كاش', name_en: 'Vodafone Cash', type: 'asset', parent_id: 111, level: 4, is_selectable: true }
                        ]
                    },
                    { id: 112, code: '112', name_ar: 'العملاء', name_en: 'Accounts Receivable', type: 'asset', parent_id: 11, level: 3, is_selectable: true }
                ]
            },
            { id: 12, code: '12', name_ar: 'الأصول الثابتة', name_en: 'Fixed Assets', type: 'asset', parent_id: 1, level: 2, children: [] }
        ]
    },
    { id: 2, code: '2', name_ar: 'الخصوم', name_en: 'Liabilities', type: 'liability', parent_id: null, level: 1, children: [] },
    { id: 3, code: '3', name_ar: 'حقوق الملكية', name_en: 'Equity', type: 'equity', parent_id: null, level: 1, children: [] },
    { id: 4, code: '4', name_ar: 'الإيرادات', name_en: 'Revenue', type: 'revenue', parent_id: null, level: 1, children: [] },
    { id: 5, code: '5', name_ar: 'المصروفات', name_en: 'Expenses', type: 'expense', parent_id: null, level: 1, children: [] }
];

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
    const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
    const [openForm, setOpenForm] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const canCreate = hasPermission(PERMISSIONS.ACCOUNTS_CREATE);
    const canEdit = hasPermission(PERMISSIONS.ACCOUNTS_EDIT);
    const canDelete = hasPermission(PERMISSIONS.ACCOUNTS_DELETE);

    const handleCreate = () => {
        setSelectedAccount(null);
        setOpenForm(true);
    };

    const handleEdit = (account) => {
        setSelectedAccount(account);
        setOpenForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
            // Recursive delete logic would go here in real app
            console.log('Delete Account', id);
        }
    };

    const handleSave = (accountData) => {
        // Mock save logic
        console.log('Saving account:', accountData);
        setOpenForm(false);
    };

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
                        {accounts.map((account) => (
                            <AccountRow
                                key={account.id}
                                account={account}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                canEdit={canEdit}
                                canDelete={canDelete}
                            />
                        ))}
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
