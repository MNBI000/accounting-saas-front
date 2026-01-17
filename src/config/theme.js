import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
    direction: 'rtl',
    typography: {
        fontFamily: 'Cairo, sans-serif',
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

export default theme;
