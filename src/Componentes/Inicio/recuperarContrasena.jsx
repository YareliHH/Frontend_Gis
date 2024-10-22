import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, InputAdornment } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecuperarContrasena = () => {
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Control de pasos en el flujo de recuperación

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/;

  const handleChangeCorreo = (e) => {
    setCorreo(e.target.value);
  };

  const handleChangeCodigo = (e) => {
    setCodigo(e.target.value);
  };

  const handleChangeNuevaContrasena = (e) => {
    setNuevaContrasena(e.target.value);
  };

  const handleChangeConfirmarContrasena = (e) => {
    setConfirmarContrasena(e.target.value);
  };

  const handleSubmitCorreo = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(correo)) {
      setError('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/recuperar-contrasena', { correo });
      setSuccess('Se ha enviado un código de recuperación a su correo electrónico.');
      setStep(2); // Avanzar al siguiente paso
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      setError('Error al enviar el correo de recuperación. Inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCodigo = async (e) => {
    e.preventDefault();

    if (!codigo) {
      setError('Por favor, ingrese el código enviado a su correo.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/verificar-codigo', { correo, codigo });
      setSuccess('Código verificado correctamente. Ahora puede cambiar su contraseña.');
      setStep(3); // Avanzar al paso de cambiar contraseña
    } catch (error) {
      console.error('Error al verificar el código:', error);
      setError('El código ingresado no es válido.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitContrasena = async (e) => {
    e.preventDefault();

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/cambiar-contrasena', { correo, nuevaContrasena });
      setSuccess('Su contraseña ha sido cambiada exitosamente.');
      setStep(1); // Reiniciar flujo
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setError('Error al cambiar la contraseña. Inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setStep(step - 1); // Regresar al paso anterior
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3, marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Recuperar Contraseña
        </Typography>

        {step === 1 && (
          <form onSubmit={handleSubmitCorreo}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  value={correo}
                  onChange={handleChangeCorreo}
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
                  {loading ? 'Enviando...' : 'Enviar Código de Recuperación'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmitCodigo}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Código de Verificación"
                  value={codigo}
                  onChange={handleChangeCodigo}
                  required
                  error={!!error}
                  helperText={error}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                  {loading ? 'Verificando...' : 'Verificar Código'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmitContrasena}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nueva Contraseña"
                  type="password"
                  value={nuevaContrasena}
                  onChange={handleChangeNuevaContrasena}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                  required
                  error={!!error}
                  helperText={error}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirmar Nueva Contraseña"
                  type="password"
                  value={confirmarContrasena}
                  onChange={handleChangeConfirmarContrasena}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
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
                  {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {success && (
          <Typography variant="body1" color="success.main" align="center" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}

        {error && (
          <Typography variant="body1" color="error.main" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          {step > 1 && (
            <Button variant="contained" color="primary" onClick={handleBackClick}>
              Atrás
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default RecuperarContrasena;
