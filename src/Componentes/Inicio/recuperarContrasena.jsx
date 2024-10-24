import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Box, Button, Card, Container, Grid, TextField, Typography } from '@mui/material';
import logo from '../imagenes/LogoGL.png';

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [csrfToken, setCsrfToken] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('https://backendgislive.onrender.com/api/csrf-token', {
                    credentials: 'include',
                });
                const data = await response.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error('Error obteniendo el token CSRF:', error);
            }
        };
        fetchCsrfToken();
    }, []);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://backendgislive.onrender.com/api/recuperar-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ email: correo }),
                credentials: 'include',
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se ha enviado un correo para restablecer tu contraseña.',
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                });
                setStep(2);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Algo salió mal.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error enviando correo:', error);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://backendgislive.onrender.com/api/cambiar-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ email: correo, nuevaContrasena: password }),
                credentials: 'include',
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Tu contraseña se ha restablecido.',
                    icon: 'success',
                    confirmButtonText: 'Genial',
                });
                navigate('/login');
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error restableciendo la contraseña:', error);
        }
    };

    return (
        <Container>
            <Grid container justifyContent="center" style={{ minHeight: '100vh' }}>
                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Card elevation={3} sx={{ padding: 3, borderRadius: '1rem', border: '1px solid #ccc' }}>
                        <Box textAlign="center" mb={3}>
                            <img src={logo} alt="Gislive Boutique Clínica" style={{ width: 80, height: 60, marginRight: 16 }} />
                        </Box>

                        {step === 1 && (
                            <form onSubmit={handleForgotPassword}>
                                <Typography variant="h6" textAlign="center" mb={2}>
                                    Proporciona tu correo para recuperar tu contraseña.
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Correo electrónico"
                                    variant="outlined"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    required
                                    sx={{ mb: 3 }}
                                />
                                <Button fullWidth variant="contained" color="primary" type="submit">
                                    Enviar token de recuperación
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleResetPassword}>
                                <Typography variant="h6" textAlign="center" mb={2}>
                                    Ingresa tu nueva contraseña.
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Nueva contraseña"
                                    variant="outlined"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    fullWidth
                                    label="Confirmar contraseña"
                                    variant="outlined"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <Button fullWidth variant="contained" color="primary" type="submit">
                                    Restablecer contraseña
                                </Button>
                            </form>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};
