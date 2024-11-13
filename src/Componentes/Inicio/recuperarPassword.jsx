import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, IconButton } from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const navigate = useNavigate(); // Para la navegación

  // Manejar el cambio de correo electrónico
  const handleEmailChange = (e) => {
    setEmail(e.target.value.trim());
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Enviar una solicitud al backend para recuperar la contraseña
      await axios.post('https://backendgislive.onrender.com/api/recuperar-contrasena', { correo: email });
      
      // Si la solicitud es exitosa, redirigir al usuario a la página de verificación
      setSnackbar({ open: true, message: 'Se ha enviado un código de verificación a tu correo electrónico', severity: 'success' });
      setTimeout(() => {
        navigate('/verificar-codigo', { state: { email } }); // Pasar el email al nuevo componente
      }, 2000); // Redirigir después de 2 segundos
    } catch (error) {
      console.error('Error al recuperar la contraseña:', error);
      setSnackbar({ open: true, message: 'Error al enviar el enlace de recuperación. Verifica tu correo.', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el cierre del Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Manejar el clic en el botón de atrás
  const handleBack = () => {
    navigate(-1); // Regresar a la página anterior
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3, marginTop: 4 }}>
        {/* Botón de Atrás */}
        <IconButton onClick={handleBack} color="primary" sx={{ position: 'absolute', top: 20, left: 20 }}>
          <ArrowBack />
        </IconButton>

        <Typography variant="h4" align="center" gutterBottom>
          Recuperar Contraseña
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
          Ingresa tu correo electrónico y te enviaremos un código de verificación.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Correo electrónico"
            name="email"
            value={email}
            onChange={handleEmailChange}
            InputProps={{
              startAdornment: (
                <Email position="start" />
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
              {isLoading ? 'Enviando...' : 'Enviar código de recuperación'}
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
