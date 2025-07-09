import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, IconButton, CircularProgress } from '@mui/material';
import { Lock, ArrowBack, Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import CryptoJS from 'crypto-js';
import Notificaciones from '../Compartidos/Notificaciones'; 

// Componente para cambiar contraseña
const CambiarContrasena = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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

    // Obtener token y email de la URL
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    // Verificar token al cargar el componente
    useEffect(() => {
        if (!token || !email) {
            setErrorMessage('Parámetros inválidos. Por favor, solicita un nuevo enlace de recuperación.');
            return;
        }

        // Verificar validez del token
        const verifyToken = async () => {
            try {
                await axios.post('https://backend-gis-1.onrender.com/api/verify-tokene', { 
                    correo: email, 
                    token: token 
                });
            } catch (error) {
                console.error('Error al verificar token:', error);
                setErrorMessage('El token es inválido o ha expirado. Por favor, solicita un nuevo enlace de recuperación.');
                setTimeout(() => {
                    navigate('/recuperar_contrasena');
                }, 3000);
            }
        };

        verifyToken();
    }, [token, email, navigate]);

    // Manejar cambios en los campos de contraseña
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
        if (!password || password.length < 4) {
            setPasswordError('');
            setIsPasswordSafe(false);
            return;
        }
        
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
            // Si falla la API externa, permitimos continuar
            setPasswordError('');
            setIsPasswordSafe(true);
            setIsPasswordFiltered(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Manejo del submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!token || !email) {
            setErrorMessage('El token y email son inválidos o han expirado.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        if (passwordRulesErrors.length > 0) {
            setErrorMessage('Errores: ' + passwordRulesErrors.join(', '));
            return;
        }

        if (passwordStrength < 3) {
            setErrorMessage('La contraseña debe ser fuerte o muy fuerte para ser cambiada.');
            return;
        }

        try {
            setIsLoading(true);
            // Incluir correo y token en la solicitud
            const response = await axios.post('https://backend-gis-1.onrender.com/api/resetPassword', { 
                token, 
                newPassword,
                correo: email  // Agregar el correo para mayor seguridad
            });
            
            if (response.status === 200) {
                setNotificationMessage('Contraseña actualizada correctamente.');
                setNotificationType('success');
                setOpenNotification(true);

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            
            // Mensaje más detallado según el error
            const errorMsg = error.response?.data?.message || 'Error al cambiar la contraseña. Inténtalo de nuevo.';
            
            setNotificationMessage(errorMsg);
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

                    {errorMessage && (
                        <Typography variant="body2" sx={{ color: 'error.main', mb: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}

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
                                disabled={!!errorMessage && errorMessage.includes('token')}
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

                        {passwordRulesErrors.length > 0 && (
                            <Typography variant="body2" sx={{ color: 'red', fontSize: '0.8rem', mb: 2 }}>
                                Errores: {passwordRulesErrors.join(', ')}
                            </Typography>
                        )}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Confirmar Contraseña"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={!!errorMessage && errorMessage.includes('token')}
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

                        {passwordError && <Typography variant="body2" sx={{ color: 'red', fontSize: '0.8rem', mb: 1 }}>{passwordError}</Typography>}
                        {isPasswordFiltered && <Typography variant="body2" sx={{ color: 'red', fontSize: '0.8rem', mb: 1 }}>Contraseña filtrada. Elige otra.</Typography>}
                        {isPasswordSafe && !isPasswordFiltered && newPassword && (
                            <Typography variant="body2" sx={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                                <CheckCircle sx={{ color: 'green', mr: 1 }} /> Contraseña segura
                            </Typography>
                        )}

                        {/* Barra de fortaleza de la contraseña */}
                        <Box sx={{ mt: 2, mb: 3, position: 'relative' }}>
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
                                        backgroundColor:
                                            passwordStrength < 2
                                                ? 'red'
                                                : passwordStrength === 2
                                                    ? 'yellow'
                                                    : 'green',
                                        borderRadius: '5px',
                                        transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out',
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                                {['Muy débil', 'Débil', 'Moderada', 'Fuerte', 'Muy fuerte'][passwordStrength]}
                            </Typography>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, width: '100%' }}
                            disabled={isLoading || (!!errorMessage && errorMessage.includes('token'))}
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