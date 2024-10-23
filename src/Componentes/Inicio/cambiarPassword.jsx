import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Paper,
} from '@mui/material';

const MySwal = withReactContent(Swal);

function CambiarPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.',
      });
      return;
    }

    try {
      // Enviar nueva contraseña al backend
      const response = await axios.post('https://backendgislive.onrender.com/api/cambio/reset-password', {
        email,
        newPassword,
      });

      if (response.data.success) {
        MySwal.fire({
          icon: 'success',
          title: 'Contraseña cambiada',
          text: 'Tu contraseña ha sido actualizada correctamente.',
        });

        // Redirigir al inicio de sesión
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error); // Agregar consola para debugear
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al cambiar la contraseña. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#e0f7fa' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#004d40' }}>
          Cambiar Contraseña
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Nueva contraseña"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Confirmar nueva contraseña"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            variant="outlined"
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, backgroundColor: '#00796b', '&:hover': { backgroundColor: '#004d40' } }}
          >
            Cambiar Contraseña
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CambiarPassword;
