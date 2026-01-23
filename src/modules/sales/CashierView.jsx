import React, { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Paper,
    IconButton,
    Chip,
    Divider,
    Avatar,
    Badge,
    Alert,
    Tooltip
} from '@mui/material';
import {
    Search as SearchIcon,
    ShoppingCart as CartIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Print as PrintIcon,
    QrCodeScanner as ScanIcon,
    Payment as PaymentIcon,
    Receipt as ReceiptIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../utils/permissions';
import ReceiptPreview from './ReceiptPreview';

const CashierView = () => {
    const { hasPermission } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [customerName, setCustomerName] = useState('عميل نقدي');
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [lastReceipt, setLastReceipt] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Mock products - In real app, this would come from API
    const products = [
        { id: 1, name: 'لابتوب ديل XPS', sku: 'DELL-XPS-15', price: 45000, stock: 5, category: 'إلكترونيات', image: '💻' },
        { id: 2, name: 'ماوس لوجيتك MX', sku: 'LOGI-MX-3', price: 3500, stock: 12, category: 'ملحقات', image: '🖱️' },
        { id: 3, name: 'شاشة سامسونج 27"', sku: 'SAM-27-4K', price: 12000, stock: 8, category: 'إلكترونيات', image: '🖥️' },
        { id: 4, name: 'كيبورد ميكانيكال', sku: 'KEY-MECH-RGB', price: 2800, stock: 15, category: 'ملحقات', image: '⌨️' },
        { id: 5, name: 'سماعات بلوتوث', sku: 'HEADSET-BT', price: 1500, stock: 20, category: 'ملحقات', image: '🎧' },
        { id: 6, name: 'كاميرا ويب HD', sku: 'WEBCAM-HD', price: 2200, stock: 10, category: 'ملحقات', image: '📹' },
        { id: 7, name: 'طابعة HP', sku: 'HP-PRINTER', price: 8500, stock: 6, category: 'أجهزة', image: '🖨️' },
        { id: 8, name: 'هارديسك خارجي 1TB', sku: 'HDD-1TB', price: 1800, stock: 25, category: 'تخزين', image: '💾' },
    ];

    // Filter products based on search
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Add product to cart
    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            // Increase quantity if already in cart
            setCartItems(cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            // Add new item to cart
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    // Update item quantity
    const updateQuantity = (itemId, delta) => {
        setCartItems(cartItems.map(item => {
            if (item.id === itemId) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: Math.max(1, Math.min(newQuantity, item.stock)) };
            }
            return item;
        }));
    };

    // Remove item from cart
    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    // Clear entire cart
    const clearCart = () => {
        if (window.confirm('هل أنت متأكد من مسح السلة بالكامل؟')) {
            setCartItems([]);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vat = subtotal * 0.14;
    const total = subtotal + vat;

    // Process payment and create invoice
    const handlePayment = async () => {
        if (cartItems.length === 0) {
            alert('السلة فارغة! الرجاء إضافة منتجات أولاً.');
            return;
        }

        // TODO: API call to create invoice
        const receipt = {
            number: `RCP-${Date.now()}`,
            date: new Date().toLocaleDateString('ar-EG'),
            time: new Date().toLocaleTimeString('ar-EG'),
            customer: customerName,
            items: cartItems,
            subtotal,
            vat,
            total,
            cashier: 'مندوب المبيعات' // From auth context
        };

        setLastReceipt(receipt);
        setSuccessMessage('تم إنشاء الفاتورة بنجاح! ✓');

        // Auto-print receipt
        setTimeout(() => {
            setIsPrintOpen(true);
        }, 500);

        // Reset form
        setTimeout(() => {
            setCartItems([]);
            setCustomerName('عميل نقدي');
            setSuccessMessage('');
        }, 2000);
    };

    // Handle barcode scanning (simulation)
    const handleScan = () => {
        // In real app, this would integrate with a barcode scanner
        // For now, just focus on search input
        alert('يمكنك استخدام حقل البحث للبحث بكود المنتج (SKU)');
    };

    if (!hasPermission(PERMISSIONS.INVOICES_CREATE)) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    ليس لديك صلاحية للوصول إلى نقطة البيع
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
            {/* Success Message */}
            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    onClose={() => setSuccessMessage('')}
                >
                    {successMessage}
                </Alert>
            )}

            <Grid container spacing={3} sx={{ height: '100%' }}>
                {/* Left Panel - Products */}
                <Grid item xs={12} md={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Search Bar */}
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            placeholder="ابحث عن منتج بالاسم أو الكود..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                bgcolor: 'background.paper',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<ScanIcon />}
                            onClick={handleScan}
                            sx={{ mt: 1 }}
                            size="small"
                        >
                            مسح الباركود
                        </Button>
                    </Box>

                    {/* Products Grid */}
                    <Box sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        pr: 1
                    }}>
                        <Grid container spacing={2}>
                            {filteredProducts.map((product) => (
                                <Grid item xs={6} sm={4} md={3} key={product.id}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            height: '100%',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4,
                                                borderColor: 'primary.main'
                                            },
                                            border: '2px solid',
                                            borderColor: 'divider'
                                        }}
                                        onClick={() => addToCart(product)}
                                    >
                                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="h2" sx={{ mb: 1 }}>
                                                {product.image}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    mb: 0.5,
                                                    minHeight: 40,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {product.name}
                                            </Typography>
                                            <Chip
                                                label={product.sku}
                                                size="small"
                                                sx={{ mb: 1, fontSize: '0.7rem' }}
                                            />
                                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                                {product.price.toLocaleString()} ج.م
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                متوفر: {product.stock}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {filteredProducts.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary">
                                    لا توجد منتجات مطابقة للبحث
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Right Panel - Cart & Checkout */}
                <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2
                        }}
                    >
                        {/* Cart Header */}
                        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Badge badgeContent={cartItems.length} color="error">
                                        <CartIcon />
                                    </Badge>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        السلة
                                    </Typography>
                                </Box>
                                {cartItems.length > 0 && (
                                    <Tooltip title="مسح السلة">
                                        <IconButton color="inherit" onClick={clearCart} size="small">
                                            <ClearIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>

                        {/* Customer Info */}
                        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="اسم العميل"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                sx={{ bgcolor: 'white' }}
                            />
                        </Box>

                        {/* Cart Items */}
                        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                            {cartItems.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <CartIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        السلة فارغة
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        اختر المنتجات من القائمة
                                    </Typography>
                                </Box>
                            ) : (
                                cartItems.map((item) => (
                                    <Paper
                                        key={item.id}
                                        variant="outlined"
                                        sx={{ p: 1.5, mb: 1.5 }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                            <Avatar sx={{ bgcolor: 'primary.light', fontSize: '1.2rem' }}>
                                                {item.image}
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} noWrap>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {item.price.toLocaleString()} ج.م
                                                </Typography>

                                                {/* Quantity Controls */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        disabled={item.quantity <= 1}
                                                        sx={{ bgcolor: 'grey.100' }}
                                                    >
                                                        <RemoveIcon fontSize="small" />
                                                    </IconButton>

                                                    <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                                                        {item.quantity}
                                                    </Typography>

                                                    <IconButton
                                                        size="small"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        disabled={item.quantity >= item.stock}
                                                        sx={{ bgcolor: 'grey.100' }}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>

                                                    <Box sx={{ flexGrow: 1 }} />

                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                {(item.price * item.quantity).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                ))
                            )}
                        </Box>

                        <Divider />

                        {/* Totals */}
                        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">المجموع الفرعي:</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {subtotal.toLocaleString()} ج.م
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">ضريبة القيمة المضافة (14%):</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>الإجمالي:</Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                    {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
                                </Typography>
                            </Box>
                        </Box>

                        {/* Checkout Button */}
                        <Box sx={{ p: 2 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<PaymentIcon />}
                                onClick={handlePayment}
                                disabled={cartItems.length === 0}
                                sx={{
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    boxShadow: 3
                                }}
                            >
                                إتمام البيع وطباعة الفاتورة
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Receipt Print Dialog */}
            <ReceiptPreview
                open={isPrintOpen}
                onClose={() => setIsPrintOpen(false)}
                receipt={lastReceipt}
            />
        </Box>
    );
};

export default CashierView;
