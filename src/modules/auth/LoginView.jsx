import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

// Validation Schema
const schema = yup.object({
    email: yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    password: yup.string().required('كلمة المرور مطلوبة'),
}).required();

const LoginView = () => {
    const { login, isLoggingIn, loginError } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        login(data);
    };

    // Extract API validation errors if any (422)
    const apiErrors = loginError?.response?.data?.errors;

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            mb: 3,
                            fontWeight: 'bold',
                            color: 'primary.main'
                        }}
                    >
                        تسجيل الدخول
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        نظام المحاسبة السحابي المتكامل
                    </Typography>

                    {loginError && !apiErrors && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {loginError.response?.data?.message || 'فشل تسجيل الدخول. يرجى التحقق من الاتصال.'}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="البريد الإلكتروني"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            {...register('email')}
                            error={!!errors.email || !!apiErrors?.email}
                            helperText={errors.email?.message || apiErrors?.email?.[0]}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="كلمة المرور"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            {...register('password')}
                            error={!!errors.password || !!apiErrors?.password}
                            helperText={errors.password?.message || apiErrors?.password?.[0]}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 1,
                                mb: 2,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: 2
                            }}
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'دخول'
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginView;

