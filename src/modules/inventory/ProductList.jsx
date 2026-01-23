import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Inventory2 as ProductIcon,
    Save as SaveIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';

const ProductList = () => {
    const { hasPermission } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleOpenDialog = () => {
        setEditingProduct(null);
        setOpenDialog(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProduct(null);
    };

    // Mock data
    const products = [
        { id: 1, name: 'لابتوب ديل XPS', sku: 'DELL-XPS-15', price: 45000, stock: 5, category: 'إلكترونيات' },
        { id: 2, name: 'ماوس لوجيتك MX', sku: 'LOGI-MX-3', price: 3500, stock: 0, category: 'ملحقات' },
        { id: 3, name: 'شاشة سامسونج 27 بوصة', sku: 'SAM-27-4K', price: 12000, stock: 12, category: 'إلكترونيات' },
        { id: 4, name: 'كيبورد ميكانيكال', sku: 'KEY-MECH-RGB', price: 2800, stock: 3, category: 'ملحقات' },
    ];

    const getStockStatus = (stock) => {
        if (stock === 0) return <Chip label="نفذت الكمية" color="error" size="small" variant="outlined" />;
        if (stock < 5) return <Chip label="منخفض" color="warning" size="small" variant="outlined" />;
        return <Chip label="متوفر" color="success" size="small" variant="outlined" />;
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        placeholder="بحث عن منتج..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300, bgcolor: 'background.paper', borderRadius: 1 }}
                    />
                </Box>

                {hasPermission(PERMISSIONS.PRODUCTS_CREATE) && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            boxShadow: 2
                        }}
                    >
                        إضافة منتج جديد
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>اسم المنتج</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>كود المنتج</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>التصنيف</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>السعر</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>المخزون</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={product.id}
                                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1, color: 'primary.contrastText', display: 'flex' }}>
                                            <ProductIcon fontSize="small" />
                                        </Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            {product.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>
                                    <Chip label={product.category} size="small" sx={{ bgcolor: 'grey.100' }} />
                                </TableCell>
                                <TableCell>{product.price.toLocaleString()} ج.م</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{getStockStatus(product.stock)}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        {hasPermission(PERMISSIONS.PRODUCTS_EDIT) && (
                                            <Tooltip title="تعديل">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEditProduct(product)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {hasPermission(PERMISSIONS.PRODUCTS_DELETE) && (
                                            <Tooltip title="حذف">
                                                <IconButton size="small" color="error">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create/Edit Product Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                key={editingProduct ? editingProduct.id : 'new'}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
                    <IconButton onClick={handleCloseDialog} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="اسم المنتج"
                                variant="outlined"
                                defaultValue={editingProduct?.name || ''}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="SKU"
                                variant="outlined"
                                defaultValue={editingProduct?.sku || ''}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="التصنيف"
                                variant="outlined"
                                defaultValue={editingProduct?.category || ''}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="سعر الشراء"
                                type="number"
                                variant="outlined"
                                defaultValue={editingProduct?.price ? editingProduct.price * 0.8 : ''}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="سعر البيع"
                                type="number"
                                variant="outlined"
                                defaultValue={editingProduct?.price || ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="الوصف"
                                multiline
                                rows={3}
                                variant="outlined"
                                defaultValue={editingProduct ? 'وصف تجريبي للمنتج...' : ''}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit">
                        إلغاء
                    </Button>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleCloseDialog}>
                        {editingProduct ? 'حفظ التعديلات' : 'حفظ المنتج'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductList;
