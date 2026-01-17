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
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import useAuthStore from '../../stores/useAuthStore';

// Validation Schema
const schema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),
}).required();

const LoginView = () => {
    const navigate = useNavigate();
    const setLogin = useAuthStore((state) => state.login);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    // React Query Mutation
    const mutation = useMutation({
        mutationFn: ({ email, password }) => authService.login(email, password),
        onSuccess: (data) => {
            // Assuming API returns { token: '...', user: { ... } }
            // Adjust based on actual API response structure
            // The guide says response is { token: "..." }
            // We might need to fetch user separately or API returns it.
            // Let's assume we get token, then we might need to fetch user.

            const token = data.token;
            // For now, let's just set the token. We should probably fetch user details next.
            // But to keep it simple for this step:
            setLogin({ email: 'user@example.com' }, token); // Placeholder user until we fetch real one
            navigate('/');
        },
        onError: (error) => {
            console.error('Login failed', error);
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

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
                <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        تسجيل الدخول
                    </Typography>

                    {mutation.isError && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            فشل تسجيل الدخول. يرجى التحقق من البيانات.
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
                            error={!!errors.email}
                            helperText={errors.email?.message}
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
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'جاري الدخول...' : 'دخول'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginView;
