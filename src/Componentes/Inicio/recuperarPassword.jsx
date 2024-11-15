import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Email } from '@mui/icons-material';
import axios from 'axios';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Función para validar el formato de correo electrónico
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Manejar cambio en el campo de correo
  const handleEmailChange = (e) => setEmail(e.target.value.trim());

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el correo esté en un formato correcto
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
    console.log("Enviando solicitud de recuperación de contraseña para el correo:", email);

    try {
      // Realizar la solicitud al backend
      const response = await axios.post('https://backendgislive.onrender.com/api/recuperacion_contra', { correo: email });
      console.log("Respuesta del backend:", response.data);

      setSnackbar({
        open: true,
        message: 'Se ha enviado un correo con instrucciones para recuperar tu contraseña.',
        severity: 'success',
      });
    } catch (error) {
      console.error("Error en la solicitud al backend:", error);

      const errorMessage =
        error.response?.status === 404
          ? 'El correo no existe en nuestra base de datos. Verifica e inténtalo de nuevo.'
          : 'Error al enviar el correo de recuperación. Inténtalo más tarde.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar el snackbar
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
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
          Recuperar Contraseña
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Ingresa tu correo electrónico para recuperar tu contraseña.
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Enviar correo de recuperación'}
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
  );
};

export default RecuperarContrasena;
