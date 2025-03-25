import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, CircularProgress, IconButton } from '@mui/material';
import { Email, Lock, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Componente para la recuperación de contraseña
const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  // Validación básica de formato de email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => setEmail(e.target.value.trim());
  const handleTokenChange = (e) => setToken(e.target.value.trim());
  const handleGoBack = () => navigate(-1);

  // Envío de solicitud de recuperación de contraseña
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
      const response = await axios.post('http://localhost:3001/api/recuperacion_contra', { correo: email });
      console.log("Respuesta del backend:", response.data);

      setSnackbar({
        open: true,
        message: 'Se ha enviado un correo con instrucciones para recuperar tu contraseña.',
        severity: 'success',
      });

      setEmailSent(true);
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

  // Verificación del token
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

    if (!email) {
      setSnackbar({
        open: true,
        message: 'Correo electrónico no disponible. Por favor, inténtalo de nuevo.',
        severity: 'error',
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      // El endpoint es correcto, no hay necesidad de cambiarlo
      const response = await axios.post('http://localhost:3001/api/verify-tokene', {
        correo: email,
        token: token.trim() // Asegura que no haya espacios
      });

      // Debug logs
      console.log("Status code:", response.status);

      // Acciones tras respuesta exitosa (no es necesario verificar response.status === 200)
      // ya que axios solo entra en este bloque si la respuesta fue exitosa (2xx)
      setSnackbar({
        open: true,
        message: 'Código verificado correctamente. Redirigiendo...',
        severity: 'success',
      });


      setTimeout(() => {
        console.log("Ejecutando navegación ahora");
        navigate(`/resetear_contrasena?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
      }, 1500);

    } catch (error) {
      console.error("Error al verificar el token:", error);


      // Mostrar mensaje más detallado según la respuesta del servidor
      const errorMessage = error.response?.data?.message ||
        'Código inválido o expirado. Inténtalo de nuevo.';

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        py: { xs: 4, sm: 0 }, // Padding vertical en móviles
      }}
    >
      {/* Botón de retroceso */}
      <IconButton 
        onClick={handleGoBack}
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#1976d2',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.05)',
          },
          zIndex: 10,
        }}
        aria-label="volver atrás"
      >
        <ArrowBack />
      </IconButton>

      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3 }, // Padding horizontal responsivo
          minHeight: { xs: 'auto', sm: '100vh' },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '450px',
            padding: { xs: 3, sm: 5 },
            background: 'rgba(255, 255, 255, 0.95)', // Fondo blanco con ligera transparencia
            borderRadius: 3,
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            position: 'relative',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)', // Efecto de elevación al pasar el mouse
            },
            mt: { xs: 6, sm: 0 }, // Margen superior para dispositivos móviles
          }}
        >
          {/* Icono decorativo en la parte superior */}
          <Box
            sx={{
              position: 'absolute',
              top: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: '#1976d2',
              borderRadius: '50%',
              p: 2,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            }}
          >
            {emailSent ? (
              <Lock sx={{ color: 'white', fontSize: { xs: 32, sm: 40 } }} />
            ) : (
              <Email sx={{ color: 'white', fontSize: { xs: 32, sm: 40 } }} />
            )}
          </Box>

          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#333',
              mt: 4,
              fontSize: { xs: '1.5rem', sm: '2rem' }, // Tamaño de fuente responsivo
              fontFamily: '"Roboto", sans-serif',
              letterSpacing: '0.5px',
            }}
          >
            {emailSent ? 'Verificar Código' : 'Recuperar Contraseña'}
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            gutterBottom
            sx={{
              mb: 4,
              fontSize: { xs: '0.875rem', sm: '1rem' }, // Tamaño de fuente responsivo
              color: '#666',
              fontStyle: 'italic',
              px: { xs: 1, sm: 2 }, // Padding horizontal para texto en móviles
            }}
          >
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
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Email sx={{ color: 'primary.main', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: '#f9f9f9',
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666',
                    fontWeight: 500,
                    '&.Mui-focused': {
                      color: '#1976d2',
                    },
                  },
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
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Lock sx={{ color: 'primary.main', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: '#f9f9f9',
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#666',
                    fontWeight: 500,
                    '&.Mui-focused': {
                      color: '#1976d2',
                    },
                  },
                }}
              />
            )}
            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  padding: { xs: '10px', sm: '12px' },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                  boxShadow: '0 5px 15px rgba(25, 118, 210, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1565c0 0%, #2196f3 100%)',
                    boxShadow: '0 8px 20px rgba(25, 118, 210, 0.5)',
                    transform: { xs: 'none', sm: 'translateY(-2px)' }, // Solo aplica efecto hover en dispositivos no móviles
                  },
                  '&:disabled': {
                    background: '#cccccc',
                    boxShadow: 'none',
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : emailSent ? 'Verificar Código' : 'Enviar correo de recuperación'}
              </Button>
            </Box>
          </form>
        </Box>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Mejor posición en móviles
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default RecuperarContrasena;