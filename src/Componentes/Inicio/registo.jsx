import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Box, InputAdornment } from '@mui/material';
import { Person, Email, Phone, Lock, AccountBox } from '@mui/icons-material';
import axios from 'axios';
import bcrypt from 'bcryptjs';

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

  const [mensaje, setMensaje] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const evaluatePasswordStrength = (password) => {
    let strength = '';
    const lengthCriteria = password.length >= 8;
    const upperCaseCriteria = /[A-Z]/.test(password);
    const lowerCaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /\d/.test(password);
    
    const criteriaMet = [lengthCriteria, upperCaseCriteria, lowerCaseCriteria, numberCriteria].filter(Boolean).length;

    switch (criteriaMet) {
      case 1:
        strength = 'Muy débil';
        break;
      case 2:
        strength = 'Débil';
        break;
      case 3:
        strength = 'Fuerte';
        break;
      case 4:
        strength = 'Muy fuerte';
        break;
      default:
        strength = '';
    }

    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'password') {
      if (!validatePassword(e.target.value)) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
      } else {
        setPasswordError('');
        evaluatePasswordStrength(e.target.value);
      }
    }

    if (e.target.name === 'confirmPassword') {
      if (e.target.value !== formData.password) {
        setPasswordMatchError('Las contraseñas no coinciden.');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setPasswordError('La contraseña no cumple con los requisitos.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError('Las contraseñas no coinciden.');
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

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(formData.password, salt);

    const registroData = {
      ...formData,
      password: hashedPassword,
    };

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/registro', registroData);
      setMensaje('Usuario registrado exitosamente');
      console.log(response.data);
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
              <Typography variant="body2" color={passwordStrength === 'Muy débil' ? 'error' : passwordStrength === 'Débil' ? 'warning' : passwordStrength === 'Fuerte' ? 'primary' : 'success'} align="left" sx={{ marginTop: 1 }}>
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
              <Button type="submit" variant="contained" fullWidth color="primary">
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
