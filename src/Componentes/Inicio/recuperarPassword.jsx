import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fondo from '../imagenes/FONDO.jpeg.jpeg';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [emailSent, setEmailSent] = useState(false); // Controla si el correo fue enviado
  const navigate = useNavigate(); // Para redirigir a la página de restablecimiento de contraseña

  // Validación del formato de correo electrónico
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Manejar cambio en el campo de correo
  const handleEmailChange = (e) => setEmail(e.target.value.trim());

  // Manejar cambio en el campo del token
  const handleTokenChange = (e) => setToken(e.target.value.trim());

  // Manejar envío del formulario para solicitar el correo de recuperación
  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setSnackbar({
        open: true,
        message: 'Por favor ingresa un correo electrónico válido.',
        severity: 'warning',
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      // Enviar la solicitud al backend
      const response = await axios.post('http://localhost:3001/api/recuperacion_contra', { correo: email });
      console.log("Respuesta del backend:", response.data);

      setSnackbar({
        open: true,
        message: 'Se ha enviado un correo con instrucciones para recuperar tu contraseña.',
        severity: 'success',
      });

      setEmailSent(true); // Cambia el estado para mostrar el campo del token
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 2000); // Cerrar el mensaje después de 2 segundos
    } catch (error) {
      console.error("Error en la solicitud al backend:", error);
      const errorMessage = error.response?.status === 404
        ? 'El correo no existe en nuestra base de datos. Verifica e inténtalo de nuevo.'
        : 'Error al enviar el correo de recuperación. Inténtalo más tarde.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar envío del token para verificación
  const handleSubmitToken = async (e) => {
    e.preventDefault();

    if (!token) {
      setSnackbar({
        open: true,
        message: 'Por favor, introduce el código que te fue enviado.',
        severity: 'warning',
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      // Enviar el token para verificar al backend
      const response = await axios.post('http://localhost:3001/api/verify-tokene', { correo: email, token });
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: 'Código verificado correctamente. Ahora puedes restablecer tu contraseña.',
          severity: 'success',
        });
        setTimeout(() => {
          navigate(`/resetear_contrasena?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
        }, 2000); // Redirigir a la página de restablecimiento después de 2 segundos
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
      setSnackbar({
        open: true,
        message: 'Código inválido o expirado. Inténtalo de nuevo.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar el snackbar
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box
          sx={{
            position: 'relative',
            minHeight: '100vh',
            backgroundImage: `url(${fondo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          padding: 4,
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          {emailSent ? 'Verificar Código' : 'Recuperar Contraseña'}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {emailSent
            ? 'Introduce el código que te enviamos por correo electrónico.'
            : 'Ingresa tu correo electrónico para recuperar tu contraseña.'}
        </Typography>

        <form onSubmit={emailSent ? handleSubmitToken : handleSubmitEmail}>
          {!emailSent ? (
            <TextField
              fullWidth
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <Email sx={{ color: 'primary.main', mr: 1 }} />
                ),
              }}
            />
          ) : (
            <TextField
              fullWidth
              label="Código de Verificación"
              type="text"
              value={token}
              onChange={handleTokenChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <Lock sx={{ color: 'primary.main', mr: 1 }} />
                ),
              }}
            />
          )}
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : emailSent ? 'Verificar Código' : 'Enviar correo de recuperación'}
            </Button>
          </Box>
        </form>
      </Box>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
};

export default RecuperarContrasena;
