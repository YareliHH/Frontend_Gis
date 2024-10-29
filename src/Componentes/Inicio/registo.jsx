import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Box, InputAdornment, CircularProgress, IconButton } from '@mui/material';
import { Person, Email, Phone, Lock, AccountBox, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notificaciones from '../Compartidos/Notificaciones'; // Importar el componente Notificaciones

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de carga para el botón
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' o 'error'

  const navigate = useNavigate();

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/;
  const phoneRegex = /^[0-9]{10}$/;

  const checkPasswordRules = (password) => {
    const errors = [];
    let strength = 0;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const noRepeatingChars = !/(.)\1{2}/.test(password);

    if (!hasUpperCase) errors.push('Debe tener al menos una letra mayúscula.');
    if (!hasNumber) errors.push('Debe tener al menos un número.');
    if (!hasSpecialChar) errors.push('Debe tener al menos un símbolo especial.');
    if (!hasMinLength) errors.push('Debe tener más de 8 caracteres.');
    if (!noRepeatingChars) errors.push('No puede tener más de 3 letras seguidas iguales.');

    if (hasUpperCase) strength += 20;
    if (hasNumber) strength += 20;
    if (hasSpecialChar) strength += 20;
    if (hasMinLength) strength += 20;
    if (noRepeatingChars) strength += 20;

    setPasswordStrength(strength);
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData({
      ...formData,
      [name]: trimmedValue,
    });

    const newErrors = { ...errors };

    if (name === 'nombre' && !nameRegex.test(trimmedValue)) {
      newErrors.nombre = 'El nombre debe contener solo letras.';
    } else {
      delete newErrors.nombre;
    }

    if (name === 'apellidoPaterno' && !nameRegex.test(trimmedValue)) {
      newErrors.apellidoPaterno = 'El apellido paterno debe contener solo letras.';
    } else {
      delete newErrors.apellidoPaterno;
    }

    if (name === 'apellidoMaterno' && !nameRegex.test(trimmedValue)) {
      newErrors.apellidoMaterno = 'El apellido materno debe contener solo letras.';
    } else {
      delete newErrors.apellidoMaterno;
    }

    if (name === 'correo' && !emailRegex.test(trimmedValue)) {
      newErrors.correo = 'El correo electrónico no es válido.';
    } else {
      delete newErrors.correo;
    }

    if (name === 'telefono' && !phoneRegex.test(trimmedValue)) {
      newErrors.telefono = 'El teléfono debe contener 10 dígitos numéricos.';
    } else {
      delete newErrors.telefono;
    }

    if (name === 'password') {
      const passwordErrors = checkPasswordRules(trimmedValue);
      setPasswordError(passwordErrors.length > 0 ? passwordErrors.join(' ') : '');
    }

    if (name === 'confirmPassword') {
      setPasswordMatchError(trimmedValue !== formData.password ? 'Las contraseñas no coinciden.' : '');
    }

    setErrors(newErrors);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si hay errores, detener el registro
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true); // Activar carga en el botón

    try {
      const correoResponse = await axios.post('https://backendgislive.onrender.com/api/verificar-correo', { correo: formData.correo });
      if (correoResponse.data.exists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          correo: 'El correo ya está registrado. Intenta con otro.',
        }));
        setIsLoading(false); // Desactivar carga si el correo ya existe
        return;
      }
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        correo: 'Error al verificar el correo.',
      }));
      setIsLoading(false); // Desactivar carga en caso de error
      return;
    }

    const registroData = { ...formData };

    try {
      await axios.post('https://backendgislive.onrender.com/api/registro', registroData);
      setSnackbarMessage('Usuario registrado exitosamente');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate('/login'); // Redirigir a /login después de registro exitoso
      }, 2000); // Tiempo para mostrar notificación antes de redirigir

      setErrors({});
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setSnackbarMessage('Error al registrar usuario');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false); // Desactivar carga después de proceso de registro
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3, marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Registro de Usuario
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                required
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Apellido Paterno"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBox />
                    </InputAdornment>
                  ),
                }}
                required
                error={!!errors.apellidoPaterno}
                helperText={errors.apellidoPaterno}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Apellido Materno"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBox />
                    </InputAdornment>
                  ),
                }}
                required
                error={!!errors.apellidoMaterno}
                helperText={errors.apellidoMaterno}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo electrónico"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                required
                error={!!errors.correo}
                helperText={errors.correo}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                required
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
                error={!!passwordError}
                helperText={passwordError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
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
                error={!!passwordMatchError}
                helperText={passwordMatchError}
              />
            </Grid>
          </Grid>
          <Box mt={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading || passwordMatchError !== ''}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? 'Registrando...' : 'Registrar'}
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

export default Registro;
