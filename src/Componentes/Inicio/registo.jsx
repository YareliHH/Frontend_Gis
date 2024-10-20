import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Box, InputAdornment } from '@mui/material';
import { Person, Email, Phone, Lock, AccountBox } from '@mui/icons-material';
import axios from 'axios';
import CryptoJS from 'crypto-js';

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
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordSafe, setIsPasswordSafe] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/;
  const phoneRegex = /^[0-9]{10}$/;

  const checkPasswordSafety = async (password) => {
    setIsLoading(true);
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
      const prefix = hashedPassword.slice(0, 5);
      const suffix = hashedPassword.slice(5);

      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const hashes = response.data.split('\n').map(line => line.split(':')[0]);

      if (hashes.includes(suffix.toUpperCase())) {
        setPasswordError('Contraseña insegura: ha sido filtrada en brechas de datos.');
        setIsPasswordSafe(false);
      } else {
        setPasswordError('');
        setIsPasswordSafe(true);
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      setPasswordError('Error al verificar la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const evaluatePasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (isLongEnough && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
      setPasswordStrength('Fuerte');
    } else if (isLongEnough && (hasUpperCase || hasLowerCase) && (hasNumber || hasSpecialChar)) {
      setPasswordStrength('Moderada');
    } else {
      setPasswordStrength('Débil');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData({
      ...formData,
      [name]: trimmedValue,
    });

    if (name === 'password') {
      if (trimmedValue.length >= 8) {
        checkPasswordSafety(trimmedValue);
        evaluatePasswordStrength(trimmedValue);
      }
    }

    if (name === 'confirmPassword') {
      if (trimmedValue !== formData.password) {
        setPasswordMatchError('Las contraseñas no coinciden.');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError || passwordMatchError) {
      return;
    }

    try {
      const correoResponse = await axios.post('https://backendgislive.onrender.com/api/verificar-correo', { correo: formData.correo });
      if (correoResponse.data.exists) {
        setMensaje('El correo ya está registrado. Intenta con otro.');
        return;
      }
    } catch (error) {
      setMensaje('Error al verificar el correo.');
      return;
    }

    const hashedPassword = CryptoJS.SHA256(formData.password).toString();

    const registroData = {
      ...formData,
      password: hashedPassword,
    };

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/registro', registroData);
      setMensaje('Usuario registrado exitosamente');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMensaje('Error al registrar usuario');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          padding: 4, 
          backgroundColor: '#f9f9f9', 
          borderRadius: 2, 
          boxShadow: 3, 
          marginTop: 4, 
          marginBottom: 4 
        }}
      >
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
                label="Correo Electrónico"
                type="email"
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
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                required
                error={!!passwordError}
                helperText={passwordError}
              />
              <Typography variant="body2" color={passwordStrength === 'Débil' ? 'error' : passwordStrength === 'Moderada' ? 'warning' : 'success'} align="left" sx={{ marginTop: 1 }}>
                Fortaleza de la contraseña: {passwordStrength}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                required
                error={!!passwordMatchError}
                helperText={passwordMatchError}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth color="primary" disabled={isLoading || !isPasswordSafe}>
                Registrar
              </Button>
            </Grid>
          </Grid>
        </form>

        {mensaje && (
          <Typography variant="body1" color={mensaje.includes('Error') ? 'error' : 'primary'} align="center" sx={{ marginTop: 2 }}>
            {mensaje}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Registro;
