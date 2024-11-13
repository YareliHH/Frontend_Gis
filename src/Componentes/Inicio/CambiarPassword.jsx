import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import Notificaciones from '../Compartidos/Notificaciones';

const CambiarContrasena = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const checkPasswordRules = (password) => {
    const errors = [];
    if (!/[A-Z]/.test(password)) errors.push('Debe tener al menos una letra mayúscula.');
    if (!/\d/.test(password)) errors.push('Debe tener al menos un número.');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Debe tener al menos un símbolo especial.');
    if (password.length < 8) errors.push('Debe tener al menos 8 caracteres.');
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'newPassword') {
      const passwordErrors = checkPasswordRules(value);
      setErrors({
        ...errors,
        newPassword: passwordErrors.length > 0 ? passwordErrors.join(' ') : '',
      });
    }

    if (name === 'confirmNewPassword') {
      setErrors({
        ...errors,
        confirmNewPassword: value !== formData.newPassword ? 'Las contraseñas no coinciden.' : '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.newPassword || errors.confirmNewPassword) {
      setSnackbarMessage('Corrige los errores antes de enviar.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('https://backendgislive.onrender.com/api/cambiar-contrasena', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      setSnackbarMessage('Contraseña cambiada exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setErrors({});
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setSnackbarMessage('Error al cambiar la contraseña.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3, marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Cambiar Contraseña
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Contraseña Actual"
            name="oldPassword"
            type={showOldPassword ? 'text' : 'password'}
            value={formData.oldPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Nueva Contraseña"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Confirmar Nueva Contraseña"
            name="confirmNewPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmNewPassword}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword}
            sx={{ mt: 2 }}
          />
          <Box mt={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading || !!errors.newPassword || !!errors.confirmNewPassword}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </Button>
          </Box>
        </form>

        <Notificaciones
          open={snackbarOpen}
          message={snackbarMessage}
          type={snackbarSeverity}
          handleClose={handleSnackbarClose}
        />
      </Box>
    </Container>
  );
};

export default CambiarContrasena;
