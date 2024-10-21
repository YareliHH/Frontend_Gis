import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import axios from 'axios';

const RecuperarContrasena = () => {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook para manejar la navegación

  const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/;

  const handleChange = (e) => {
    setCorreo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de correo electrónico
    if (!emailRegex.test(correo)) {
      setError('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Llamada a la API para recuperación de contraseña
      const response = await axios.post('https://backendgislive.onrender.com/api/recuperar-contrasena', { correo });
      setSuccess('Se ha enviado un correo de recuperación. Por favor, revise su bandeja de entrada.');
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      setError('Error al enviar el correo de recuperación. Inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Navega a la página anterior
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3, marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Recuperar Contraseña
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                type="email"
                value={correo}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                required
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Correo de Recuperación'}
              </Button>
            </Grid>
            {success && (
              <Grid item xs={12}>
                <Typography variant="body1" color="success.main" align="center">
                  {success}
                </Typography>
              </Grid>
            )}
            {error && (
              <Grid item xs={12}>
                <Typography variant="body1" color="error.main" align="center">
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>

        {/* Botón de "Atrás" */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleBackClick}
          >
            Atrás
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RecuperarContrasena;
