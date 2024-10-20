import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Box, InputAdornment } from '@mui/material';
import { Person, Email, Phone, Lock, AccountBox } from '@mui/icons-material';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useHistory } from 'react-router-dom'; // Importar useHistory

const Registro = () => {
  const history = useHistory(); // Inicializar useHistory
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
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [isPasswordSafe, setIsPasswordSafe] = useState(false);
  const [isPasswordFiltered, setIsPasswordFiltered] = useState(false);

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // validar nombres
  const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/; // validar correos electrónicos
  const phoneRegex = /^[0-9]{10}$/; // validar teléfonos

  // Verificar reglas de la contraseña
  const checkPasswordRules = (password) => {
    const errors = [];
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

    return errors;
  };

  // Verificar si la contraseña ha sido filtrada
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
        setIsPasswordFiltered(true);
      } else {
        setPasswordError('');
        setIsPasswordSafe(true);
        setIsPasswordFiltered(false);
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      setPasswordError('Error al verificar la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData({
      ...formData,
      [name]: trimmedValue,
    });

    // Validaciones en tiempo real
    const newErrors = { ...errors }; // Copia de los errores actuales

    // Validación del nombre
    if (name === 'nombre' && !nameRegex.test(trimmedValue)) {
      newErrors.nombre = 'El nombre debe contener solo letras.';
    } else {
      delete newErrors.nombre;
    }

    // Validación del apellido paterno
    if (name === 'apellidoPaterno' && !nameRegex.test(trimmedValue)) {
      newErrors.apellidoPaterno = 'El apellido paterno debe contener solo letras.';
    } else {
      delete newErrors.apellidoPaterno;
    }

    // Validación del apellido materno
    if (name === 'apellidoMaterno' && !nameRegex.test(trimmedValue)) {
      newErrors.apellidoMaterno = 'El apellido materno debe contener solo letras.';
    } else {
      delete newErrors.apellidoMaterno;
    }

    // Validación del correo
    if (name === 'correo' && !emailRegex.test(trimmedValue)) {
      newErrors.correo = 'El correo electrónico es válido.';
    } else {
      delete newErrors.correo;
    }

    // Validación del teléfono
    if (name === 'telefono' && !phoneRegex.test(trimmedValue)) {
      newErrors.telefono = 'El teléfono debe contener 10 dígitos numéricos.';
    } else {
      delete newErrors.telefono;
    }

    // Validación de la contraseña
    if (name === 'password') {
      const passwordErrors = checkPasswordRules(trimmedValue);
      if (passwordErrors.length > 0) {
        setPasswordError(passwordErrors.join(' '));
      } else {
        setPasswordError('');
        checkPasswordSafety(trimmedValue); // Verificar seguridad de la contraseña
      }
    }

    // Validación de la confirmación de contraseña
    if (name === 'confirmPassword') {
      if (trimmedValue !== formData.password) {
        setPasswordMatchError('Las contraseñas no coinciden.');
      } else {
        setPasswordMatchError('');
      }
    }

    setErrors(newErrors); // Actualizar los errores en el estado
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación final antes de enviar
    if (Object.keys(errors).length > 0) {
      return; // Detener el envío si hay errores
    }

    // Verificación de correo electrónico
    try {
      const correoResponse = await axios.post('https://backendgislive.onrender.com/api/verificar-correo', { correo: formData.correo });
      if (correoResponse.data.exists) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          correo: 'El correo ya está registrado. Intenta con otro.',
        }));
        return;
      }
    } catch (error) {
      console.error('Error al verificar el correo:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        correo: 'Error al verificar el correo.',
      }));
      return;
    }

    // Encriptación de la contraseña
    const hashedPassword = CryptoJS.SHA256(formData.password).toString();
    const registroData = {
      ...formData,
      password: hashedPassword,
    };

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/registro', registroData);
      setErrors({ success: 'Usuario registrado exitosamente' });
      console.log(response.data);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setErrors({ server: 'Error al registrar usuario' });
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
                label="Correo Electrónico"
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
                type="password"
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={!!passwordMatchError}
                helperText={passwordMatchError}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Registrar
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="secondary" onClick={() => history.goBack()} fullWidth>
                Atrás
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Registro;
