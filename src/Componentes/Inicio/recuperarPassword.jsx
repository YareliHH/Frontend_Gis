import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Email, ArrowBack, Lock } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  // Manejar el cambio de correo electrónico
  const handleEmailChange = (e) => setEmail(e.target.value.trim());

  // Manejar el cambio de código de verificación
  const handleTokenChange = (e) => setToken(e.target.value.trim());

  // Enviar correo de recuperación
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !email) return;

    setIsLoading(true);
    try {
      await axios.post('https://backendgislive.onrender.com/api/recuperacion', { correo: email });
      setSnackbar({
        open: true,
        message: 'Se ha enviado un código de verificación a tu correo electrónico.',
        severity: 'success'
      });
      setEmailSent(true); // Cambiar el estado para pedir el código
    } catch (error) {
      const errorMessage =
        error.response?.status === 404
          ? 'Correo no encontrado. Verifica el correo ingresado.'
          : 'Error al enviar el enlace de recuperación. Inténtalo más tarde.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar el código de recuperación
  const handleVerifyToken = async (e) => {
    e.preventDefault();
    if (isLoading || !token) return;

    setIsLoading(true);
    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/verifyToken', { token, correo: email });
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: 'Código verificado correctamente. Ahora puedes restablecer tu contraseña.',
          severity: 'success'
        });
        navigate(`/reset-contrasena?token=${encodeURIComponent(token)}`); // Redirigir a la página de restablecimiento
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Código inválido o expirado. Inténtalo de nuevo.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar el snackbar
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Manejar el botón de atrás
  const handleBack = () => navigate(-1);

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3, marginTop: 4, position: 'relative' }}>
        {/* Botón de Atrás */}
        <IconButton onClick={handleBack} color="primary" sx={{ position: 'absolute', top: 20, left: 20 }}>
          <ArrowBack />
        </IconButton>

        <Typography variant="h4" align="center" gutterBottom>
          {emailSent ? 'Verificar Código' : 'Recuperar Contraseña'}
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
          {emailSent
            ? 'Introduce el código que te enviamos por correo electrónico.'
            : 'Ingresa tu correo electrónico y te enviaremos un código de verificación.'}
        </Typography>

        {/* Formulario para enviar el correo o verificar el código */}
        <form onSubmit={emailSent ? handleVerifyToken : handleSubmit}>
          <TextField
            fullWidth
            label={emailSent ? 'Código de Verificación' : 'Correo Electrónico'}
            name={emailSent ? 'token' : 'email'}
            value={emailSent ? token : email}
            onChange={emailSent ? handleTokenChange : handleEmailChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {emailSent ? <Lock /> : <Email />}
                </InputAdornment>
              ),
            }}
            required
            margin="normal"
          />
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : emailSent ? 'Verificar Código' : 'Enviar código de recuperación'}
            </Button>
          </Box>
        </form>
      </Box>

      {/* Componente Snackbar para mostrar mensajes */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecuperarContrasena;
