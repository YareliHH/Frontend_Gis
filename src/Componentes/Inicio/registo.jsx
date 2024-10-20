import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Box, InputAdornment } from '@mui/material';
import { Person, Email, Phone, Lock, AccountBox } from '@mui/icons-material';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const Registro = () => {     
  const [activeStep, setActiveStep] = useState(0);
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
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordSafe, setIsPasswordSafe] = useState(false);
  const [isPasswordFiltered, setIsPasswordFiltered] = useState(false);

  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Validar nombres (letras, incluyendo caracteres acentuados y espacios)
  const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/; // Validar correos electrónicos (solo Gmail, Hotmail y Outlook)
  const phoneRegex = /^[0-9]{10}$/; // Validar teléfonos (10 dígitos numéricos)

  // Verificar si la contraseña cumple con las reglas personalizadas
  const checkPasswordRules = (password) => {
    const errors = [];
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;
    const noRepeatingChars = !/(.)\1{2}/.test(password); // No repetir más de 3 letras seguidas

    if (!hasUpperCase) errors.push('Debe tener al menos una letra mayúscula.');
    if (!hasNumber) errors.push('Debe tener al menos un número.');
    if (!hasSpecialChar) errors.push('Debe tener al menos un símbolo especial.');
    if (!hasMinLength) errors.push('Debe tener más de 8 caracteres.');
    if (!noRepeatingChars) errors.push('No puede tener más de 3 letras seguidas iguales.');

    return errors;
  };

  // Verificar si la contraseña ha sido filtrada en brechas de seguridad
  const checkPasswordSafety = async (password) => {
    setIsLoading(true); // Iniciar la carga
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
      const prefix = hashedPassword.slice(0, 5);
      const suffix = hashedPassword.slice(5);

      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const hashes = response.data.split('\n').map(line => line.split(':')[0]);

      if (hashes.includes(suffix.toUpperCase())) {
        setPasswordError('Contraseña insegura: ha sido filtrada en brechas de datos.');
        setIsPasswordSafe(false);
        setIsPasswordFiltered(true); // Actualizar el estado de filtrado
      } else {
        setPasswordError('');
        setIsPasswordSafe(true);
        setIsPasswordFiltered(false); // Contraseña no filtrada
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      setPasswordError('Error al verificar la contraseña.');
    } finally {
      setIsLoading(false); // Detener la carga
    }
  };

  // Manejar cambios de campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData({
      ...formData,
      [name]: trimmedValue,
    });

    // Validaciones dinámicas
    switch (name) {
      case 'nombre':
        if (!nameRegex.test(trimmedValue)) {
          setErrors(prevErrors => ({ ...prevErrors, nombre: 'El nombre debe contener solo letras.' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, nombre: '' }));
        }
        break;
      case 'apellidoPaterno':
        if (!nameRegex.test(trimmedValue)) {
          setErrors(prevErrors => ({ ...prevErrors, apellidoPaterno: 'El apellido paterno debe contener solo letras.' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, apellidoPaterno: '' }));
        }
        break;
      case 'apellidoMaterno':
        if (!nameRegex.test(trimmedValue)) {
          setErrors(prevErrors => ({ ...prevErrors, apellidoMaterno: 'El apellido materno debe contener solo letras.' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, apellidoMaterno: '' }));
        }
        break;
      case 'correo':
        if (!emailRegex.test(trimmedValue)) {
          setErrors(prevErrors => ({ ...prevErrors, correo: 'El correo electrónico no es válido.' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, correo: '' }));
        }
        break;
      case 'telefono':
        if (!phoneRegex.test(trimmedValue)) {
          setErrors(prevErrors => ({ ...prevErrors, telefono: 'El teléfono debe contener 10 dígitos numéricos.' }));
        } else {
          setErrors(prevErrors => ({ ...prevErrors, telefono: '' }));
        }
        break;
      case 'password':
        const passwordErrors = checkPasswordRules(trimmedValue);
        if (passwordErrors.length > 0) {
          setPasswordError(passwordErrors.join(' '));
        } else {
          setPasswordError('');
        }
        break;
      case 'confirmPassword':
        if (trimmedValue !== formData.password) {
          setPasswordMatchError('Las contraseñas no coinciden.');
        } else {
          setPasswordMatchError('');
        }
        break;
      default:
        break;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseña
    if (passwordError) return;
    if (passwordMatchError) return;

    try {
      const correoResponse = await axios.post('https://backendgislive.onrender.com/api/verificar-correo', { correo: formData.correo });
      if (correoResponse.data.exists) {
        setErrors(prevErrors => ({ ...prevErrors, correo: 'El correo ya está registrado. Intenta con otro.' }));
        return;
      }
    } catch (error) {
      setErrors(prevErrors => ({ ...prevErrors, correo: 'Error al verificar el correo.' }));
      return;
    }

    // Encriptación usando CryptoJS
    const hashedPassword = CryptoJS.SHA256(formData.password).toString();

    const registroData = {
      ...formData,
      password: hashedPassword,
    };

    try {
      const response = await axios.post('https://backendgislive.onrender.com/api/registro', registroData);
      setErrors({});
      console.log(response.data);
      alert('Usuario registrado exitosamente');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setErrors(prevErrors => ({ ...prevErrors, general: 'Error al registrar usuario' }));
    }
  };

  return (
    <Container>
      {/* Renderizar el formulario aquí */}
      <Typography variant="h4" gutterBottom>Registro de Usuario</Typography>
      <form onSubmit={handleSubmit}>
        {/* Input para nombre */}
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          helperText={errors.nombre}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
          fullWidth
          margin="normal"
        />
        {/* Otros campos... */}
        <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar'}
        </Button>
      </form>
    </Container>
  );
};

export default Registro;
