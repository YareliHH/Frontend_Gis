import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, IconButton, CircularProgress } from '@mui/material';
import { Lock, ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import CryptoJS from 'crypto-js';
import { FaCheckCircle } from 'react-icons/fa';
import Notificaciones from '../Compartidos/Notificaciones'; // Importar componente de notificaciones

const CambiarContrasena = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isPasswordSafe, setIsPasswordSafe] = useState(true);
    const [isPasswordFiltered, setIsPasswordFiltered] = useState(false);
    const [passwordRulesErrors, setPasswordRulesErrors] = useState([]);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token'); // Token de recuperación de contraseña

    // Función para manejar el cambio de contraseña y validar seguridad
    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === 'newPassword') {
            setNewPassword(value);
            const strength = zxcvbn(value).score;
            setPasswordStrength(strength);
            await checkPasswordSafety(value);
            setPasswordRulesErrors(checkPasswordRules(value));
        } else {
            setConfirmPassword(value);
        }
    };

    const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    // Validación de reglas de contraseña
    const checkPasswordRules = (password) => {
        const errors = [];
        if (!/[A-Z]/.test(password)) errors.push('Al menos 1 mayúscula.');
        if (!/\d/.test(password)) errors.push('Al menos 1 número.');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Al menos 1 símbolo especial.');
        if (password.length < 8) errors.push('Más de 8 caracteres.');
        if (/(.)\1{2}/.test(password)) errors.push('No más de 3 letras seguidas.');
        return errors;
    };

    // Validación de seguridad de la contraseña
    const checkPasswordSafety = async (password) => {
        setIsLoading(true);
        try {
            const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
            const prefix = hashedPassword.slice(0, 5);
            const suffix = hashedPassword.slice(5);

            const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
            const hashes = response.data.split('\n').map(line => line.split(':')[0]);

            if (hashes.includes(suffix.toUpperCase())) {
                setPasswordError('Contraseña insegura: filtrada.');
                setIsPasswordSafe(false);
                setIsPasswordFiltered(true);
            } else {
                setPasswordError('');
                setIsPasswordSafe(true);
                setIsPasswordFiltered(false);
            }
        } catch (error) {
            console.error('Error al verificar la contraseña:', error);
            setPasswordError('Error al verificar la contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    // Manejo del submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setNotificationMessage('El token es inválido o ha expirado.');
            setNotificationType('error');
            setOpenNotification(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setNotificationMessage('Las contraseñas no coinciden.');
            setNotificationType('error');
            setOpenNotification(true);
            return;
        }

        if (passwordRulesErrors.length > 0 || passwordStrength < 3 || !isPasswordSafe) {
            setNotificationMessage('Asegúrate de que la contraseña cumple con los requisitos de seguridad.');
            setNotificationType('error');
            setOpenNotification(true);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post('https://backendgislive.onrender.com/api/resetPassword', { token, newPassword });
            if (response.status === 200) {
                setNotificationMessage('Contraseña actualizada correctamente.');
                setNotificationType('success');
                setOpenNotification(true);

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setNotificationMessage('Error al cambiar la contraseña. Inténtalo de nuevo.');
            setNotificationType('error');
            setOpenNotification(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseNotification = () => setOpenNotification(false);

    return (
        <Box
            sx={{
                backgroundColor: '#FFFFFF',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                position: 'relative'
            }}
        >
            <IconButton
                sx={{ position: 'absolute', top: 16, left: 16, color: '#00bcd4' }}
                component={Link}
                to="/login"
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowBack />
                    <Typography variant="body2" sx={{ color: '#707070', opacity: 0.7, ml: 1 }}>
                        Atrás
                    </Typography>
                </Box>
            </IconButton>

            <Card sx={{ maxWidth: 400, width: '100%', borderRadius: '15px', boxShadow: 3 }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Cambiar Contraseña
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Nueva Contraseña"
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={newPassword}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <Lock sx={{ mr: 1 }} />,
                                    endAdornment: (
                                        <IconButton onClick={toggleShowNewPassword}>
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Confirmar Contraseña"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <Lock sx={{ mr: 1 }} />,
                                    endAdornment: (
                                        <IconButton onClick={toggleShowConfirmPassword}>
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">Fortaleza de la contraseña</Typography>
                            <Box
                                sx={{
                                    height: '10px',
                                    width: '100%',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '5px',
                                    mt: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: `${(passwordStrength / 4) * 100}%`,
                                        backgroundColor: passwordStrength < 2 ? 'red' : passwordStrength === 2 ? 'yellow' : 'green',
                                        borderRadius: '5px',
                                    }}
                                />
                            </Box>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, width: '100%' }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Cambiar Contraseña'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Notificaciones
                open={openNotification}
                message={notificationMessage}
                type={notificationType}
                handleClose={handleCloseNotification}
            />
        </Box>
    );
};

export default CambiarContrasena;
